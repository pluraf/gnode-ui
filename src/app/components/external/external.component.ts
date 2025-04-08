import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector: 'exteranl-app',
    standalone: true,
    imports: [CommonModule],
    providers: [],
    templateUrl: './external.component.html',
    styleUrl: './external.component.css',
  })
  export class ExternalComponent {
    @Input()
    set resource(value: string) {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(value + '/');
    }

    url: SafeResourceUrl = '';

    constructor(private sanitizer: DomSanitizer) { }
  }
