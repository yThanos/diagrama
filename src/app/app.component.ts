import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { DxDiagramComponent } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram!: DxDiagramComponent;

  constructor(http: HttpClient) {
    http.get('./data.json').subscribe((data) => {
      this.diagram.instance.import(JSON.stringify(data));
    }, (err) => {
      throw 'Data Loading Error';
    });
  }
}
