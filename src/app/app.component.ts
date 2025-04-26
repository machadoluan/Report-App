import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { HeaderComponent } from "./components/header/header.component";
import { CommonModule } from '@angular/common';
import { SlidebarMobileComponent } from "./components/slidebar-mobile/slidebar-mobile.component";
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SlidebarComponent, HeaderComponent, CommonModule, SlidebarMobileComponent, ToastModule, ConfirmDialog],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [CookieService]
})
export class AppComponent implements OnInit {
  isSidebarOpen = false;
  title = 'reportApp';
  excludedRoutes = ['/login', '/home', '/reset-password', '/', '/register'];

  constructor(public router: Router, private route: ActivatedRoute,  private cookieService: CookieService,) { }

  ngOnInit(): void {
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

  showDefaultLayout(): boolean {
    const currentRoute = this.router.url.split('?')[0].split('#')[0]; // Pega só o caminho puro, sem query e fragmentos
    return this.excludedRoutes.includes(currentRoute);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
