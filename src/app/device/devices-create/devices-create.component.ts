import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';
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

  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];

  inputMethod: any[] = [
    { name: 'Enter manually', key: 'EM' },
    { name: 'Upload', key: 'U' },
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[1];
    this.selectedMethod = this.inputMethod[1];
  }
}
