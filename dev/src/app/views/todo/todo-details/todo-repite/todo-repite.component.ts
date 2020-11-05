import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-repite-popop',
  templateUrl: './todo-repite.component.html',
}) 
export class TodoRepiteComponent {
  public type: string;
  public types = ['Cada semana', 'Cada X días'];
  public dayOfWeek = {
    lun: false,
    mar: false,
    mie: false,
    jue: false,
    vie: false,
    sab: false
  }

  public firstDate: Date;
  public lastDate: Date;
  public forDays: number = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TodoRepiteComponent>,
    private snackBar: MatSnackBar,
  ) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  submit() {
    if(!this.check()){
        return this.openSnackBar('Faltan campos para completar', 'Cerrar');
    }

    this.dialogRef.close({type: this.type, dayOfWeek: this.dayOfWeek, firstDate: this.firstDate, lastDate: this.lastDate, forDays: this.forDays})
  }

  check(): boolean{
    if(this.type != '' && this.firstDate && this.lastDate && this.forDays)
      return true;
    else
      return false;
  }
}
