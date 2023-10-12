import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Customer } from '../models/customer';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit, OnDestroy {
  customer: Customer  = {} as Customer;
  form!: UntypedFormGroup;
  disableSubmit!: boolean;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthenticationService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private customersService: CustomersService) {

  }

  ngOnInit() {
    this.form = new UntypedFormGroup({
      firstname: new UntypedFormControl(''),
      lastname: new UntypedFormControl(''),
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      phoneNumber: new UntypedFormControl(''),
      countryCode: new UntypedFormControl(''),
      gender: new UntypedFormControl(''),
      balance: new UntypedFormControl(''),
    });

    this.spinnerService.visibility.subscribe((value) => {
      this.disableSubmit = value;
    });

    this.route.paramMap.pipe(
      switchMap((params) => {
        const customerId = params.get('id') || '';
        return this.customersService.getById(customerId);
      })).subscribe((customer: Customer) => 
        {
          this.customer = customer;
          this.form.patchValue({...customer});
        }
      );
  }



  saveCustomer() {
    Object.assign(this.customer, this.form.getRawValue());

    const upsertSub =  this.customersService.upsert(this.customer).subscribe(
      e=> 
      {
        this.notificationService.openSnackBar('Customer info has been saved.');
      },
      error => {
          this.notificationService.openSnackBar(error.error);
      });
    this.subscriptions.push(upsertSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}



