import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MyService } from '../../../../services/my-service';
import { User } from '../../../../models/User';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-funds',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    FormsModule],
  templateUrl: './transfer-funds.html',
  styleUrl: './transfer-funds.css',
})
export class TransferFunds implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  myService = inject(MyService);
  toastrService = inject(ToastrService);
  cd = inject(ChangeDetectorRef);
  // location = inject(Location);
  userId: any;
  loading = false;

  users: User[] = [];

  selectedUserToTransferToId = "";

  amount: number = 0;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (data) => {
        //nsole.log(data)
        if(data['userId']){
           this.userId = data['userId'];
        }
      }
    )
    this.fetchUsers()
  }

   transfer() {
    if (!this.selectedUserToTransferToId || !this.userId || !this.amount) {
      this.toastrService.error("PLease enter the required fields")
      return;
    }
    //nsole.log(this.selectedUserToTransferToId,this.userId)
    const data = {
      from_account: this.userId,
      to_account: this.selectedUserToTransferToId,
      amount: this.amount,
      idempotency_key: Math.random().toString(36).substring(2) + Date.now().toString(36)
    };

    this.loading = true;
    this.myService.transferFunds(data)
      .subscribe({
        next: (res: any) => {
        //console.log("my res", res)
          this.loading = false
          this.toastrService.success("Transfer successful");
        }, error: (err) => {
          this.loading = false;
          console.error("error", err);
          this.toastrService.error(err.error.message ||"Server error")
        }
      })
  }

  fetchUsers() {
    this.loading = true;
    this.myService.getUsers()
      .subscribe({
        next: (res: any) => {
          //console.log(res.users);
          if (res.users) {
            this.users = res.users;
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.log("Server error", err)
        }
      })
  }
}
