import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Request } from 'app/shared/models/helpdesk/request';

@Component({
  selector: 'app-request-popup',
  templateUrl: './request-popup.component.html',
  styleUrls: ['./request-popup.component.css'],

})
export class RequestPopUpComponent implements OnInit {

    public request: Request;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<RequestPopUpComponent>,
        private dialog: MatDialog,
    
    ){}

    ngOnInit() {
        this.request = this.data.payload;
    }
}
