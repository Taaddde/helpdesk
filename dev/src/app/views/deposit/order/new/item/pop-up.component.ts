import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from 'app/shared/models/helpdesk/deposit/item';
import { OrderItem } from 'app/shared/models/helpdesk/deposit/orderitem';
import { Sector } from 'app/shared/models/helpdesk/sector';
import { itemService } from 'app/shared/services/helpdesk/deposit/item.service';
import { sectorService } from 'app/shared/services/helpdesk/sector.service';
import { userService } from 'app/shared/services/helpdesk/user.service';

@Component({
  selector: 'app-orderitem-popup',
  templateUrl: './pop-up.component.html',
  providers: [itemService, userService, sectorService]
})
export class OrderItemPopUpComponent implements OnInit {

    public orderItem: OrderItem;
    public identity;
    public token: string;

    public place: string = 'Articulo';

    public items: Item[];

    public sectors: Sector[];
    public tmpSectors: Sector[] = [];
  
  
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<OrderItemPopUpComponent>,
        private snackBar: MatSnackBar,
        private _userService: userService,
        private _itemService: itemService,
        private _sectorService: sectorService
    ){
        this.token = _userService.getToken();
        this.identity = _userService.getIdentity();
    }

    ngOnInit() {
        if(this.data.payload){
            let o: OrderItem = this.data.payload;
            this.orderItem = new OrderItem('', o.order, o.item, o.cant, o.obs, o.code, o.costSector);
            this.place = this.orderItem.item['name'] + ' | ' + this.orderItem.item['brand'];
        }else{
            this.orderItem = new OrderItem('',null,null,1,'','','');
        }

        this.getItems();
        this.getSectors();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 10000,
        });
    }
    
    submit(del?) {
        if(del){
            this.dialogRef.close({delete: true});
        }else{
            this.dialogRef.close({item: this.orderItem});
        }
    }

    getItems(){
        let query = {company: this.identity['company']['_id']};
        this._itemService.getList(this.token, query).subscribe(
            response =>{
              if(response.items){
                 this.items = response.items;
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
        );
    }


    getSectors(){
        this._sectorService.getList(this.token).subscribe(
            response =>{
              if(response.sectors){
                 this.sectors = response.sectors;
              }
            },
            error =>{
              this.openSnackBar(error.message, 'Cerrar');
            }
        );
    }


    filterSector(val){
        this.tmpSectors = this.sectors.filter(sector =>{
            return (sector.name).toLowerCase().includes(val.toString().toLowerCase());
        })
    }    
    
}
