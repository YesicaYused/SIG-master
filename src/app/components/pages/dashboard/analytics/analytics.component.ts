import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets, RadialChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { environment } from '../../../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {VariableService} from '../../../../services/variable.service';
import {CaseService} from '../../../../services/case.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ObservatoryService} from '../../../../services/observatory.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.sass']
})
export class AnalyticsComponent implements OnInit {

  map: mapboxgl.Map;
  value = 1;
  url = environment.URL;

  public barChartOptions: ChartOptions = {
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };

  public LineChartOptions: ChartOptions = {
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };

  // map
  geojson;
  // geojson = {
  //   'features': [
  //     {
  //       'coordinates': ['-73.3568916','8.2599775']
  //     },
  //     {
  //       'coordinates': ['-73.3568916','8.2599775']
  //     },
  //   ]
  // };

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public spatialChartColors: Color[] = [
    {
      borderColor: ['#00C1D4', '#F7C137', '#8C54FF'],
      backgroundColor: ['#00C1D4', '#F7C137', '#8C54FF'],
    },
  ];

  public temporaryChartColors: Color[] = [
    {
      borderColor: ['#00C1D4', '#F7C137', '#8C54FF'],
      backgroundColor: ['#00C1D4', '#F7C137', '#8C54FF'],
    },
  ];

  public civil_statusChartColors: Color[] = [
    {
      borderColor: ['#00C1D4', '#8C54FF'],
      backgroundColor: ['#00C1D4', '#8C54FF'],
    },
  ];
  //
  // public temporaryChartColors: Color[] = [
  //   {
  //     borderColor: ['#8C54FF', '#2E5BFF','#2DB744', '#E84A50'],
  //     backgroundColor: ['#8C54FF', '#2E5BFF','#2DB744', '#E84A50'],
  //   },
  // ];

// spatial
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(215,223,255)',
      backgroundColor: 'rgb(232,237,255)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // municipality
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartDataMunicipality: ChartDataSets[];
  public lineChartColorsT: Color[] = [
    {
      borderColor: 'rgb(177,141,255)',
      backgroundColor: 'rgba(211,194,248,0.9)',
    },
  ];

  //neighborhood

  public lineChartDataNeighborhoods: ChartDataSets[];

  //civil_status


  //Temporary

  public barChartDataTemporary: ChartDataSets[];
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[];
  public radarChartData: ChartDataSets[];
  public radarChartType: ChartType = 'pie';

  //months

  monthsChartDataNeighborhoods: ChartDataSets[];

  constructor(
    public variableService: VariableService,
    public caseService: CaseService,
    public message: NzMessageService,
    public observatorioService: ObservatoryService,
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {

    if(this.observatorioService.observatories == null){
      this.observatory();
    }

    mapboxgl.accessToken = environment.mapboxKey;
    this.map = new mapboxgl.Map({
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 16,
      center: [-73.3568916, 8.2399775] //lat - long
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.coordinates();
    this.month();
    this.months();
    this.year();
    this.allvariable();
    this.temporary_behavior();
    this.spatial_behavior();
    this.neighborhood();
    this.civil_status();
    this.municipality();
  }

  createMarker(map) {
    this.geojson.features.forEach(function(marker) {
// create a DOM element for the marker
      let el = document.createElement('div');
      let item = document.createElement('div');
      el.appendChild(item);
      el.className = 'marker';

// add marker to map
      new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map);
    });
  }

  observatory(){
    this.observatorioService.data().subscribe((data)=>{

      this.observatorioService.observatories = data['data'];
    }, (error)=> {});
  }

  coordinates(){
    this.caseService.map('1').subscribe((data)=>{

      this.geojson = data;
      this.createMarker(this.map);
    }, (error)=> {});
  }

  month(){
    this.variableService.analyticMonth('mes', 'actual').subscribe((data)=>{

      this.variableService.month = data['number'][0];
    }, (error)=> { });
  }

  year(){
    this.variableService.analyticYear('año', 'actual').subscribe((data)=>{

      this.variableService.year = data['number'][0];
    }, (error)=> { });
  }

  months(){
    this.variableService.analyticMonth('mes', '').subscribe((data)=>{

      this.variableService.months = data;
      this.monthsChartDataNeighborhoods = [
        {data: this.variableService.months['number'],
          label: 'Homicidio',
          fill: false,
        }
      ];
    }, (error)=> { });
  }

  allvariable() {
    this.variableService
      .data()
      .subscribe((data: any) => {
        this.variableService.variables = data['data'];
      });
  }

  temporary_behavior(){
    this.caseService.analyticLegal('temporary_behavior', '1').subscribe((data)=>{
        this.caseService.temporary_behavior = data;
        this.barChartDataTemporary = [
          {data: this.caseService.temporary_behavior['number'],
            label: 'Homicidio',
            fill: false,
          }
        ];
    }, (error)=> {

    });
  }

  spatial_behavior(){
    this.caseService.analyticLegal('spatial_behavior', '1').subscribe((data)=>{
        this.caseService.spatial_behavior = data;
    }, (error)=> {

    });
  }

  civil_status(){
    this.caseService.analyticLegal('civil_status', '1').subscribe((data)=>{
      this.caseService.civil_status = data;
    }, (error)=> { });
  }

  neighborhood(){
    this.caseService.analytic('neighborhood', '1').subscribe((data)=>{
      this.caseService.neighborhoods = data;
      this.lineChartDataNeighborhoods = [
        {
          data: this.caseService.neighborhoods['number'],
          label: 'Homicidio',
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          // steppedLine: 'middle',
          fill: false
        }
      ]
    }, (error)=> {

    });
  }

  municipality() {
    this.caseService.analytic('municipality', '1').subscribe((data)=>{
      this.caseService.municipality = data;
      this.barChartDataMunicipality = [
        {data: this.caseService.municipality['number'], label: 'Homicidio', barPercentage: 0.5, barThickness: 6, maxBarThickness: 8, minBarLength: 2,}
      ]
    }, (error)=> {

    });
  }

  // Cambiar la variable de estudio

  change_variable(variable){

    this.selectTemporary(variable);
    this.selectSpatial(variable);
    this.selectNeighborhood(variable);
    this.selectCivil_status(variable);
    this.selectMunicipality(variable);
  }

  selectTemporary(value){
    this.caseService.analyticLegal('temporary_behavior', value).subscribe((data)=>{
      if(data['message']){

        this.message.create('error', data['message']);
      }else{

        this.caseService.temporary_behavior = data;
        this.barChartDataTemporary = [
          {data: this.caseService.temporary_behavior['number'], label: this.variableService.variables[value-1]['name']}
        ];
      }
    }, (error)=> {

    });
  }

  selectSpatial(value) {
    this.caseService.analyticLegal('spatial_behavior', value).subscribe((data)=>{
      if(data['message']){

        this.message.create('error', data['message']);
      }else{

        this.caseService.spatial_behavior = data;
      }
    }, (error)=> {

    });
  }

  selectNeighborhood(value) {
    this.caseService.analytic('neighborhood', value).subscribe((data)=>{
      if(data['message']){

        this.message.create('error', data['message']);
      }else {

        this.caseService.neighborhoods = data;
        this.lineChartDataNeighborhoods = [
          {data: this.caseService.neighborhoods['number'], label: this.variableService.variables[value-1]['name']}
        ];
      }
    }, (error)=> {

    });
  }

  selectCivil_status(value){
    this.caseService.analyticLegal('civil_status', value).subscribe((data)=>{

      if(data['message']){

        this.message.create('error', data['message']);
      }else {

        this.caseService.civil_status = data;
      }
    }, (error)=> {

    });
  }

  selectMunicipality(value){
    this.caseService.analytic('municipality', value).subscribe((data)=>{

      if(data['message']){

        this.message.create('error', data['message']);
      }else {

        this.caseService.municipality = data;
        this.barChartDataMunicipality = [
          {data: this.caseService.municipality['number'], label: this.variableService.variables[value-1]['name']}
        ];
      }
    }, (error)=> {

    });
  }
}
