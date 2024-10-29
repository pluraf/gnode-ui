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
    path: 'channel-create',
    canActivate: [authGuard],
    component: PipelineCreateComponent,
  },
  {
    path: 'channel/:chanid',
    canActivate: [authGuard],
    component: PipelineDetailComponent,
  },
  {
    path: 'channel-edit/:chanid',
    canActivate: [authGuard],
    component: PipelineEditComponent,
  },
  {
    path: 'channel-delete',
    canActivate: [authGuard],
    component: PipelineDeleteComponent,
  },
];
