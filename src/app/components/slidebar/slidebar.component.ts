import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-slidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './slidebar.component.html',
  styleUrl: './slidebar.component.scss'
})
export class SlidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  isActive(route: string): boolean {
    return this.router.url === route;
  }


  close() {
    this.closeSidebar.emit();
  }

}
