import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { HeaderComponent } from "./components/header/header.component";
import { CommonModule } from '@angular/common';
import { SlidebarMobileComponent } from "./components/slidebar-mobile/slidebar-mobile.component";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SlidebarComponent, HeaderComponent, CommonModule, SlidebarMobileComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isSidebarOpen = false;
  title = 'reportApp';

  constructor(public router: Router) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (window.innerWidth <= 990) {
      this.isSidebarOpen = false;
    }
    else {
      this.isSidebarOpen = true;
    }
  }


  isRouteLogin(): boolean {
    return this.router.url === '/login';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
