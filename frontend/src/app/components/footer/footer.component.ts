import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink]
})
export class FooterComponent {
  contactInfo = {
    address: 'Spodnje Stranice 33, 1242 Stahovica',
    phone: '051 338 710',
    email: 'info@tricd.si'
  };

  generalInfo = [
    { label: 'O nas', link: '/about' },
    { label: 'Postopek nakupa', link: '/purchase-process' },
    { label: 'Varnost nakupa', link: '/secure-shopping' },
    { label: 'Reklamacije in vračilo blaga', link: '/returns' }
  ];

  generalTerms = [
    { label: 'Splošni pogoji', link: '/terms' },
    { label: 'Cene in plačilni pogoji', link: '/pricing' },
    { label: 'Pogoji dostave in davki', link: '/delivery' },
    { label: 'Varnost podatkov', link: '/privacy' },
    { label: 'Avtorska zaščita', link: '/copyright' }
  ];

  myData = [
    { label: 'Moj profil', link: '/profile' }
  ];
}


