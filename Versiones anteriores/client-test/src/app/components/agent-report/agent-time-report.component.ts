import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-agent-time-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.scss']
})
export class AgentTimeReportComponent implements OnInit {

  public type;
  public data;
  public options;
  @Input() labelChart: any[];
  @Input() dataChartP: any[];
  @Input() dataChartF: any[];


  constructor() {}
  ngOnInit() {
    this.getChart();
  }

  getChart(){
      this.type = 'bar';
      this.data = {
        labels:this.labelChart,
        datasets: [
          {
            label:'Número de tickets',
            backgroundColor:'#31d02e',
            data:this.dataChartF
          },
          {
            label:'Tiempo medio invertido',
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
          text:'Por trabajo (día actual)',
          fontSize:19
        }
      };
    }

}
