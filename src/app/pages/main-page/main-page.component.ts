import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  whiteBoardUrl: SafeResourceUrl;
  blackBoardUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.whiteBoardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/iframepage?color=white'
    );
    this.blackBoardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/iframepage?color=black'
    );
  }

  ngOnInit() {
    window.addEventListener('message', this.handleMessage);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleMessage);
  }

  private handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'CHESS_MOVE') {
      try {
        console.log('Main page receiving move:', event.data);

        // Determine which iframe should receive the move
        const targetIframe =
          event.data.move.color === 'white'
            ? this.iframe2.nativeElement.contentWindow
            : this.iframe1.nativeElement.contentWindow;

        // Send the move to the target iframe
        targetIframe.postMessage(
          {
            type: 'CHESS_MOVE',
            move: event.data.move,
          },
          '*'
        );
      } catch (error) {
        console.error('Error processing move:', error);
      }
    }
  };
}
