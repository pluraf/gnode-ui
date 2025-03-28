import { Component, Inject, inject, effect, ViewContainerRef, ElementRef, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../../services/api.service';


interface PipelineUnitProperty {
  name: string;
  view: string;
  type: string;
  options?: string[];
  optional: boolean;
  value: string | number;
}


@Component({
  selector: 'unit-property',
  templateUrl: './unit-property.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UnitPropertyComponent {
  @Input() unit!: any;
  @Input() property!: any;

  index = 0;

  removeProperty() {
    this.unit.removeProperty(this.property.name);
  }
}


@Component({
  selector: 'pipeline-unit',
  templateUrl: './pipeline-unit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, UnitPropertyComponent],
})
export class PipelineUnitComponent {
  @Input() pipeline!: any;
  @Input() category!: any;
  @Input() mode!: any;

  set properties(value: PipelineUnitProperty[]) {
    this.properties_ = value;
    this.usedProperties = this.properties_.filter(p => !p.optional);

    this.optionalPropertyNames = this.properties.filter(p => p.optional).map(p => p.name);
    this.optionalPropertySelected = this.optionalPropertyNames[0];
  }
  get properties(): PipelineUnitProperty[] {
    return this.properties_;
  }

  @Input()
  set type(value: string) {
    this.type_ = value;
    this.properties = this.pipeline.getProperties(this.category, this.type_);
  }
  get type(): string {
    return this.type_;

  }

  index = 0;

  usedProperties: PipelineUnitProperty[] = [];
  optionalPropertySelected = '';
  optionalPropertyNames: string[] = [];

  private properties_!: PipelineUnitProperty[];
  private type_!: string;

  ngOnInit() {
    if (this.type === undefined) {
      this.type = this.category === 'filtra' ? 'nop' : 'mqtt';
    }
  }

  getTypes() {
    return this.pipeline.getUnitTypes(this.category);
  }

  getProperty(propertyName: string) {
    for (const property of this.properties) {
      if (property.name == propertyName) {
        return property;
      }
    }
    return;
  }

  setProperty(propertyName: string, propertyValue: string | number) {
    let prop = this.usedProperties.find(p => p.name === propertyName);
    if (prop === undefined) {
      prop = this.addProperty(propertyName);
    }
    if (prop !== undefined) {
      prop.value = propertyValue;
    }
  }

  addProperty(propertyName: string): PipelineUnitProperty | undefined {
    if (this.optionalPropertyNames.length > 0) {
      const property = this.getProperty(propertyName);
      if (property) {
        this.usedProperties.push(property);
        this.optionalPropertyNames = this.optionalPropertyNames.filter(p => p !== propertyName);
        this.optionalPropertySelected = this.optionalPropertyNames[0];
        return property;
      }
    }
    return undefined;
  }

  removeProperty(propertyName: string) {
    const ix = this.usedProperties.findIndex(p => p.name === propertyName);
    if (ix >= 0) {
      this.usedProperties.splice(ix, 1);
      this.optionalPropertyNames.push(propertyName);
      if (this.optionalPropertySelected === undefined) {
        this.optionalPropertySelected = this.optionalPropertyNames[0];
      }
    }
  }

  reloadProperties() {
    this.properties = this.pipeline.getProperties(this.category, this.type_);
  }

  addUnit() {
    this.pipeline.addUnit(this.index + 1);
  }

  removeUnit() {
    this.pipeline.containerFiltras.remove(this.index);
    this.pipeline.units.splice(this.index, 1);
    this.pipeline.units.forEach((u: any, i: number) => { u.index = i; });
  }

  onTypeChange(newType: string) {
    this.type = newType;
  }
}

@Component({
  selector: 'pipeline',
  imports: [PipelineUnitComponent],
  standalone: true,
  templateUrl: './assembler.component.html',
})
export class PipelineComponent {
  @ViewChild('connectorIn') connectorIn!: PipelineUnitComponent;
  @ViewChild('pipelineFiltrasContainer', { read: ViewContainerRef }) containerFiltras!: ViewContainerRef;
  @ViewChild('connectorOut') connectorOut!: PipelineUnitComponent;
  units: any[] = [];

  private schema_: { [key: string]: any } = {};

  // @ViewChildren(PipelineUnitComponent) children!: QueryList<PipelineUnitComponent>;

  constructor(apiService: ApiService) {
    apiService.pipelineSchema().subscribe((response: any) => {
      this.schema_ = response;
      this.connectorIn.reloadProperties();
      this.connectorOut.reloadProperties();
      this.units.forEach(u => u.reloadProperties());
    });
  }

  getProperties(category: string, type: string): PipelineUnitProperty[] {
    const unitSchema = this.schema_[category]?.[type];
    const properties = [];
    if (unitSchema) {
      for (const [k, v] of Object.entries(unitSchema)){
        const value = v as { [key: string]: any };
        properties.push({
          name: k,
          view: value['options'] ? 'select' : 'input',
          type: value['type'],
          options: value['options'],
          optional: !value["required"],
          value: value['default'],
        });
      }
    }
    return properties;
  }

  getUnitTypes(category: string) {
    return Object.keys(this.schema_?.[category] || {});
  }

  addUnit(index?: number) {
    index = index ?? this.containerFiltras.length;
    const unit = this.containerFiltras.createComponent(
      PipelineUnitComponent,
      { "index": index }
    );
    this.units.splice(index, 0, unit.instance);
    this.units.forEach((u: any, i: number) => { u.index = i; });
    unit.instance.pipeline = this;
    unit.instance.category = 'filtra';
    return unit.instance;
  }

  clearUnits() {
    this.containerFiltras.clear();
    this.units = [];
  }

  serialize() {
    const pipeline: any = {};
    const connectorIn: any = {};
    const connectorOut: any = {};
    const filtras: any[] = [];

    this.connectorIn.usedProperties.forEach(p => {
      connectorIn[p.name] = p.value;
    });
    connectorIn['type'] = this.connectorIn.type;

    this.connectorOut.usedProperties.forEach(p => {
      connectorOut[p.name] = p.value;
    });
    connectorOut['type'] = this.connectorOut.type;

    this.units.forEach(u => {
      const filtra: any = {};
      u.usedProperties.forEach((p: PipelineUnitProperty) => {
        filtra[p.name] = p.value;
      });
      filtra['type'] = u.type;
      filtras.push(filtra);
    });

    pipeline.connector_in = connectorIn;
    pipeline.filtras = filtras;
    pipeline.connector_out = connectorOut;

    console.log(JSON.stringify(pipeline));
  }

  deserialize() {
    const s = '{"connector_in":{"type":"mqtt","server":"ff","topic":"#"},"filtras":[{"type":"throttle","rate":"1.6","goto_accepted":"12"}],"connector_out":{"type":"mqtt","server":""}}';
    const js = JSON.parse(s);

    this.connectorIn.properties = this.getProperties('connector', js.connector_in.type);
    for (const [name, value] of Object.entries(js.connector_in)) {
      if (name !== 'type') {
        if (typeof value === 'string' || typeof value === 'number') {
          this.connectorIn.setProperty(name, value);
        }
      }
    }

    this.connectorOut.properties = this.getProperties('connector', js.connector_in.type);
    for (const [name, value] of Object.entries(js.connector_out)) {
      if (name !== 'type') {
        if (typeof value === 'string' || typeof value === 'number') {
          this.connectorOut.setProperty(name, value);
        }
      }
    }

    this.clearUnits();
    for (const filtra of js.filtras) {
      const unit = this.addUnit();
      unit.type = filtra.type;
      for (const [name, value] of Object.entries(filtra)) {
        if (name !== 'type') {
          if (typeof value === 'string' || typeof value === 'number') {
            unit.setProperty(name, value);
          }
        }
      }
    }
  }
}
