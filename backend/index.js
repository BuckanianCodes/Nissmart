const express = require("express");
const { indexRouter } = require("./routes/indexRouter");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require('cors');

require('dotenv').config();


app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api",indexRouter);

const connectToDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri,{
           family: 4, // Force IPv4
            tls: true,
            tlsAllowInvalidCertificates: false, // this ensures strict cert validation
            serverSelectionTimeoutMS: 5000
    })
    console.log("connected to database")
  } catch (error) {
    setTimeout(connectToDatabase,5000)
    console.error("Failed to connect to database",error)
  }
}

connectToDatabase()

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});