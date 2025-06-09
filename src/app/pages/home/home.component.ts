import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel'

@Component({
  selector: 'app-home',
  imports: [CarouselModule, ButtonModule, CommonModule],
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

