import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { GTimeComponent } from './g-time.component';
import { BackendService } from '../../../services/backend.service';

describe('GTimeComponent', () => {
  let component: GTimeComponent;
  let fixture: ComponentFixture<GTimeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GTimeComponent, HttpClientModule],
      providers: [BackendService, provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GTimeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
