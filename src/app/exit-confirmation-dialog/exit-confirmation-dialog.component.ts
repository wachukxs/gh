import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-exit-confirmation-dialog',
  templateUrl: './exit-confirmation-dialog.component.html',
  styleUrls: ['./exit-confirmation-dialog.component.css']
})
export class ExitConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ExitConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  okayWait() {
    this.dialogRef.close('wait');
  }

}
