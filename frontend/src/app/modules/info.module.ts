import { Injectable } from '@angular/core';

export interface InfoPage {
  label: string,
  link: string
}

@Injectable({ providedIn: 'root' })
export class InfoService {
  private infoPages: InfoPage[] = [
    { label: 'O nas', link: '/info/1' },
    { label: 'Postopek nakupa', link: '/info/2' },
    { label: 'Varnost nakupa', link: '/info/3' },
    { label: 'Reklamacije in vračilo blaga', link: '/info/4' },
    { label: 'Splošni pogoji', link: '/info/5' },
    { label: 'Cene in plačilni pogoji', link: '/info/6' },
    { label: 'Pogoji dostave in davki', link: '/info/7' },
    { label: 'Varnost podatkov', link: '/info/8' },
    { label: 'Avtorska zaščita', link: '/info/9' }
  ];

  getInfoPages(): InfoPage[] {
    return this.infoPages
  }
}
