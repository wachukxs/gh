import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface HouseData {
  houseType: string;
}

@Component({
  selector: 'app-house-detail-dialog',
  templateUrl: './house-detail-dialog.component.html',
  styleUrls: ['./house-detail-dialog.component.css']
})
export class HouseDetailDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HouseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HouseData
  ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
