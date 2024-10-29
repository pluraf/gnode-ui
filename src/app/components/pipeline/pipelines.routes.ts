import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { PipelineCreateComponent } from './pipeline-create/pipeline-create.component';
import { PipelineDetailComponent } from './pipeline-detail/pipeline-detail.component';
import { PipelineEditComponent } from './pipeline-edit/pipeline-edit.component';
import { PipelineDeleteComponent } from './pipeline-delete/pipeline-delete.component';
import { PipelineListComponent } from './pipeline-list/pipeline-list.component';

export const PIPELINES_ROUTES: Routes = [
  { path: '', component: PipelineListComponent },
  {
    path: 'pipeline-create',
    canActivate: [authGuard],
    component: PipelineCreateComponent,
  },
  {
    path: 'pipeline-detail/:pipeid',
    canActivate: [authGuard],
    component: PipelineDetailComponent,
  },
  {
    path: 'pipeline-edit/:pipeid',
    canActivate: [authGuard],
    component: PipelineEditComponent,
  },
  {
    path: 'pipeline-delete',
    canActivate: [authGuard],
    component: PipelineDeleteComponent,
  },
];
