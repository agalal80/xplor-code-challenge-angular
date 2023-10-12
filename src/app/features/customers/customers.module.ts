import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from '../customers/customer-form/customer-form.component';

@NgModule({
    imports: [
        CommonModule,
        CustomersRoutingModule,
        SharedModule
    ],
    declarations: [
        CustomerListComponent,
        CustomerFormComponent
    ]
})
export class CustomersModule { }
