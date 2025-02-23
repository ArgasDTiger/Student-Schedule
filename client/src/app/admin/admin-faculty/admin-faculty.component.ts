import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Faculty} from "../../core/models/faculty";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";

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
  private routeSubscription?: Subscription;
  faculty?: Faculty;
  activeTab: string = 'moderators';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  async switchTab(tab: string) {
    if (this.faculty) {
      await this.router.navigate(['/admin/faculty', this.faculty.id, tab]);
    }
  }
}
