import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-connector-create',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    PasswordModule,
  ],
  templateUrl: './connector-create.component.html',
  styleUrl: './connector-create.component.css',
})
export class ConnectorCreateComponent implements OnInit {
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
    { name: 'Enter Manually', key: 'EM' },
    { name: 'Upload', key: 'U' },
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

  onSubmit() {}
}
