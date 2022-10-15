import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-join-waitlist-success-bottomsheet',
  templateUrl: './join-waitlist-success-bottomsheet.component.html',
  styleUrls: ['./join-waitlist-success-bottomsheet.component.css']
})
export class JoinWaitlistSuccessBottomsheetComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public inputData: any,
  private _bottomSheetRef: MatBottomSheetRef<JoinWaitlistSuccessBottomsheetComponent>) { }

  ngOnInit(): void {
    console.log('what is coming in',this.inputData);
  }

}
