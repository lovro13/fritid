import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfoPage, InfoService } from '../../service/info.service';
import { Info } from '../info/info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink]
})
export class FooterComponent {
  constructor(private infoService: InfoService
  ) { }

  generalInfo: InfoPage[] = [];
  generalTerms: InfoPage[] = [];
  contactInfo = {
    address: 'Spodnje Stranje 33, 1242 Stahovica',
    phone: '051 338 710',
    email: 'info@tricd.si'
  };


  splitInfoPages(pages: InfoPage[]) {
    const generalInfo: InfoPage[] = [];
    const terms: InfoPage[] = [];

    pages.forEach(page => {
      const id = parseInt(page.link.split('/').pop() || '0', 10);

      if (id < 5) {
        generalInfo.push(page);
      } else {
        terms.push(page);
      }
    });

    return { generalInfo, terms };
  }

  myData = [
    { label: 'Moj profil', link: '/profile' }
  ];

  ngOnInit(): void {
    const pages = this.infoService.getInfoPages() || [];
    const { generalInfo, terms } = this.splitInfoPages(pages);

    this.generalInfo = generalInfo;
    this.generalTerms = terms;
  }

}


