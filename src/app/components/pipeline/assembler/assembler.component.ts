import { Component, Inject, inject, effect, ViewContainerRef, Input, ViewChild } from '@angular/core';
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


function addUnit(pipeline: any, index: number) {
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
}


function getMandatoryProperties(category: string, type: string): PipelineUnitProperty[] {
    if (category == 'filtra') {
        return [
            {'name': 'type', 'view': 'select', 'type': 'text', 'options': ['generator', 'throttle', 'finder'], optional: false, 'value': type}
        ];
    } else if (category == 'connector') {
        return [
            {'name': 'type', 'view': 'select', 'type': 'text', 'options': ['mqtt', 'gcp_pubsub', 'gcp_storage', 'aws_s3', 'email', 'queue', 'slack'], optional: false, 'value': type}
        ];
    } else {
        return [];
    }
}


function getCommonProperty(category: string, property: string): PipelineUnitProperty | undefined {
    if (category == 'filtra') {
        if (property == 'goto_accepted' ) {
            return {'name': 'goto_accepted', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''};
        } else if (property == 'name') {
            return {'name': 'name', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''};
        } else if (property == 'metadata') {
            return {'name': 'metadata', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''};
        }
    }
    return;
}


function getThrottleProperties(): PipelineUnitProperty[] {
    return getMandatoryProperties('filtra', 'throttle').concat(
        [
            {'name': 'rate', 'view': 'input', 'type': 'integer', 'optional': false, 'value': 1},
            getCommonProperty('filtra', 'goto_accepted')!,
            getCommonProperty('filtra', 'name')!,
            getCommonProperty('filtra', 'metadata')!,
        ]
    );
}


function getFinderProperties(): PipelineUnitProperty[] {
    return getMandatoryProperties('filtra', 'finder').concat(
        [
            {'name': 'text', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''},
            {'name': 'operator', 'view': 'select', 'type': 'string', 'options': ['match', 'contain', 'contained'], 'optional': true, 'value': 'match'},
            {'name': 'keys', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''},
            {'name': 'value_key', 'view': 'input', 'type': 'string', 'optional': true, 'value': ''},
            getCommonProperty('filtra', 'goto_accepted')!,
            getCommonProperty('filtra', 'name')!,
            getCommonProperty('filtra', 'metadata')!,
        ]
    );
}

function getMqttProperties(): PipelineUnitProperty[] {
    return getMandatoryProperties('connector', 'mqtt').concat(
        [
            {'name': 'topic', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''},
            {'name': 'server', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''}
        ]
    );
}

function getPubsubProperties(): PipelineUnitProperty[] {
    return getMandatoryProperties('connector', 'gcp_pubsub').concat(
        [
            {'name': 'authbundle_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''},
            {'name': 'project_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''},
            {'name': 'topic_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''},
        ]
    );
}

function getSlackProperties(): PipelineUnitProperty[] {
    return getMandatoryProperties('connector', 'slack').concat(
        [
            {'name': 'authbundle_id', 'view': 'input', 'type': 'string', 'optional': false, 'value': ''},
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
    @Input() property!: any;

    index = 0;
    unit!: any;

    removeProperty(){
        this.unit.removeProperty(this.index);
    }
}


@Component({
    selector: 'pipeline-unit',
    templateUrl: './pipeline-unit.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
  })
  export class PipelineUnitComponent {
    @Input() pipeline!: any;
    @Input() category!: any;
    @Input() mode!: any;
    @Input()
    set properties(value: PipelineUnitProperty[]) {
      this.properties_ = value;
      //value.forEach((u: any, i: number) => {
      //});
    }
    get properties(): any {
      return this.properties_;
    }

    @ViewChild('optionalUnitProperties', { read: ViewContainerRef }) propertiesContainer!: ViewContainerRef;

    type!: string;
    index = 0;
    optionalPropertySelected = '';
    optionalPropertyComponents: UnitPropertyComponent[] = [];
    private properties_!: PipelineUnitProperty[];
    optionalProperties: string[] = [];


    constructor() {}

    ngOnInit() {
        if (this.category === 'filtra') {
            this.updateFiltraLayoutOnType('finder');
        } else if (this.category === 'connector') {
            this.updateConnectorLayoutOnType('mqtt');
        }
    }

    getProperty(propertyName: string) {
        for (const property of this.properties) {
            if (property.name == propertyName) {
                return property;
            }
        }
    }

    addProperty(propertyName: string) {
        const property = this.propertiesContainer.createComponent(UnitPropertyComponent);
        property.instance.property = this.getProperty(propertyName);
        property.instance.index = this.propertiesContainer.length - 1;
        property.instance.unit = this;
        this.optionalPropertyComponents.push(property.instance);
        this.optionalProperties = this.optionalProperties.filter(p => p !== propertyName);
        this.optionalPropertySelected = this.optionalProperties[0];
    }

    removeProperty(propertyIndex: any) {
        this.propertiesContainer.remove(propertyIndex);
        const pc = this.optionalPropertyComponents.splice(propertyIndex, 1)[0];
        this.optionalPropertyComponents.forEach((op, ix) => { op.index = ix; });
        this.optionalProperties.push(pc.property.name);
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
        if(newType === 'throttle') {
            this.properties = getThrottleProperties();
        }else if (newType === 'finder') {
            this.properties = getFinderProperties();
        }
        for (const property of this.properties) {
            if (property.optional) {
                this.optionalProperties.push(property.name);
            }
        }
        this.optionalPropertySelected = this.optionalProperties[0];
    }

    updateConnectorLayoutOnType(newType: string) {
        if(newType === 'mqtt') {
            this.properties = getMqttProperties();
        }else if (newType === 'gcp_pubsub') {
            this.properties = getPubsubProperties();
        }else if (newType === 'slack') {
            this.properties = getSlackProperties();
        }
    }

    updateFiltra(propertyId: string , value: any) {
        if (propertyId.startsWith('type')) {
            this.updateFiltraLayoutOnType(value);
        }
    }

    updateConnector(propertyId:any , value: any) {
        if (propertyId.startsWith('type')) {
            this.updateConnectorLayoutOnType(value);
        }
    }

    onPropertyChange(newValue: any, element: HTMLSelectElement) {
        console.log(this);
        if(this.category === 'filtra') {
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
    @ViewChild('pipelineConnectorInContainer', { read: ViewContainerRef }) connectorInContainer!: ViewContainerRef;
    @ViewChild('pipelineFiltrasContainer', { read: ViewContainerRef }) containerFiltras!: ViewContainerRef;
    @ViewChild('pipelineConnectorOutContainer', { read: ViewContainerRef }) connectorOutContainer!: ViewContainerRef;
    units: any[] = [];

    connectorInProperties = getMandatoryProperties('connector', 'mqtt');
    connectorOutProperties = getMandatoryProperties('connector', 'mqtt');

    addUnit() {
        addUnit(this, 0);
    }
  }
