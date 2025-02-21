import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {Subscription} from "rxjs";
import {Group} from "../../core/models/group";
import {UserService} from "../../core/services/user.service";

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

  userGroups: Group[] = [];
  groupId?: number;
  activeTab: string = 'schedule';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

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
  }

  ngOnDestroy() {
    this.currentUserSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  async switchTab(tab: string) {
    this.activeTab = tab;
    console.log(`tab: ${tab} groupId: ${this.groupId}`);
    if (this.groupId) {
      if (tab === 'schedule') {
        await this.router.navigate(['/moderator', this.groupId, 'schedule']);
      } else if (tab === 'manage') {
        await this.router.navigate(['/moderator', this.groupId, 'manage']);
      }
    }
  }

  get selectedGroupNumber(): string | undefined {
    return this.userGroups.find(g => g.id === this.groupId)?.groupNumber.toString();
  }
}
