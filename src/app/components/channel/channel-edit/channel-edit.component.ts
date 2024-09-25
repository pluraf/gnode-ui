import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  clientid = '';
  username = '';
  password = '';
  authtype = '';

  constructor(
    private brokerService: MBrokerCService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Enabled', key: 'A' },
    { name: 'Disabled', key: 'B' },
  ];

  selectedOption: string = 'jwt';

  authOptions = [
    { value: 'jwt', label: 'JWT_ES256' },
    { value: 'password', label: 'Username & Password' },
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
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.label : '';

    const disabled = this.selectedCategory.name === 'Allow';

    const updateData: any = {
      chanid: this.chanid,
      communicationStatus: communicationStatus,
      authtype: this.authtype,
      password: this.password,
      disabled: disabled,
    };
    if (this.username !== '') {
      updateData.username = this.username;
    }
    if (this.clientid !== '') {
      updateData.clientid = this.clientid;
    }
    this.brokerService.updateChannel(updateData).subscribe(
      (response) => {
        console.log('Update successful:', response);
        this.router.navigateByUrl('/channels');
      },
      (error) => {
        console.error('Update failed:', error);
      },
    );
  }
}
