import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.scss']
})
export class TicketReportComponent implements OnInit {

  public type;
  public data;
  public options;
  @Input() typeChart: string;
  @Input() labelChart: any[];
  @Input() dataChart: any[];


  constructor() {
    
  }

  ngOnInit() {
    this.getChart();
  }

  getChart(){
    if(this.typeChart == 'status_pie'){
      this.type = 'pie';
      this.data = {
        labels:this.labelChart,
        datasets: [{
          label:'Tickets',
          backgroundColor:[
            '#47b8b8',
            '#31d02e',
            '#929292',
            '#ff7235',
          ],
          borderColor:[
            '#4e73df',
            '#4e73df',
            '#4e73df',
            '#4e73df'
          ],
          data:this.dataChart
        }]
      };
      this.options = {
        responsive: true,
        maintainAspectRatio:true,
        legend:{
          display:true,
          position:'top',
          reverse:false
        },
        title:{
          display:true,
          text:'Por estado',
          fontSize:19
        }
      };
    }

    if(this.typeChart == 'time_bar'){
      this.type = 'bar';
      this.data = {
        labels:this.labelChart,
        datasets: [{
          label:'Cantidad de tickets',
          backgroundColor:[
            '#47b8b8',
            '#ff7235',
            '#929292',
            '#31d02e',
          ],
          borderColor:[
            '#4e73df',
            '#4e73df',
            '#4e73df',
            '#4e73df'
          ],
          data:this.dataChart
        }]
      };
      this.options = {
        responsive: true,
        maintainAspectRatio:true,
        legend:{
          display:true,
          position:'top',
          reverse:false
        },
        title:{
          display:true,
          text:'Por mes',
          fontSize:19
        }
      };
    }
  }
}