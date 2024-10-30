import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GCloudComponent } from './g-cloud.component';
import { BackendService } from '../../../services/backend.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('GCloudComponent', () => {
  let component: GCloudComponent;
  let fixture: ComponentFixture<GCloudComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GCloudComponent, HttpClientModule],
      providers: [BackendService, provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GCloudComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
