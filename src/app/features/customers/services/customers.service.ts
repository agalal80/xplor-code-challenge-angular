import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  readonly baseUrl = `${environment.apiRootUrl}/Customer`;
  constructor(private httpclient: HttpClient) { }

  public getAll(): Observable<Customer[]> {
    return this.httpclient.get<Customer[]>(this.baseUrl);
  }

  public getById(customerId: string): Observable<Customer> {
    return this.httpclient.get<Customer>(`${this.baseUrl}/${customerId}`);
  }

  public upsert(customer: Customer): Observable<any> {
    if(customer.id != null && customer.id != ''){
      return this.httpclient.put(`${this.baseUrl}`, customer);
    }
    return this.httpclient.post(`${this.baseUrl}`, customer);
  }

  public delete(customerId: string): Observable<any> {
      return this.httpclient.delete(`${this.baseUrl}/${customerId}`);
  }
}
