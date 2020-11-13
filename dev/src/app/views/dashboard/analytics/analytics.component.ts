import {
  Component,
  OnInit
} from "@angular/core";
import { egretAnimations } from "app/shared/animations/egret-animations";
import { ThemeService } from "app/shared/services/theme.service";
import tinyColor from 'tinycolor2';
import { ActivatedRoute } from "@angular/router";
import { userService } from "app/shared/services/helpdesk/user.service";
import { ticketService } from "app/shared/services/helpdesk/ticket.service";
import * as moment from 'moment';

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  providers: [userService, ticketService],
  styleUrls: ["./analytics.component.scss"],
  animations: egretAnimations
})
export class AnalyticsComponent implements OnInit {


  public ticketForAgentSource: any;
  public token: string;

  public reports: any;

  public colors = ['warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent', 'warn', 'primary', 'accent'];

  monthOptions: any;
  month: any;
  monthData: any;
  
  dayOptions: any;
  day: any;
  dayData: any;

  agentChart: any;
  agentBounceRate: any;
  requesterChartBar: any;

  columns = [
    {
      prop: 'subtype',
      name: 'Sub-tipo',
      flexGrow: 3
    },
    {
      prop: 'type',
      name: 'Tipo',
      flexGrow: 2
    },
    {
      prop: 'count',
      name: 'Tickets',
      flexGrow: 1
    },
  ];


  subtypeStats: any[];

  teams: any[];

  totalTickets: number;

  constructor(
    private themeService: ThemeService,
    private _route: ActivatedRoute,
    private _userService: userService,
    public _ticketService: ticketService

  ) {
    this.token = _userService.getToken();
  }

  ngAfterViewInit() {}
  ngOnInit() {

    this.getReports();

  }


  initTicketForAgent(data) {
    this.ticketForAgentSource = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      color: [
        '#ffa600',
        '#ff7c43',
        '#f95d6a',
        '#d45087',
        '#a05195',
        '#665191', 
        '#2f4b7c',
        '#003f5c', 
        '#002366',
        '#e53974',
        '#e61e50',
        '#ce0a0a',
        '#a50948',
        '#0B5345',
        '#196F3D',
        '#2ECC71',
        '#85C1E9',
        '#5499C7',
        '#1A5276',
        '#7DE91C',
        '#BBE91C',
        '#EAD013',
        '#D58502',
        '#E14F14',
        '#FF0000',
        '#FF0074',
        '#8300FF'
      ],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      series: [
        {
          name: "Tickets",
          type: "pie",
          radius: ["55%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal"
              },
              formatter: "{a}"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(15, 21, 77, 1)"
              },
              formatter: "{b} \n{c} ({d}%)"
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }

  getReports(){
    this._route.params.forEach((params) =>{
      let companyId = params['company'];

      this._ticketService.getReports(this.token, companyId).subscribe(
        response =>{
            this.reports = response;
            this.monthInit(this.themeService.activatedTheme);
            this.dayInit(this.themeService.activatedTheme);
            this.agentInit(this.themeService.activatedTheme);
            this.requesterInit(this.themeService.activatedTheme);

            this.subtypeStats = this.reports.subtype.map(x => {
              return {
                subtype: x._id.subTypeTicket.name,
                type: x._id.subTypeTicket.typeTicket.name,
                count: x.count
              }
            })

            this.teams = this.reports.team;
            this.totalTickets = 0;
            this.teams.forEach(e => {
              this.totalTickets += e.count;
            });
        },
        error =>{
            console.error(error);
      }
  );
  })
  }

  getPercentage(num):number{
    return Math.floor((num / this.totalTickets) * 100);
  }

  monthInit(theme) {

    let data = this.reports.month.map(x => moment(x._id, 'YY-MM').format('MM/YY'));
    this.monthData = this.reports.month.map(x => x.count);

    this.monthOptions = {
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444",
        axisPointer: {
          type: "line",
          animation: true
        }
      },
      grid: {
        top: "10%",
        left: "80px",
        right: "30px",
        bottom: "60"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data,
        axisLabel: {
          show: true,
          margin: 20,
          color: "#888"
        },
        axisTick: {
          show: false
        },

        axisLine: {
          show: false,
          lineStyle: {
            show: false
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: "#888"
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed"
          }
        }
      },
      series: [
        {
          name: "Tickets",
          label: { show: false, color: "#0168c1" },
          type: "bar",
          barGap: 0,
          color: tinyColor(theme.baseColor).setAlpha(.4).toString(),
          smooth: true
        },
      ]
    };

    this.month = {
      series: [
        {
          data: this.monthData
        }
      ]
    };
  }

  dayInit(theme) {

    let data = this.reports.time.map(x => moment(x._id, 'YY-MM-DD').format('DD/MM/YY'));
    this.dayData = this.reports.time.map(x => x.count);

    this.dayOptions = {
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444",
        axisPointer: {
          type: "line",
          animation: true
        }
      },
      grid: {
        top: "10%",
        left: "60",
        right: "15",
        bottom: "60"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data,
        axisLabel: {
          show: true,
          margin: 20,
          color: "#888"
        },
        axisTick: {
          show: false
        },

        axisLine: {
          show: false,
          lineStyle: {
            show: false
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: "#888"
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed"
          }
        }
      },
      series: [
        {
          name: "Tickets",
          label: { show: false, color: "#0168c1" },
          type: "bar",
          barGap: 0,
          color: tinyColor(theme.baseColor).setAlpha(.4).toString(),
          smooth: true
        },
      ]
    };

    this.day = {
      series: [
        {
          data: this.dayData
        }
      ]
    };
  }

  agentInit(theme) {

    let data = this.reports.agent.map(x => { return {value: x.count, name: x._id.agent.name + ' ' + x._id.agent.surname}})

    this.agentChart = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      color: [
        tinyColor(theme.baseColor).setAlpha(.6).toString(),
        tinyColor(theme.baseColor).setAlpha(.7).toString(),
        tinyColor(theme.baseColor).setAlpha(.8).toString()
      ],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      series: [
        {
          name: "Tickets",
          type: "pie",
          radius: ["55%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal"
              },
              formatter: "{a}"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(15, 21, 77, 1)"
              },
              formatter: "{b} \n{c} ({d}%)"
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }

  requesterInit(theme) {
    let data = this.reports.requester.map(x => x._id.requester.name + ' ' + x._id.requester.surname);
    let count = this.reports.requester.map(x => x.count);

    this.requesterChartBar = {
      legend: {
        show: false
      },
      grid: {
        left: "8px",
        right: "8px",
        bottom: "0",
        top: "0",
        containLabel: true
      },
      tooltip: {
        show: true,
        backgroundColor: "rgba(0, 0, 0, .8)",
        titleAlign: 'right'
      },
      xAxis: [
        {
          type: "category",
          // data: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          data: data,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: "#fff"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            show: false,
            formatter: "${value}"
          },
          min: 0,
          max: count[0],
          interval: 2,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false,
            interval: "auto"
          }
        }
      ],

      series: [
        {
          data: count,
          label: { show: true, color: tinyColor(theme.baseColor).toString(), position: "top" },
          type: "bar",
          barWidth: "12",
          color: tinyColor(theme.baseColor).toString(),
          smooth: true,
          itemStyle: {
            barBorderRadius: 10
          }
        }
      ]
    };
  }


}
