import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoPage, InfoService } from '../../service/info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info',
  imports: [],
  templateUrl: './info.html',
  styleUrl: './info.scss'
})
export class Info {

  infoPage: any;
  private routeSubscription!: Subscription;


  constructor(
    private route: ActivatedRoute,
    private infoService: InfoService
  ) { }

  ngOnInit() {
    this.loadInfoPage();
    this.routeSubscription = this.route.paramMap.subscribe(() => {
      this.loadInfoPage();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadInfoPage() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.infoPage = this.infoService.getInfoPageById(id);
    } else {
      console.error("Info page id not found in route");
    }
  }
}
