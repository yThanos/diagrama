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
  }
  array: any[] = []
  connectors: Connector[] = []
  shapes: Shape[] = []
  calcula(){
    console.log("\n\n"+this.diagram.instance.export()+"\n\n")
    console.log(JSON.parse(this.diagram.instance.export()))
    const json = JSON.parse(this.diagram.instance.export());
    this.connectors = json.connectors;
    //console.log(this.connectors)
    this.shapes = json.shapes;
    this.chain(this.primeiro(), false)
    console.log(this.array);
    this.resolve();
  }

  chain(shape: Shape, op: boolean){
    console.log("chains")
    if(shape.type == "process"){
      if(!op){
        this.array.push({"Processo": shape});
      }
      if(this.connectors.filter((e)=> e.beginItemKey == shape.key).length != 0){
        let c = this.connectors.filter((e)=> e.beginItemKey == shape.key)[0]
        this.chain(this.shapes.filter((e)=> c.endItemKey == e.key)[0], false)
      }
      return {"Processo": shape, "if": this.connectors.filter((e)=> e.endItemKey == shape.key)[0]};
    }else if(shape.type == "decision"){
      let teste = [];
      for(let con of this.connectors){
        if(con.beginItemKey == shape.key){
          teste.push(this.chain(this.shapes.filter((e)=> e.key === con.endItemKey)[0], true))
        }
      }
      this.array.push({"Decisao": shape, "ops": teste})
    }
    return null;
  }

  first: any;

  primeiro(): Shape{
    for(let s of this.shapes){
      if(this.connectors.filter((e)=> e.endItemKey === s.key).length == 0){
        console.log("Primeiro :"+ JSON.stringify(s))
        this.first = s;
        return s;
      }
    }
    return new Shape;
  }
  resolve(){
    for (let i = 0; i < this.array.length; i++) {
      if(this.array[i].hasOwnProperty("Processo")){
        console.log("Processo: "+JSON.stringify(this.array[i].Processo))
      }else if(this.array[i].hasOwnProperty("Decisao")){
        console.log("Decisao: "+JSON.stringify(this.array[i].Decisao))
        for(let op in this.array[i].ops){
          console.log("Op: "+JSON.stringify(this.array[i].ops[op]))
          console.log("if: "+JSON.stringify(this.array[i].ops[op].if.texts))
          let chave = Object.keys(this.array[i].ops[op].if.texts)[0];
          let chave2 = Object.keys(this.array[i].ops[op].if.texts)[1];
          switch (this.array[i].ops[op].if.texts[chave]) {
            case "maior":
              console.log("if "+this.first.text+" > "+ this.array[i].ops[op].if.texts[chave2])
              console.log("do "+ this.array[i].ops[op].Processo.text)
              break;
            case "menor":
              console.log("if "+this.first.text+" < "+ this.array[i].ops[op].if.texts[chave2])
              console.log("do "+ this.array[i].ops[op].Processo.text)
              break;
            case "igual":
              console.log("if "+this.first.text+" == "+ this.array[i].ops[op].if.texts[chave2])
              console.log("do "+ this.array[i].ops[op].Processo.text)
              break;
          }
        }
      }
    }
  }
}
