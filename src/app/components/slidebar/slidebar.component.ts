import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-slidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './slidebar.component.html',
  styleUrl: './slidebar.component.scss'
})
export class SlidebarComponent {

  constructor(private router: Router){}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
