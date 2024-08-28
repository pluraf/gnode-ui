import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng-modules';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devices-edit',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule],
  templateUrl: './devices-edit.component.html',
  styleUrl: './devices-edit.component.css',
})
export class DevicesEditComponent implements OnInit {
  value: string = '';

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];
  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  update() {}
}
