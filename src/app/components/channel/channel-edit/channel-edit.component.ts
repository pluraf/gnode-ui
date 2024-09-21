import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

import { MBrokerCService } from '../../../services/mbrokerc.service';
import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    CommonModule,
    RadioButtonModule,
    SubheaderComponent,
  ],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.css',
})
export class ChannelEditComponent implements OnInit {
  value: string = '';
  chanid: string = '';

  constructor(
    private brokerService: MBrokerCService,
    private route: ActivatedRoute,
  ) {}

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Enabled', key: 'A' },
    { name: 'Disabled', key: 'B' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chanid = params.get('chanid') || '';
    });

    this.selectedCategory = this.categories[0];
  }

  onUpdate() {
    const communicationStatus =
      this.selectedCategory.key === 'A' ? 'Enabled' : 'Disabled';

    const updateData = {
      chanid: this.chanid,
      communicationStatus: communicationStatus,
    };

    this.brokerService.updateChannel(updateData).subscribe(
      (response) => {
        console.log('Update successful:', response);
      },
      (error) => {
        console.error('Update failed:', error);
      },
    );
  }
}
