import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private urlSubscription?: Subscription;
  activeTab: string = 'lessons';

  constructor(private router: Router) {}

  ngOnInit() {
    this.setActiveTab(this.router.url);

    this.urlSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveTab(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    this.urlSubscription?.unsubscribe();
  }

  async switchTab(tab: string) {
    await this.router.navigate(['/admin/dashboard', tab]);
  }

  private setActiveTab(url: string) {
    if (url.includes('/teachers')) {
      this.activeTab = 'teachers';
    } else if (url.includes('/students')) {
      this.activeTab = 'students';
    } else {
      this.activeTab = 'lessons';
    }
  }

}
