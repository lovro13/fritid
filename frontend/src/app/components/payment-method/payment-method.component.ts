import { CurrencyPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{16,19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      cardHolder: ['', [Validators.required, Validators.minLength(2)]]
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
    const bankNames: {[key: string]: string} = {
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
  }

  processBankPayment() {
    if (this.selectedBank) {
      console.log('Processing bank payment with', this.selectedBank);
      this.paymentComplete.emit('bank');
    }
  }
}