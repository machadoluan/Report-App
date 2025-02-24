import { Component, inject, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RouterLink } from '@angular/router';
import { SheetCreateComponent } from '../sheet-create/sheet-create.component';

@Component({
  selector: 'app-slidebar-mobile',
  imports: [RouterLink],
  templateUrl: './slidebar-mobile.component.html',
  styleUrl: './slidebar-mobile.component.scss'
})
export class SlidebarMobileComponent {
  private _bottomSheet = inject(MatBottomSheet);



  openBottomSheet(): void {
    this._bottomSheet.open(SheetCreateComponent);
  }

}
