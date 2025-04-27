import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel'

@Component({
  selector: 'app-home',
  imports: [CarouselModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  menuMobile: boolean = false
  ngOnInit(): void {

  }


  toggleMenuBar() {
    this.menuMobile = !this.menuMobile
  }
}

