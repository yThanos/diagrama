import { Component, ViewChild } from '@angular/core';
import { DxDiagramComponent } from 'devextreme-angular';
import { Connector, Shape } from './model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram!: DxDiagramComponent;

  constructor(){
    setTimeout(() => {
      console.log(this.diagram.instance.export())
    }, 10000);
  }
  array: any = []
  connectors: Connector[] = []
  shapes: Shape[] = []
  calcula(){
    console.log("\n\n"+this.diagram.instance.export()+"\n\n")
    const json = JSON.parse(this.diagram.instance.export());
    this.connectors = json.connectors;
    this.shapes = json.shapes;
    this.primeiro();
    this.chain(this.array[0])
    console.log(this.array);
  }

  primeiro(){
    for(let s of this.shapes){
      if(this.connectors.filter(c => c.endItemKey == s.key).length == 0){
        console.log("if primeiro");
        this.array.push({"process":s});
      }
    }
  }
  chain(shape: Shape){
    for(let c of this.connectors){
      if(shape.type == "process"){
        this.array.push({"process":shape});
        this.chain(this.shapes.filter(s => s.key == c.endItemKey)[0]);
      } else {
        this.array.push({"decision":shape});
        for( let con of this.connectors.filter(a => a.beginItemKey == shape.key)){
          this.chain(this.shapes.filter(s => s.key == con.endItemKey)[0]);
        }
      }
    }
  }
}
