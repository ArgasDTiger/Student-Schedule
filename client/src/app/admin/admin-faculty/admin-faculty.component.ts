import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Faculty } from "../../core/models/faculty";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { UserService } from "../../core/services/user.service";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-admin-faculty',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './admin-faculty.component.html',
  styleUrl: './admin-faculty.component.scss'
})
export class AdminFacultyComponent implements OnInit, OnDestroy {
  private currentUserSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private urlSubscription?: Subscription;
  private facultyId?: number;

  faculty?: Faculty;
  activeTab: string = 'moderators';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.facultyId = +id;
      }
    });

    this.setActiveTab(this.router.url);

    this.currentUserSubscription = this.userService.currentUser$.subscribe(user => {
      this.faculty = user?.faculties?.find(f => f.id === this.facultyId);
    });

    this.urlSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveTab(event.urlAfterRedirects);

        this.currentUserSubscription?.unsubscribe();
        this.currentUserSubscription = this.userService.currentUser$.subscribe(user => {
          this.faculty = user?.faculties?.find(f => f.id === this.facultyId);
        });
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    this.currentUserSubscription?.unsubscribe();
    this.urlSubscription?.unsubscribe();
  }

  async switchTab(tab: string) {
    if (this.faculty) {
      await this.router.navigate(['/admin/faculty', this.faculty.id, tab]);
    }
  }

  private setActiveTab(url: string) {
    if (url.includes('/groups')) {
      this.activeTab = 'groups';
    } else {
      this.activeTab = 'moderators';
    }
  }
}
