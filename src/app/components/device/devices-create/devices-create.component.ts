import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng-modules';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-devices-create',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule, FormsModule],
  templateUrl: './devices-create.component.html',
  styleUrl: './devices-create.component.css',
})
export class DevicesCreateComponent implements OnInit {
  value!: string;
  selectedCategory: any = null;
  selectedMethod: any = null;
  communication: string = 'Allow';
  showUserPassField = false;
  showPublicKeyField = false;

  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];

  inputMethod: any[] = [
    { name: 'Username & Password', key: 'UP' },
    { name: 'Public Key', key: 'PK' },
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[0];
    this.selectedMethod = this.inputMethod[0];
  }

  onSelectedOption() {
    if (this.selectedMethod.name === 'Username & Password') {
      this.showUserPassField = true;
    } else if (this.selectedMethod.name === 'Public Key') {
      this.showPublicKeyField = true;
    }
  }
}
