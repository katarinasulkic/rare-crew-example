import { Component } from '@angular/core';
import { TableHttpService } from './service/table-http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  chartOptions: any;
  employessInfo: any;
  infoEmp: [{
    name: string;
    totalHours: number;
  }] | undefined;
  pieInfo:[{
    y: number;
    name: string;
  }] | undefined;

  constructor(private tableHttpService: TableHttpService) {}

  ngOnInit() {
    this.getEmployess();
  }

  getEmployess() {
    this.tableHttpService.getAll().subscribe(res => {
      this.employessInfo = res;
      this.sortEmployessName();
    });
  }

  sortEmployessName() {
    this.employessInfo.forEach((x:any) => { 
      if(!this.infoEmp?.some((y:any) => y.name == x.EmployeeName)) {
        let totalMinuts = 0;
        this.employessInfo.forEach((z: any) => {
          if(x.EmployeeName == z.EmployeeName) {
            totalMinuts += (Date.parse(z.EndTimeUtc) - Date.parse(z.StarTimeUtc)) / 60000;
          }
        })
        if(!this.infoEmp) {
          this.infoEmp = [{
            name: x.EmployeeName,
            totalHours: Math.round(totalMinuts / 60)
          }]
        } else {
          this.infoEmp.push({
            name: x.EmployeeName,
            totalHours: Math.round(totalMinuts / 60)
          })
        }
      }
    });
    this.sortTotalHour();
      this.infoEmp?.forEach(x => { 
        if(!this.pieInfo) {
          this.pieInfo = 
          [{y: Math.round((x.totalHours / 176) * 100), name: x.name }];
        } else {
          this.pieInfo.push({y: Math.round((x.totalHours / 176) * 100), name: x.name })
        }
        
      });
    this.pieChart(this.pieInfo);
  }

  sortTotalHour() {
    this.infoEmp = this.infoEmp?.sort((a, b) => b.totalHours - a.totalHours);
  };

  pieChart(infoPie: any) {
       this.chartOptions = {
        data: [{
        type: "pie",
        indexLabel: "{y}",
        indexLabelPlacement: "inside",
        yValueFormatString: "#,###.##'%'",
        showInLegend: true,
        dataPoints: infoPie
        }]
      }	
  }
  
}
