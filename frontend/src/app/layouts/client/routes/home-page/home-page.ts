import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MyService } from '../../../../services/my-service';
import { User } from '../../../../models/User';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-home-page',
  imports: [CommonModule, MatDrawer, MatSelectModule, MatFormFieldModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  myService = inject(MyService);
  toastrService = inject(ToastrService);
  router = inject(Router);
  fb = inject(FormBuilder);

  protected createUserForm!: FormGroup;
  protected submitted = false;



  users: User[] = [];
  loading = false;
  selectedUserId = "";

  private initializeForm(): void {
    this.createUserForm = this.fb.group({
      email: this.fb.control('', Validators.required),
      fullName: this.fb.control('', Validators.required),
    })
  }

  createUser(): void {
    // console.log("Called")
    this.submitted = true;
    const userData = {
      email: this.createUserForm.value.email,
      fullName: this.createUserForm.value.fullName
    }
    if (this.createUserForm.valid) {
      this.loading = true;
      this.myService.createUser(userData)
        .subscribe({
          next: (res: any) => {
            // console.log("User creates", res);
            this.toastrService.success("User created");
            this.createUserForm.reset();
            this.drawer.close();

            const userId = res.user._id;
            this.router.navigateByUrl(`/user/${userId}`);

            this.fetchUsers();
            this.loading = false;
            this.submitted = false;
          }, error: (err) => {
            this.loading = false;
            this.submitted = false;
            this.createUserForm.reset();
            //console.error("Error",err);
            if (err.error?.message === "User with this email already exists") {
              this.toastrService.error("This email is already registered");
              return;
            }
            this.toastrService.error("Error creating user")
          }
        })
    }
  }

  toggleNav() {
    this.drawer.open();
  }

  toggleCloseNav() {
    this.drawer.close();
  }
  redirectToUserPage(userId: string) {
    this.router.navigateByUrl(`/user/${userId}`)
  }

  onDrawerToggled(isOpen: boolean) {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  constructor() {
    this.initializeForm()
  }

  ngOnInit(): void {
    this.fetchUsers()
  }

  fetchUsers() {
    this.loading = true
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
