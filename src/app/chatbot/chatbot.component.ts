import { AfterViewInit, Component } from '@angular/core';
import { CommunicatorService } from '../communicator.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements AfterViewInit {
  cookieValue = '';
  chatVisible = false;
  isThinking = false;
  userInput = '';
  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  products: any[] = [];
  sales_orders: any[] = [];
  purchase_orders: any[] = [];

  private introShown = false;

  constructor(
    private communicatorService: CommunicatorService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {}

  ngAfterViewInit(): void {
    this.cookieValue = this.cookieService.get('Logs_Cookie_data');
    this.loadProducts();
    this.fetchPurchaseOrders();
    this.fetchSalesOrders();
  }

  toggleChat(): void {
    this.chatVisible = !this.chatVisible;

    if (this.chatVisible && !this.introShown) {
      this.messages.push({
        sender: 'bot',
        text: 'Hello, my name is Logic, how can I help you today?',
      });
      this.introShown = true;
    }
  }

  private loadProducts(): void {
    this.spinner.show();
    this.communicatorService
      .onSubmitService({
        token: this.cookieValue,
        key: 'GET_PRODUCTS',
      })
      .subscribe({
        next: (res) => {
          this.products = res.message || [];
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.spinner.hide();
        },
      });
  }

  private fetchPurchaseOrders(): void {
    this.communicatorService
      .onSubmitService({
        token: this.cookieValue,
        key: 'GET_PURCHASE_ORDERS',
      })
      .subscribe({
        next: (res) => {
          this.purchase_orders = res.message || [];
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching purchase orders:', err);
          this.spinner.hide();
        },
      });
  }

  private fetchSalesOrders(): void {
    this.communicatorService
      .onSubmitService({
        token: this.cookieValue,
        key: 'GET_SALES_ORDERS',
      })
      .subscribe({
        next: (res) => {
          this.sales_orders = res.message || [];
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching sales orders:', err);
          this.spinner.hide();
        },
      });
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });
    this.userInput = '';
    this.isThinking = true;

    const payload = {
      user_message: text,
      products: this.products,
      sales_orders: this.sales_orders,
      purchase_orders: this.purchase_orders,
      token: this.cookieValue,
    };

    this.communicatorService.askInventoryQuestion(payload).subscribe({
      next: (response: any) => {
        this.isThinking = false;

        this.messages.push({
          sender: 'bot',
          text: response.reply || 'No response.',
        });
      },
      error: () => {
        this.isThinking = false;

        this.messages.push({ sender: 'bot', text: 'AI request failed.' });
      },
    });
  }
}
