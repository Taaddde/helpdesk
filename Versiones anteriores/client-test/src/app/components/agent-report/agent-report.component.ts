import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-agent-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.scss']
})
export class AgentReportComponent implements OnInit {

  public type;
  public data;
  public options;
  @Input() typeChart: string;
  @Input() labelChart: any[];
  @Input() dataChartP: any[];
  @Input() dataChartF: any[];


  constructor() {}
  ngOnInit() {
    this.getChart();
  }

  getChart(){
    if(this.typeChart == 'status_horizontalBar'){
      this.type = 'horizontalBar';
      this.data = {
        labels:this.labelChart,
        datasets: [
          {
            label:'Finalizados',
            backgroundColor:'#31d02e',
            data:this.dataChartF
          },
          {
            label:'Pendientes',
            backgroundColor:'#ff7235',
            data:this.dataChartP
          }
        ]
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
  }

}
