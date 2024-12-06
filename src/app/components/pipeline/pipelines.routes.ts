import { Routes } from '@angular/router';
import { PipelineCreateComponent } from './pipeline-create/pipeline-create.component';
import { PipelineDetailComponent } from './pipeline-detail/pipeline-detail.component';
import { PipelineEditComponent } from './pipeline-edit/pipeline-edit.component';
import { PipelineListComponent } from './pipeline-list/pipeline-list.component';

export const PIPELINES_ROUTES: Routes = [
  {
    path: '',
    component: PipelineListComponent,
  },
  {
    path: 'pipeline-create',
    component: PipelineCreateComponent,
  },
  {
    path: 'pipeline-detail/:pipeid',
    component: PipelineDetailComponent,
  },
  {
    path: 'pipeline-edit/:pipeid',
    component: PipelineEditComponent,
  },
];
