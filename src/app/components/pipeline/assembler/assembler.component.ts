import { Component, Inject, inject, effect, ViewContainerRef, ElementRef, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface PipelineUnitProperty {
  name: string;
  view: string;
  type: string;
  options?: string[];
  optional: boolean;
  value: string | number;
}


function addUnit(pipeline: any, index?: number) {
  index = index ?? pipeline.containerFiltras.length;
  const unit = pipeline.containerFiltras.createComponent(
    PipelineUnitComponent,
    {
      "index": index
    }
  );
  pipeline.units.splice(index, 0, unit.instance);
  pipeline.units.forEach((u: any, i: number) => { u.index = i; });
  unit.instance.pipeline = pipeline;
  unit.instance.category = 'filtra';
  return unit.instance;
}


function getMandatoryProperties(category: string, type: string): PipelineUnitProperty[] {
  if (category == 'filtra') {
    return [
      { 'name': 'type', 'view': 'select', 'type': 'text', 'options': ['generator', 'throttle', 'finder'], optional: false, 'value': type }
    ];
  } else if (category == 'connector') {
    return [
      { 'name': 'type', 'view': 'select', 'type': 'text', 'options': ['mqtt', 'gcp_pubsub', 'gcp_storage', 'aws_s3', 'email', 'queue', 'slack'], optional: false, 'value': type }
    ];
  } else {
    return [];
  }
}


function getCommonProperty(category: string, property: string): PipelineUnitProperty | undefined {
  if (category == 'filtra') {
    if (property == 'goto_accepted') {
      return { 'name': 'goto_accepted', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' };
    } else if (property == 'name') {
      return { 'name': 'name', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' };
    } else if (property == 'metadata') {
      return { 'name': 'metadata', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' };
    }
  }
  return;
}


function getThrottleProperties(): PipelineUnitProperty[] {
  return getMandatoryProperties('filtra', 'throttle').concat(
    [
      { 'name': 'rate', 'view': 'input', 'type': 'float', 'optional': false, 'value': 1 },
      getCommonProperty('filtra', 'goto_accepted')!,
      getCommonProperty('filtra', 'name')!,
      getCommonProperty('filtra', 'metadata')!,
    ]
  );
}


function getFinderProperties(): PipelineUnitProperty[] {
  return getMandatoryProperties('filtra', 'finder').concat(
    [
      { 'name': 'text', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' },
      { 'name': 'operator', 'view': 'select', 'type': 'string', 'options': ['match', 'contain', 'contained'], 'optional': true, 'value': 'match' },
      { 'name': 'keys', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' },
      { 'name': 'value_key', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' },
      getCommonProperty('filtra', 'goto_accepted')!,
      getCommonProperty('filtra', 'name')!,
      getCommonProperty('filtra', 'metadata')!,
    ]
  );
}

function getMqttProperties(): PipelineUnitProperty[] {
  return getMandatoryProperties('connector', 'mqtt').concat(
    [
      { 'name': 'topic', 'view': 'input', 'type': 'string', 'optional': true, 'value': '' },
      { 'name': 'topics', 'view': 'input', 'type': 'array', 'optional': true, 'value': '' },
      { 'name': 'server', 'view': 'input', 'type': 'string', 'optional': false, 'value': '' }
    ]
  );
}

function getPubsubProperties(): PipelineUnitProperty[] {
  return getMandatoryProperties('connector', 'gcp_pubsub').concat(
    [
      { 'name': 'authbundle_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': '' },
      { 'name': 'project_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': '' },
      { 'name': 'topic_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': '' },
    ]
  );
}

function getSlackProperties(): PipelineUnitProperty[] {
  return getMandatoryProperties('connector', 'slack').concat(
    [
      { 'name': 'authbundle_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': '' },
    ]
  );
}


class Fitlra {

}

class Connector {

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

  onPropertyChange(newValue: any, element: HTMLSelectElement) {
    this.unit.onPropertyChange(newValue, element);
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
    if (this.category === 'filtra') {
      this.updateFiltraLayoutOnType(this.type_);
    } else if (this.category === 'connector') {
      this.updateConnectorLayoutOnType(this.type_);
    }
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

  constructor() { }

  ngOnInit() {
    if (this.type === undefined) {
      this.type = this.category === 'filtra' ? 'finder' : 'mqtt';
    }
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

    //this.propertiesContainer.remove(propertyIndex);
    //const pc = this.optionalPropertyComponents.splice(propertyIndex, 1)[0];
    //this.optionalPropertyComponents.forEach((op, ix) => { op.index = ix; });


  }

  addUnit() {
    addUnit(this.pipeline, this.index + 1);
  }

  removeUnit() {
    this.pipeline.containerFiltras.remove(this.index);
    this.pipeline.units.splice(this.index, 1);
    this.pipeline.units.forEach((u: any, i: number) => { u.index = i; });
  }

  updateFiltraLayoutOnType(newType: string) {
    if (newType === 'throttle') {
      this.properties = getThrottleProperties();
    } else if (newType === 'finder') {
      this.properties = getFinderProperties();
    }

    this.optionalPropertyNames = this.properties.filter(p => p.optional).map(p => p.name);
    this.optionalPropertySelected = this.optionalPropertyNames[0];
  }

  updateConnectorLayoutOnType(newType: string) {
    if (newType === 'mqtt') {
      this.properties = getMqttProperties();
    } else if (newType === 'gcp_pubsub') {
      this.properties = getPubsubProperties();
    } else if (newType === 'slack') {
      this.properties = getSlackProperties();
    }
  }

  updateFiltra(propertyId: string, value: any) {
    if (propertyId.startsWith('type')) {
      this.updateFiltraLayoutOnType(value);
    }
  }

  updateConnector(propertyId: any, value: any) {
    if (propertyId.startsWith('type')) {
      this.updateConnectorLayoutOnType(value);
    }
  }

  onPropertyChange(newValue: any, element: HTMLSelectElement) {
    if (this.category === 'filtra') {
      this.updateFiltra(element.id, newValue);
    } else {
      this.updateConnector(element.id, newValue)
    }
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

  // @ViewChildren(PipelineUnitComponent) children!: QueryList<PipelineUnitComponent>;

  connectorInProperties = getMandatoryProperties('connector', 'mqtt');
  connectorOutProperties = getMandatoryProperties('connector', 'mqtt');

  addUnit() {
    addUnit(this, 0);
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

    this.connectorOut.usedProperties.forEach(p => {
      connectorOut[p.name] = p.value;
    });

    this.units.forEach(u => {
      const filtra: any = {};
      u.usedProperties.forEach((p: PipelineUnitProperty) => {
        filtra[p.name] = p.value;
      });
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

    this.connectorIn.updateConnector("type", js.connector_in.type);
    for (const [name, value] of Object.entries(js.connector_in)) {
      if (name !== 'type') {
        if (typeof value === 'string' || typeof value === 'number') {
          this.connectorIn.setProperty(name, value);
        }
      }
    }

    this.connectorOut.updateConnector("type", js.connector_out.type);
    for (const [name, value] of Object.entries(js.connector_out)) {
      if (name !== 'type') {
        if (typeof value === 'string' || typeof value === 'number') {
          this.connectorOut.setProperty(name, value);
        }
      }
    }

    this.clearUnits();
    for (const filtra of js.filtras) {
      const unit = addUnit(this);
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
