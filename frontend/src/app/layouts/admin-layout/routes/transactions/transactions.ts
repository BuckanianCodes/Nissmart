import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MyService } from '../../../../services/my-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {

  displayedColumns: string[] = ['_id', 'accountId', 'type', 'amount', 'status', 'timeStamp'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  myService = inject(MyService);
  cd = inject(ChangeDetectorRef);
  location = inject(Location);
  transactions: [] = []
  loading = false;
  error!: string;
  back() {
    this.location.back();
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.loading = true;
    this.myService.getTransactions().subscribe({
      next: (res: any) => {
        if (res.transactions) {
          const tx = res.transactions
          this.dataSource.data = tx;
          this.loading = false

          console.log(res.transactions)

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cd.detectChanges();

        }
      }, error: (err) => {
        console.error("Error fetching transactions:", err);
        this.error = err?.message || "Error fetching summary";
        this.loading = false;
        this.cd.detectChanges();
      }
    })

  }

}
