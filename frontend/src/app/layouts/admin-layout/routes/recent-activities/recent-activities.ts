import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-recent-activities',
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './recent-activities.html',
  styleUrl: './recent-activities.css',
})
export class RecentActivities implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['_id', 'action', 'timeStamp'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  myService = inject(MyService);
  cd = inject(ChangeDetectorRef);
  location = inject(Location);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  back() {
    this.location.back();
  }

  loading = false;
  error!: string
  logs: [] = [];

  ngOnInit(): void {
    this.fetchLogs()
  }

  fetchLogs() {
    this.loading = true;
    this.myService.getAudits().subscribe({
      next: (res: any) => {
        if (res.audits) {
          const tx = res.audits
          this.dataSource.data = tx;
          this.loading = false;

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
