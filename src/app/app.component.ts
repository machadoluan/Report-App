import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlidebarComponent } from './components/slidebar/slidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SlidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reportApp';
}
