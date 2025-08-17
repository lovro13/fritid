import { CurrencyPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService } from '../../service/checkout.service';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { combineLatest, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  imports: [ReactiveFormsModule, CurrencyPipe]
})
export class PaymentMethodComponent implements OnInit {
  @Input() total: number = 0;
  @Output() paymentComplete = new EventEmitter<string>();

  selectedMethod: string | null = null;
  selectedBank: string = "";

  banks = ['nlb', 'skb', 'abanka', 'gorenjska', 'unicredit'];

  cardForm: FormGroup;

  constructor(private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{16,19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]],

    });
  }

  ngOnInit() {
    // Auto-fill user data if logged in
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.authService.getUserById(currentUser.id).subscribe(
        (user) => {
          // Auto-fill name in card form
          this.cardForm.patchValue({
            cardHolder: `${user.firstName} ${user.lastName}`
          });
        },
        (error) => {
          console.error('Failed to fetch user details:', error);
        }
      );
    }
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
      console.log('Processing card payment', this.cardForm.value);
      this.paymentComplete.emit('card');

      // Submit checkout data to backend
      combineLatest([
        this.checkoutService.personInfo$,
        this.cartService.cartItems$
      ])
        .pipe(take(1))
        .subscribe(([personInfo, cartItems]) => {
          const currentUser = this.authService.getCurrentUser();
          const payload = {
            personInfo,
            cartItems,
            userId: currentUser?.id || null  // Include userId if logged in
          };
          console.log('Checkout payload:', payload);
          this.http.post( `${environment.apiBase}/checkout`, payload).subscribe({
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
        const currentUser = this.authService.getCurrentUser();
        const payload = {
          personInfo,
          cartItems,
          userId: currentUser?.id || null  // Include userId if logged in
        };
        
        console.log('Checkout payload:', payload);
        console.log('sending to backend: ', `${environment.apiBase}/checkout`)
        this.http.post(`${environment.apiBase}/checkout`, payload).subscribe({
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