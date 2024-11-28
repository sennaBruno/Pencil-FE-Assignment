import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  onIframeLoad(event: Event, iframeNumber: number) {
    console.log(`Iframe ${iframeNumber} carregado`);
  }
}
