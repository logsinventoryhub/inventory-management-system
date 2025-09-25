import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
  id: number;
  name?: string;
  code?: string;
  status?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Location {
  id: number;
  country?: string;
  state?: string;
  street?: string;
  date?: string;
  code?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  code?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Product {
  id: number;
  name?: string;
  cost_price?: number;
  price?: number;
  discount_price?: number;
  stock_alert?: number;
  category?: string;
  description?: string;
  image?: string;
  vat?: boolean;
  status?: string;
  code?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Customer {
  id: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  state?: string;
  street?: string;
  code?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Sale {
  id: number;
  product?: string;
  customer?: string;
  quantity_sold?: number;
  unit_price?: number;
  total_price?: number;
  assigned_to?: string;
  payment_status?: string;
  code?: string;
  status?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Purchase {
  id: number;
  product?: string;
  supplier?: string;
  quantity?: number;
  unit_cost?: number;
  total_cost?: number;
  status?: string;
  code?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Transfer {
  id: number;
  product?: string;
  quantity?: number;
  from_address?: string;
  to_address?: string;
  assigned_to?: string;
  status?: string;
  code?: string;
  date?: string;
  key?: string;
  message?: string;
  token?: string;
}

export interface Supplier {
  id: number;
  name?: string;
  email?: string;
  category?: string;
  phone?: string;
  website?: string;
  status?: string;
  date?: string;
  code?: string;
  key?: string;
  message?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicatorService {
  private apiUrl = 'https://logsinventory.com/LogsBackendFiles/logsapi.php';
  private countriesUrl =
    'https://logsinventory.com/logs_assets/json/countries.json';
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();
  private aiApiUrl = 'https://ai-inventory-bot.onrender.com/chat';
  private aiAnalysisApiUrl =
    'https://ai-inventory-bot.onrender.com/ask-inventory';

  askInventoryQuestion(data: any) {
    return this.http.post(this.aiAnalysisApiUrl, data);
  }

  setData(data: any) {
    this.dataSource.next(data);
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.aiApiUrl, {
      user_message: message,
    });
  }

  constructor(private http: HttpClient) {}

  onSubmitFormData(formData: FormData) {
    return this.http.post<any>(
      'https://logsinventory.com/LogsBackendFiles/logsapi.php',
      formData
    ); // Replace with your backend URL
  }

  onSubmitService(formInputs: any): Observable<any> {
    return this.http.post<any>(
      'https://logsinventory.com/LogsBackendFiles/logsapi.php',
      formInputs
    );
  }

  onGetService(formInputs: any): Observable<any> {
    // For GET, parameters go in the URL as query params
    return this.http.get<any>(
      'https://logsinventory.com/LogsBackendFiles/logsapi.php',
      { params: formInputs }
    );
  }

  onUpdateService(formInputs: any): Observable<any> {
    return this.http.put<any>(
      'https://logsinventory.com/LogsBackendFiles/logsapi.php',
      formInputs
    );
  }

  getCountriesData(): Observable<any[]> {
    return this.http.get<any[]>(this.countriesUrl);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}`, category);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}`, customer);
  }

  updateLocation(location: Location): Observable<Location> {
    return this.http.put<Supplier>(`${this.apiUrl}`, location);
  }

  updateProduct(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  updatePurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.apiUrl}`, purchase);
  }

  updateSale(sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}`, sale);
  }

  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}`, supplier);
  }

  updateTransfer(transfer: Transfer): Observable<Transfer> {
    return this.http.put<Transfer>(`${this.apiUrl}`, transfer);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}`, user);
  }

  deleteItem(formInputs: any): Observable<any> {
    return this.http.put<Category>(`${this.apiUrl}`, formInputs);
  }
}
