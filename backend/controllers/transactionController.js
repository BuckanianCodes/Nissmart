const { default: mongoose } = require("mongoose");
const { getTimestamp } = require("../helpers/time/time");
const { accountModel } = require("../models/accountModel");
const { auditLogModel } = require("../models/auditLogModel");
const { idempotencyKeyModel } = require("../models/idempotencyKeyModel");
const { ledgerEntryModel } = require("../models/ledgerEntryModel");
const { transactionModel } = require("../models/transactionModel");
const { userModel } = require("../models/UserModel");
const { withdrawalModel } = require("../models/withdrawalModel");

exports.transferFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { from_account, to_account, amount, idempotency_key } = req.body;

    if (!from_account || !to_account || !amount || !idempotency_key) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (from_account === to_account) {
      return res.status(400).json({ message: "Cannot transfer funds to the same account" });
    }

    // Check idempotency
    const existingKey = await idempotencyKeyModel.findOne({ key: idempotency_key });
    if (existingKey) {
      return res.status(409).json({ message: "Duplicate transfer request" });
    }

    const sender = await accountModel.findOne({ userId: from_account }).session(session);
    const recepient = await accountModel.findOne({ userId: to_account }).session(session);

    if (!sender || !recepient) {
      return res.status(404).json({ message: "Sender or recepient account not found" });
    }

    // Check sender balance


    if (!sender || !recepient) {
      return res.status(404).json({ message: "Sender or recepient account not found" });
    }

    // Check sender balance
    if (amount > sender.balance) {
      return res.status(400).json({ message: "Insufficient funds in account" });
    }

   

    const timeStamp = getTimestamp();

    // Create transaction
    const transaction = await transactionModel.create([{
      type: "transfer",
      fromAccount: from_account,
      toAccount: to_account,
      amount,
      timeStamp
    }], { session });

    // Debit ledger
    const debitLedger = await ledgerEntryModel.create([{
      transactionId: transaction[0]._id,
      accountId: from_account,
      entryType: "debit",
      amount,
      balanceAfter: sender.balance - amount,
      timeStamp
    }], { session });

    // Credit ledger
    const lastRecepientLedger = await ledgerEntryModel
      .find({ accountId: to_account })
      .sort({ created_at: -1 })
      .limit(1)
      .session(session);


    const creditLedger = await ledgerEntryModel.create([{
      transactionId: transaction[0]._id,
      accountId: to_account,
      entryType: "credit",
      amount,
      balanceAfter: recepient.balance + amount,
      timeStamp
    }], { session });

    // Update balances
    sender.balance = sender.balance - amount,
    recepient.balance = recepient.balance + amount,

    await sender.save({ session });
    await recepient.save({ session });

    // Save idempotency key
    await idempotencyKeyModel.create([{
      key: idempotency_key,
      userId: from_account,
      transactionId: transaction[0]._id,
      timeStamp
    }], { session });

    // Log audit
    await auditLogModel.create([{
      actorId: from_account,
      action: "TRANSFER_FUNDS",
      transactionId: transaction[0]._id,
      timeStamp
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Transfer successful",
      transaction: transaction[0],
      debitLedger: debitLedger[0],
      creditLedger: creditLedger[0]
    });

  } catch (error) {
    console.error("Transfer error", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.withdrawFromAccount = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: "UserId and amount are required" });
    }

    const account = await accountModel.findOne({ userId }).session(session);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance < amount) {
      // Failed transaction
      const failedTransaction = await transactionModel.create([{
        accountId: account._id,
        amount,
        type: "withdrawal",
        status: "failed",
        timeStamp: getTimestamp(),
      }], { session });

      await withdrawalModel.create([{
        transactionId: failedTransaction[0]._id,
        accountId: account._id,
        amount,
        status: "failed",
        timeStamp: getTimestamp()
      }], { session });

      await auditLogModel.create([{
        action: "withdrawal_failed",
        actorId: userId,
        amount,
        timeStamp: getTimestamp()
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(400).json({ message: "Insufficient funds in account" });
    }

    // Successful transaction
    const transaction = await transactionModel.create([{
      accountId: account._id,
      amount,
      type: "withdrawal",
      status: "allocated",
      timeStamp: getTimestamp()
    }], { session });

    await withdrawalModel.create([{
      transactionId: transaction[0]._id,
      accountId: account._id,
      amount,
      status: "allocated",
      timeStamp: getTimestamp()
    }], { session });

    await auditLogModel.create([{
      action: "withdrawal_successful",
      actorId: userId,
      amount,
      timeStamp: getTimestamp()
    }], { session });

    // Update account using session
    account.balance -= amount;
    await account.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: "Withdrawal successful" });

  } catch (error) {
    console.error("WITHDRAW ERROR:", error);
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.depositFunds = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const timeStamp = getTimestamp();
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: "UserId and amount are required" });
    }

    const depositAmount = Number(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Find the account by userId
    const account = await accountModel.findOne({ userId }).session(session);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Get last ledger entry to calculate balanceAfter
    const lastLedger = await ledgerEntryModel
      .find({ accountId: account._id })
      .sort({ timeStamp: -1 })
      .limit(1)
      .session(session);

    const lastBalance = lastLedger.length ? lastLedger[0].balanceAfter : 0;

    // Update account balance
    account.balance += depositAmount;
    await account.save({ session });

    // Create transaction
    const transaction = await transactionModel.create([{
      accountId: account._id,
      amount: depositAmount,
      type: "deposit",
      status: "allocated",
      timeStamp
    }], { session });

    // Create ledger entry
    await ledgerEntryModel.create([{
      transactionId: transaction[0]._id,
      accountId: account._id,
      userId: account.userId,
      amount: depositAmount,
      balanceAfter: account.balance,
      entryType: "credit",
      description: "Deposit of funds",
      timeStamp
    }], { session });

    // Create audit log
    await auditLogModel.create([{
      action: "deposit_of_funds",
      actorId: userId,
      amount: depositAmount,
      timeStamp
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Funds deposited successfully",
      transaction: transaction[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Deposit ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.transactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({});

    return res.status(200).json({
      message: "Available transactions",
      transactions
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }

}