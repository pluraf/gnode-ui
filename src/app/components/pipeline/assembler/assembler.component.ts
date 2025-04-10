import { Component, Inject, inject, effect, ViewContainerRef, ElementRef, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

import { ApiService } from '../../../services/api.service';


interface OptionalObject {
  key: string;
  value: any;
}


class PipelineUnitProperty {
  name: string = '';
  view: string = '';
  type: string = '';
  options: string[] = [];
  required: boolean | OptionalObject = true;
  value: undefined | string = '';
  private optional_: boolean | undefined = undefined;

  constructor(name: string, v: {[key: string]: any}, loader?: (options: any, schema: any) => void) {
    this.name = name;
    this.view = v['options'] ? 'select' : 'input';
    this.type = v['type'];

    if (v['options']) {
      if (Array.isArray(v['options'])) {
        this.options = v['options'];
      } else if (loader) {
        loader(this.options, v['options']);
      }
    }

    if (v['default']) {
      if (this.type !== 'string') {
        this.value = v['default'].toString();
      } else {
        this.value = v['default'];
      }
    }

    this.required = v["required"];
  }

  public getValue(): any {
    if (this.type === 'integer') {
      return parseInt(this.value as string);
    }
    if (this.type === 'float') {
      return parseFloat(this.value as string);
    }
    if (this.type === 'object') {
      return JSON.parse(this.value as string);
    }
    return this.value;
  }

  isOptional(unit?: PipelineUnitComponent): boolean {
    if (this.optional_ === undefined) {
      if (typeof this.required === 'boolean') {
        this.optional_ = !this.required;
      } else if (unit) {
        this.optional_ = unit[this.required.key as keyof PipelineUnitComponent] !== this.required.value;
      } else {
        this.optional_ = true;
      }
    }
    return this.optional_;
  }
}


@Component({
  selector: 'unit-property',
  templateUrl: './unit-property.component.html',
  styleUrl: './pipeline-assembler.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
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
  styleUrl: './pipeline-assembler.css',
  standalone: true,
  imports: [CommonModule, FormsModule, UnitPropertyComponent],
})
export class PipelineUnitComponent {
  @Input() pipeline!: any;
  @Input() category!: any;
  @Input() mode!: any;

  set properties(value: PipelineUnitProperty[]) {
    this.properties_ = value;
    this.usedProperties = this.properties_.filter(p => !p.isOptional(this));

    this.optionalPropertyNames = this.properties.filter(p => p.isOptional(this)).map(p => p.name);
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
      //this.type = this.category === 'filtra' ? 'nop' : 'mqtt';
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

  setProperty(propertyName: string, propertyValue: any) {
    let prop = this.usedProperties.find(p => p.name === propertyName);
    if (prop === undefined) {
      prop = this.addProperty(propertyName);
    }
    if (prop !== undefined) {
      if (typeof propertyValue  === 'number') {
        prop.value = propertyValue.toString();
      } else if (typeof propertyValue === 'object') {
        prop.value = JSON.stringify(propertyValue);
      } else {
        prop.value = propertyValue as string;
      }
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
  selector: 'pipeline-assembler',
  imports: [
    PipelineUnitComponent,
    ButtonModule
  ],
  standalone: true,
  templateUrl: './assembler.component.html',
})
export class PipelineAssemblerComponent {
  @ViewChild('connectorIn') connectorIn!: PipelineUnitComponent;
  @ViewChild('pipelineFiltrasContainer', { read: ViewContainerRef }) containerFiltras!: ViewContainerRef;
  @ViewChild('connectorOut') connectorOut!: PipelineUnitComponent;
  units: any[] = [];

  private schema_: { [key: string]: any } = {};
  private serialized_: string | undefined = undefined;

  // @ViewChildren(PipelineUnitComponent) children!: QueryList<PipelineUnitComponent>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.pipelineSchema().subscribe((response: any) => {
      this.schema_ = response;
      if (this.serialized_ === undefined) {
        this.connectorIn.type = 'mqtt';
        this.connectorOut.type = 'mqtt';
        this.units.forEach(u => u.type = 'nop');
      } else {
        this.deserialize(this.serialized_);
      }
    });
  }

  loadPropertyOptions(options: any, schema: any) {
    this.apiService.get(schema['url']).subscribe((data: any) => {
      if (schema['filter']) {
        const key = schema['filter']['key'];
        const value = schema['filter']['value'];
        data = data.filter((o: any) => o[key].startsWith(value));
      }
      data.map((o: any) => o[schema['key']]).forEach((o:any) => options.push(o));
    });
  }

  getProperties(category: string, type: string): PipelineUnitProperty[] {
    const unitSchema = this.schema_[category]?.[type];
    const properties: PipelineUnitProperty[] = [];
    if (unitSchema) {
      for (const [k, v] of Object.entries(unitSchema)){
        properties.push(new PipelineUnitProperty(k, v as {[key: string]: any}, (a ,b) => this.loadPropertyOptions(a, b)));
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
    unit.instance.type = 'nop';
    return unit.instance;
  }

  clearUnits() {
    this.containerFiltras.clear();
    this.units = [];
  }

  serialize(pretty: boolean = false): string {
    const pipeline: any = {};
    const connectorIn: any = {};
    const connectorOut: any = {};
    const filtras: any[] = [];

    this.connectorIn.usedProperties.forEach(p => {
      connectorIn[p.name] =  p.getValue();
    });
    connectorIn['type'] = this.connectorIn.type;

    this.connectorOut.usedProperties.forEach(p => {
      connectorOut[p.name] = p.getValue();
    });
    connectorOut['type'] = this.connectorOut.type;

    this.units.forEach(u => {
      const filtra: any = {};
      u.usedProperties.forEach((p: PipelineUnitProperty) => {
        filtra[p.name] =  p.getValue();
      });
      filtra['type'] = u.type;
      filtras.push(filtra);
    });

    pipeline.connector_in = connectorIn;
    pipeline.filtras = filtras;
    pipeline.connector_out = connectorOut;

    return JSON.stringify(pipeline, null, pretty ? 2 : undefined);
  }

  deserialize(config: string | undefined) {
    if (config === undefined) {
      return;
    }

    if (Object.keys(this.schema_).length === 0) {
      this.serialized_ = config;
      return;
    }


    const js = JSON.parse(config);

    this.connectorIn.type = js.connector_in.type;
    for (const [name, value] of Object.entries(js.connector_in)) {
      if (name !== 'type') {
        this.connectorIn.setProperty(name, value);
      }
    }

    this.connectorOut.type = js.connector_out.type
    for (const [name, value] of Object.entries(js.connector_out)) {
      if (name !== 'type') {
        this.connectorOut.setProperty(name, value);
      }
    }

    this.clearUnits();
    for (const filtra of js.filtras || []) {
      const unit = this.addUnit();
      unit.type = filtra.type;
      for (const [name, value] of Object.entries(filtra)) {
        if (name !== 'type') {
          unit.setProperty(name, value);
        }
      }
    }
  }
}
