import { Component, inject, OnInit } from '@angular/core';
import { MyService } from '../../../services/my-service';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {

  totalUsers!:number;
  totalAccountAmounts!:number;
  totalWithdrwals!:number;



  myService = inject(MyService);

  ngOnInit(): void {
   console.log("Admin")


  
  }

}
