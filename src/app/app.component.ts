import { Component, ViewChild } from '@angular/core';
import { DxDiagramComponent } from 'devextreme-angular';
import { Connector, Shape } from './model';

const testcase = '{"connectors":[{"key":"8","locked":false,"zIndex":0,"points":[{"x":4860,"y":8100},{"x":6480,"y":10080}],"texts":{"0.9":"500","0.7":"maior","0.53":"vale_alimentacao"},"beginItemKey":"5","beginConnectionPointIndex":-1,"endItemKey":"6","endConnectionPointIndex":-1},{"key":"9","locked":false,"zIndex":0,"points":[{"x":4140,"y":8640},{"x":4140,"y":10080}],"texts":{"0.1388888888888889":"vale_alimentacao","0.45":"menor","0.75":"501"},"beginItemKey":"5","beginConnectionPointIndex":2,"endItemKey":"7","endConnectionPointIndex":0},{"key":"12","locked":false,"zIndex":0,"points":[{"x":4860,"y":3600},{"x":6480,"y":5400}],"texts":{"0.83":"possui","0.58":"vale_transporte"},"beginItemKey":"1","beginConnectionPointIndex":1,"endItemKey":"3","endConnectionPointIndex":0},{"key":"14","locked":false,"zIndex":0,"points":[{"x":3420,"y":3600},{"x":1800,"y":5400}],"texts":{"0.87":"1000","0.71":"maior","0.55":"salario"},"beginItemKey":"1","beginConnectionPointIndex":-1,"endItemKey":"2","endConnectionPointIndex":-1},{"key":"10","locked":false,"zIndex":0,"points":[{"x":4140,"y":6480},{"x":4140,"y":7560}],"beginItemKey":"4","beginConnectionPointIndex":2,"endItemKey":"5","endConnectionPointIndex":0},{"key":"11","locked":false,"zIndex":0,"points":[{"x":4140,"y":4140},{"x":4140,"y":5400}],"texts":{"0.23":"vale_alimentacao","0.63":"possui"},"beginItemKey":"1","beginConnectionPointIndex":-1,"endItemKey":"4","endConnectionPointIndex":-1},{"key":"13","locked":false,"zIndex":0,"points":[{"x":4140,"y":1980},{"x":4140,"y":3060}],"beginItemKey":"0","beginConnectionPointIndex":-1,"endItemKey":"1","endConnectionPointIndex":-1}],"shapes":[{"key":"0","locked":false,"zIndex":0,"type":"process","text":"Process","x":3420,"y":900,"width":1440,"height":1080},{"key":"1","locked":false,"zIndex":0,"type":"decision","text":"Decision","x":3420,"y":3060,"width":1440,"height":1080},{"key":"2","locked":false,"zIndex":0,"type":"process","text":"Process","x":1080,"y":5400,"width":1440,"height":1080},{"key":"3","locked":false,"zIndex":0,"type":"process","text":"Process","x":5760,"y":5400,"width":1440,"height":1080},{"key":"4","locked":false,"zIndex":0,"type":"process","text":"Process","x":3420,"y":5400,"width":1440,"height":1080},{"key":"5","locked":false,"zIndex":0,"type":"decision","text":"Decision","x":3420,"y":7560,"width":1440,"height":1080},{"key":"6","locked":false,"zIndex":0,"type":"process","text":"Process","x":5760,"y":10080,"width":1440,"height":1080},{"key":"7","locked":false,"zIndex":0,"type":"process","text":"Process","x":3420,"y":10080,"width":1440,"height":1080}]}'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram!: DxDiagramComponent;

  array: any[] = []
  connectors: Connector[] = []
  shapes: Shape[] = []
  calcula(){
    console.log("\n\n"+this.diagram.instance.export()+"\n\n")
    console.log(JSON.parse(this.diagram.instance.export()))
    const json = JSON.parse(this.diagram.instance.export());
    this.connectors = json.connectors;
    this.shapes = json.shapes;
    this.chain(this.primeiro(), false, 1)
    console.log(this.array);
    this.resolve();
    this.array = []
  }

  chain(shape: Shape, op: boolean, posicao: number){
    console.log("chains")
    if(shape.type == "process"){
      if(!op){
        this.array.push({"Processo": shape});
      }
      if(this.connectors.filter((e)=> e.beginItemKey == shape.key).length != 0){
        let c = this.connectors.filter((e)=> e.beginItemKey == shape.key)[0]
        this.chain(this.shapes.filter((e)=> c.endItemKey == e.key)[0], false, posicao)
      }
      return {"Processo": shape, "if": this.connectors.filter((e)=> e.endItemKey == shape.key)[0]};
    }else if(shape.type == "decision"){
      posicao++;
      let teste = [];
      for(let con of this.connectors){
        if(con.beginItemKey == shape.key){
          teste.push(this.chain(this.shapes.filter((e)=> e.key === con.endItemKey)[0], true, posicao))
        }
      }
      let origem = this.connectors.map((e)=>{
        if(e.endItemKey == shape.key){
          return e.beginItemKey;
        }
        return null;
      })
      this.array.push({"Decisao": shape, "ops": teste, "deep": posicao, "origin": origem.filter((e)=> e != null)})
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
      }else if(this.array[i].hasOwnProperty("Decisao")){
        for(let op of this.array[i].ops){
          let chave = Object.keys(op.if.texts)[1];
          let chave2 = Object.keys(op.if.texts)[0];
          let chave3 = Object.keys(op.if.texts)[2]
          switch (op.if.texts[chave]) {
            case "maior":
              console.log("if ("+ op.if.texts[chave2] +" > "+ op.if.texts[chave3] +")")
              console.log("do "+ op.Processo.text)
              break;
            case "menor":
              console.log("if ("+ op.if.texts[chave2] +" < "+ op.if.texts[chave3] +")")
              console.log("do "+ op.Processo.text)
              break;
            case "igual":
              console.log("if ("+ op.if.texts[chave2] +" == "+ op.if.texts[chave3] +")")
              console.log("do "+ op.Processo.text)
              break;
            case "possui":
              console.log("if ("+ op.if.texts[chave2] +")")
              console.log("do "+ op.Processo.text)
          }
        }
      }
    }
  }
}


