import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd, RouterOutlet} from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Group } from "../../core/models/group";
import { UserService } from "../../core/services/user.service";

@Component({
  selector: 'app-moderator-overview',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './moderator-overview.component.html',
  styleUrl: './moderator-overview.component.scss'
})
export class ModeratorOverviewComponent implements OnInit, OnDestroy {
  private currentUserSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private urlSubscription?: Subscription;

  userGroups: Group[] = [];
  groupId?: number;
  activeTab: string = 'schedule';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.groupId = +id;
      }
    });

    this.currentUserSubscription = this.userService.currentUser$.subscribe(
      user => {
        this.userGroups = user?.faculties?.flatMap(f => f.groups) ?? [];
      }
    );

    this.setActiveTab(this.router.url);

    this.urlSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveTab(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    this.currentUserSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.urlSubscription?.unsubscribe();
  }

  private setActiveTab(url: string) {
    if (url.includes('/manage')) {
      this.activeTab = 'manage';
    } else {
      this.activeTab = 'schedule';
    }
  }

  async switchTab(tab: string) {
    if (this.groupId) {
      await this.router.navigate(['/moderator', this.groupId, tab]);
    }
  }

  get selectedGroupNumber(): string | undefined {
    return this.userGroups.find(g => g.id === this.groupId)?.groupNumber.toString();
  }
}
