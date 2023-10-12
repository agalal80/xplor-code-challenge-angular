import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CustomersService } from '../services/customers.service';
import { Customer } from '../models/customer';
import { Subscription, of, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'phoneNumber',
    'countryCode',
    'gender',
    'balance',
    'edit',
    'delete'
  ];
  dataSource = new MatTableDataSource<Customer>([]);

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private customersService: CustomersService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Customers');
    this.initCustomers();
  }
  private initCustomers() {
    const customersSub = this.customersService.getAll().subscribe(result => {
      this.dataSource = new MatTableDataSource<Customer>(result);
      this.notificationService.openSnackBar('Customers loaded');
      this.dataSource.sort = this.sort;
      this.logger.log('Customers loaded');
    });
    this.subscriptions.push(customersSub);
  }

  deleteCustomer(customerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });
    dialogRef.afterClosed()
      .pipe(
        switchMap((confirmed: boolean) => {
          if (confirmed) {
            return this.customersService.delete(customerId);
          }
          return of(false);
        })).subscribe(e => {
          if (e !== false) {
            this.notificationService.openSnackBar('Customer has been deleted.');
            this.initCustomers();
          }
        }
        );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
