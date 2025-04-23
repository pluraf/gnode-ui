import { Routes } from '@angular/router';
import { ConverterListComponent } from './converter-list/converter-list.component';
import { ConverterCreateComponent } from './converter-create/converter-create.component';
import { ConverterEditComponent } from './converter-edit/converter-edit.component';


export const CONVERTER_ROUTES: Routes = [
  {
    path: '',
    component: ConverterListComponent,
  },
  {
    path: 'converter-create',
    component: ConverterCreateComponent,
  },
  {
    path: 'converter-edit/:converterId',
    component: ConverterEditComponent,
  },
];
