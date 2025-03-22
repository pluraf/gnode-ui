import { Component, Inject, inject, effect, ViewContainerRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface PipelineUnitProperty {
  name: string;
  type: string;
  options?: string[];
  value: string;
}


function addUnit(pipeline: any, index: number, properties: PipelineUnitProperty[]) {
    const unit = pipeline.container.createComponent(
        PipelineUnitComponent,
        {
            "index": index
        }
    );
    unit.instance.properties = properties;
    pipeline.units.splice(index, 0, unit.instance);
    pipeline.units.forEach((u: any, i: number) => { u.index = i; });
    unit.instance.pipeline = pipeline;
}


function getBasicProperties(): PipelineUnitProperty[] {
    return [
        {'name': 'type', 'type': 'select', 'options': ['generator', 'throttle', 'finder'], 'value': 'generator'}
    ];
}

function getThrottleProperties(): PipelineUnitProperty[] {
    return getBasicProperties().concat(
        [
            {'name': 'frequency', 'type': 'input', 'value': '0'}
        ]
    );
}

function getGeneratorProperties(): PipelineUnitProperty[] {
    return getBasicProperties().concat(
        [
            {'name': 'payload', 'type': 'input', 'value': '0'}
        ]
    );
}

function getFinderProperties(): PipelineUnitProperty[] {
    return getBasicProperties().concat(
        [
            {'name': 'substring', 'type': 'input', 'value': ''}
        ]
    );
}


@Component({
    selector: 'pipeline-unit',
    templateUrl: './pipeline-unit.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
  })
  export class PipelineUnitComponent {
    @Input() pipeline!: any;
    @Input()
    set properties(value: PipelineUnitProperty[]) {
      this.properties_ = value;
      value.forEach((u: any, i: number) => {
        console.log(u);
      });
    }
    get properties(): any {
      return this.properties_;
    }

    index = 0;
    private properties_!: PipelineUnitProperty[];

    constructor() {}

    addUnit() {
        addUnit(this.pipeline, this.index + 1, getBasicProperties());
    }

    removeUnit() {
        this.pipeline.container.remove(this.index);
        this.pipeline.units.splice(this.index, 1);
        this.pipeline.units.forEach((u: any, i: number) => { u.index = i; });
    }

    onChangeType(newType: string) {
        if(newType === 'throttle') {
            this.properties = getThrottleProperties();
        }else if (newType === 'generator') {
            this.properties = getGeneratorProperties();
        }else if (newType === 'finder') {
            this.properties = getFinderProperties();
        }
    }
  }

  @Component({
    selector: 'pipeline',
    imports: [PipelineUnitComponent],
    standalone: true,
    template: `
      <p><button (click)="addUnit()">Add</button></p>
      <div #pipelineContainer></div>
    `,
  })
  export class PipelineComponent {
    @ViewChild('pipelineContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
    units: any[] = [];

    addUnit() {
        addUnit(this, 0, getBasicProperties());
    }
  }
