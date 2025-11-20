import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MyService } from '../../../../services/my-service';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Observable, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../../../models/User';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-page',
  imports: [MatDrawer, CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  RouterModule],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;

  activatedRoute = inject(ActivatedRoute);
  myService = inject(MyService);
  toastrService = inject(ToastrService);
  cd = inject(ChangeDetectorRef);
  location = inject(Location);
  router = inject(Router)

  users: User[] = [];

  selectedUserToTransferToId = "";

  amount: number = 0;

  account: any
  email!: string
  userId: any;
  loading = false;
  loadingUsers = false;
  selectedAction: "deposit" | "withdrawal"  = "deposit";

  user$!: Observable<any>;

  toggleNav(action: "deposit" | "withdrawal") {
    this.selectedAction = action;
    this.drawer.open();
  }

  //  redirectToTransferPage() {
  //   const userId = (this.user$ | async)?.account?.userId; 
  //   // OR get it from a local property if already available

  //   if (userId) {
  //     this.router.navigate([`/transfer/${userId}`]);
  //   }
  // }


  back() {
    this.location.back();
  }
  toggleCloseNav() {
    this.drawer.close();
  }
  onDrawerToggled(isOpen: boolean) {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  withdraw(user: string) {
    if (!user || !this.amount) {
      return;
    }

    const data = {
      userId: user,
      amount: this.amount
    }

    this.loading = true;
    this.myService.withdraw(data)
      .subscribe({
        next: (res: any) => {
          // console.log("my res", res);
          this.toastrService.success("Withdrwal successful")
          this.fetchUserBalance(user)
          this.amount = 0;
          this.drawer.close()
          this.loading = false;
        }, error: (err) => {
          this.loading = false
          console.error("error", err)
          this.toastrService.error(err?.error?.message || "Error")
        }
      })

  }
 
  deposit(userId: string) {
    if (!this.amount || this.amount <= 0) {
      this.toastrService.error("Please enter amount")
      return;
    }
    const data = {
      userId,
      amount: this.amount
    }
    this.loading = true
    this.myService.depositFunds(data)
      .subscribe({
        next: (res: any) => {
          //console.log("data", res)
          this.toastrService.success("Deposited")
          this.amount = 0;
          this.drawer.close();
          if (this.userId) {
            this.fetchUserBalance(this.userId);
          }
          this.loading = false;
        }, error: (err) => {
          this.loading = false;
          console.error("error", err)
          return this.toastrService.error(err?.error?.message || "Error depositing")
        }
      })
  }
  ngOnInit(): void {
    this.user$ = this.activatedRoute.params.pipe(
      tap(p => this.userId = p['userId']), 
      switchMap(p =>
        this.myService.viewUserBalance(p['userId'])
        ),
      tap({
        next: (res: any) => {
          this.loading = false; // stop spinner
          if (res.user) this.email = res.user;
          if (res.account) this.account = res.account;
        },
        error: () => {
          this.loading = false; // stop spinner on error too
        }
      })
    );
    this.fetchUsers();

    this.loading = true; // start spinner before observable emits
  }



  fetchUserBalance(userId: string) {
    this.myService.viewUserBalance(userId).subscribe({
      next: (res: any) => {
        if (res.user) {
          this.email = res.user;
        }
        if (res.account) {
          this.account = res.account;
        }
        // console.log(res)
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  fetchUsers() {
    this.loadingUsers = true;
    this.myService.getUsers()
      .subscribe({
        next: (res: any) => {
          //console.log(res.users);
          if (res.users) {
            this.users = res.users;
          }
          this.loadingUsers = false;
        },
        error: (err) => {
          this.loadingUsers = false;
          console.log("Server error", err)
        }
      })
  }


}
