import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelDeleteComponent } from './channel-delete.component';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ChannelDeleteComponent', () => {
  let component: ChannelDeleteComponent;
  let fixture: ComponentFixture<ChannelDeleteComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelDeleteComponent],
      providers: [provideAnimations()],
    }).compileComponents;
    fixture = TestBed.createComponent(ChannelDeleteComponent);
    component = fixture.componentInstance;
  });
  it('should create ChannelDeleteComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should emit deleteConfirmed when onDelete is called', () => {
    spyOn(component.deleteConfirmed, 'emit');
    component.onDelete();
    expect(component.deleteConfirmed.emit).toHaveBeenCalled();
  });
  it('should emit cancel when onCancel is called', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
  it('should emit cancel when onClose is called', () => {
    spyOn(component.cancel, 'emit');
    component.onClose();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should return false when isMultiple is called and there is only one channel', () => {
    component.channels = [{ id: '1' }];
    expect(component.isMultiple).toBeFalse();
  });

  it('should return true when isMultiple is called and have more than one channel', () => {
    component.channels = [{ id: '1' }, { id: '2' }];
    expect(component.isMultiple).toBeTrue();
  });
  it('should have an empty array when there is no channels in channelIds array', () => {
    component.channels = [];
    expect(component.channelIds).toEqual([]);
  });
  it('should have an array of channel IDs when channels are present', () => {
    component.channels = [{ id: '1' }, { id: '2' }];
    expect(component.channelIds).toEqual(['1', '2']);
  });
});
