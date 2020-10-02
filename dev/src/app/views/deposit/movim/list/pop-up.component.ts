import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Movim } from 'app/shared/models/helpdesk/deposit/movim';

@Component({
  selector: 'app-movim-popup',
  templateUrl: './pop-up.component.html',

})
export class MovimPopUpComponent implements OnInit {

    public movim: Movim;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<MovimPopUpComponent>,
        private dialog: MatDialog,
    
    ){}

    ngOnInit() {
        this.movim = this.data.payload;
    }
}
