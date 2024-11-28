import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  private messageListener: any;

  ngOnInit() {
    this.messageListener = (event: MessageEvent) => {
      if (event.data?.type === 'CHESS_MOVE') {
        try {
          const targetIframe =
            event.source === this.iframe1?.nativeElement.contentWindow
              ? this.iframe2?.nativeElement
              : this.iframe1?.nativeElement;

          if (targetIframe?.contentWindow) {
            targetIframe.contentWindow.postMessage(event.data, '*');
          }
        } catch (error) {
          console.error('Erro na comunicação entre iframes:', error);
        }
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy() {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
  }

  onIframeLoad(event: Event, iframeNumber: number) {
    console.log(`Iframe ${iframeNumber} carregado`);
  }
}
