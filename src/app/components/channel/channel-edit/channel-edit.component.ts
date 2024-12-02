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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule,
  ],
  providers: [MessageService],
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
  jwtKey = '';
  loading: boolean = false;

  constructor(
    private brokerService: MBrokerCService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {}

  dataLoaded = false;

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

      this.brokerService
        .loadChannelDetails(this.chanid)
        .subscribe((response: any) => {
          this.dataLoaded = true;
          const channel = response.responses[0].data.channel;

          this.clientid = channel.clientid || '';
          this.username = channel.username || '';
          this.password = '';
          this.selectedOption =
            channel.authtype.toLowerCase() === 'jwt_es256' ? 'jwt' : 'password';

          if (this.selectedOption === 'jwt' && channel.jwtkey) {
            this.jwtKey = channel.jwtkey.replace(/(.{64})/g, '$1\n');
          }
        });
    });
    this.selectedCategory = this.categories[0];
  }

  onUpdate() {
    const communicationStatus =
      this.selectedCategory.key === 'A' ? 'Enabled' : 'Disabled';
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const updateData: any = {
      chanid: this.chanid,
      communicationStatus: communicationStatus,
      authtype: this.authtype,
      clientid: this.clientid || undefined,
      username: this.username || undefined,
      password: this.selectedOption === 'password' ? this.password : undefined,
      jwtkey:
        this.selectedOption === 'jwt'
          ? this.jwtKey.replace(/\n/g, '')
          : undefined,
    };

    this.brokerService.updateChannel(updateData).subscribe((response) => {
      if (response.responses && response.responses[0]) {
        const resp = response.responses[0];
        if (resp.hasOwnProperty('error') && resp.error) {
          this.handleMessage('error', resp.error, true);
        } else {
          this.handleMessage('success', 'Channel edited successfully', false);
        }
      }
    });
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
  }
}
