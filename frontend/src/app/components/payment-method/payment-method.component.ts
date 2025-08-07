import { CurrencyPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService } from '../../service/checkout.service';
import { CartService } from '../../service/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  imports: [ReactiveFormsModule, CurrencyPipe]
})
export class PaymentMethodComponent {
  @Input() total: number = 0;
  @Output() paymentComplete = new EventEmitter<string>();

  selectedMethod: string | null = null;
  selectedBank: string = "";

  banks = ['nlb', 'skb', 'abanka', 'gorenjska', 'unicredit'];

  cardForm: FormGroup;

  constructor(private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private http: HttpClient,
  private router: Router) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{16,19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],

    });
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
    this.selectedBank = "";
  }

  selectBank(bank: string) {
    this.selectedBank = bank;
  }

  getBankName(bankCode: string): string {
    const bankNames: { [key: string]: string } = {
      'nlb': 'NLB',
      'skb': 'SKB Banka',
      'abanka': 'A Banka',
      'gorenjska': 'Banka Gorenjska',
      'unicredit': 'UniCredit Banka'
    };
    return bankNames[bankCode] || bankCode;
  }

  processPayment() {
    if (this.cardForm.valid) {
      // In a real app, you would process the payment here
      console.log('Processing card payment', this.cardForm.value);
      this.paymentComplete.emit('card');
    }
  }

  confirmCashPayment() {
    console.log('Cash payment confirmed');
    this.paymentComplete.emit('cash');
    // Use observables to get the latest values

    combineLatest([
      this.checkoutService.personInfo$,
      this.cartService.cartItems$
    ])
    .pipe(take(1))
    .subscribe(([personInfo, cartItems]) => {
      const payload = {
        personInfo,
        cartItems
      };

      this.http.post('http://localhost:8080/api/checkout', payload).subscribe({
        next: (response) => {
          console.log('Checkout success', response);
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('Checkout failed', err);
        }
      });
    });
  }

  processBankPayment() {
    if (this.selectedBank) {
      console.log('Processing bank payment with', this.selectedBank);
      this.paymentComplete.emit('bank');
    }
  }
}