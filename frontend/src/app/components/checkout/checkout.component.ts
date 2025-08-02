import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CheckoutService, PersonInfo } from '../../service/checkout.service';

// ime
// priimek
// naslov
// poštna številka
// kraj
// elektornski naslov
// telefon
// ID  za DDV (podjetja) (optional)

@Component({
  standalone: true,
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [ReactiveFormsModule, RouterLink]
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  total: number = 1; // Example total from cart, replace with dynamic value if needed
  personInfo: any = BehaviorSubject;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private checkoutService: CheckoutService // Inject service
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      city: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^(\\+386|0)[0-9]{8}$')]],
      companyID: [''] // Optional
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.checkoutService.setPersonInfo(this.checkoutForm.value as PersonInfo);
      console.log('Form Submitted', this.checkoutForm.value);
      // Add payment processing logic here (e.g., API call)
      this.router.navigate(['/payment-method']); // Navigate to a thank-you page after success
    }
  }
}
