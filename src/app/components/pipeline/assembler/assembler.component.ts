import { Component, Inject, inject, effect, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';


function addUnit(container: any, units: any, unit: any, index: number) {
    unit.instance.originalIndex = units.length;
    unit.instance.properties = ["a1"];
    unit.instance.container = container;
    unit.instance.units = units;
    units.splice(index, 0, unit.instance);
    units.forEach((u: any, i: number) => { u.index = i; });
}


@Component({
    selector: 'pipeline-unit',
    templateUrl: './pipeline-unit.component.html',
    standalone: true,
    imports: [CommonModule],
  })
  export class PipelineUnit {
    @Input() properties: any[] = [];
    @Input() container!: ViewContainerRef;
    @Input() units!: any[];
    index = 0;
    originalIndex = 0;

    constructor() {}

    addUnit() {
        const unit = this.container.createComponent(
            PipelineUnit,
            {
                "index": this.index + 1
            }
        );
        addUnit(this.container, this.units, unit, this.index + 1);
    }

    removeUnit() {
        this.container.remove(this.index);
        this.units.splice(this.index, 1);
        this.units.forEach((u: any, i: number) => { u.index = i; });
    }
  }

  @Component({
    selector: 'outer-container',
    imports: [PipelineUnit],
    standalone: true,
    template: `
      <p><button (click)="addUnit()">Add</button></p>
      <div #pipelineContainer></div>
    `,
  })
  export class OuterContainer {
    @ViewChild('pipelineContainer', { read: ViewContainerRef }) pipelineContainer!: ViewContainerRef;
    units: any[] = [];


    addUnit() {
        const unit = this.pipelineContainer.createComponent(
            PipelineUnit,
            {
                "index": 0
            }
        );
        addUnit(this.pipelineContainer, this.units, unit, 0);
    }
  }
