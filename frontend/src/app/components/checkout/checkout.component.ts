import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  imports: [ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  total: number = 1; // Example total from cart, replace with dynamic value if needed

  constructor(private fb: FormBuilder, private router: Router) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{4}\\s?[0-9]{4}\\s?[0-9]{4}\\s?[0-9]{4}$')]],
      expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Form Submitted', this.checkoutForm.value);
      // Add payment processing logic here (e.g., API call)
      this.router.navigate(['/thank-you']); // Navigate to a thank-you page after success
    }
  }
}
