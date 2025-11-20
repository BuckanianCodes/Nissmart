import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MyService } from '../../../../services/my-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-system-summary',
  imports: [MatProgressSpinnerModule, CommonModule, RouterLink],
  templateUrl: './system-summary.html',
  styleUrl: './system-summary.css',
})
export class SystemSummary implements OnInit {

  totalUsers!: number;
  totalAmount!: number;
  totalWithdrawals!: number;
  totalTransactions!:number;
  error!: string
  loading = false;

  myService = inject(MyService);
  cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.fetchSummary();
  }

fetchSummary() {
  this.loading = true;
  this.myService.getSummary().subscribe({
    next: (res: any) => {
      console.log('Summary response:', res); 
      this.totalAmount = res.totalAmount || 0;
      this.totalUsers = res.totalUsers || 0;
      this.totalWithdrawals = res.totalWithdrawals || 0;
      this.totalTransactions = res.totalTransactions || 0;
      this.loading = false;
         this.cd.detectChanges();
    },
    error: (err) => {
      console.error("Error fetching summary:", err);
      this.error = err?.message || "Error fetching summary";
      this.loading = false;
         this.cd.detectChanges();
    }
  });
}

}
