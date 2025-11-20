import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyService {

  private http = inject(HttpClient);

  baseUrl = "http://localhost:3000/api";

  getSummary(){
    return this.http.get(this.baseUrl + "/summary/get");
  }

  getUsers(){
    return this.http.get(this.baseUrl + "/user/get")
  }

  createUser(data:{fullName:string;email:string}){
    return this.http.post(this.baseUrl + "/user/create/",data);
  }

  viewUserBalance(userId:string){
    return this.http.get(this.baseUrl + `/user/balance/${userId}`);

  }

  depositFunds(data:{userId:string,amount:number}){

    return this.http.post(this.baseUrl + "/transactions/deposit",data)
  }

  getTransactions(){
    return this.http.get(this.baseUrl + "/transactions/get")
  }

  getAudits(){
    return this.http.get(this.baseUrl + "/summary/logs")
  }

  transferFunds(data:{from_account:string,to_account:string,amount:number,idempotency_key:string}){
    return this.http.post(this.baseUrl + "/transactions/transfer",data);
  }

  withdraw(data:{userId:string,amount:number}){
    return this.http.post(this.baseUrl + `/transactions/withdraw`,data)
  }

  
}
