import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDeleteComponent } from './channel-delete.component';

describe('ChannelDeleteComponent', () => {
  let component: ChannelDeleteComponent;
  let fixture: ComponentFixture<ChannelDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
