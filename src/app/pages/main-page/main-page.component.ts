import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChessService } from '../../services/chess.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('iframe1') iframe1!: ElementRef;
  @ViewChild('iframe2') iframe2!: ElementRef;

  whiteBoardUrl: SafeResourceUrl;
  blackBoardUrl: SafeResourceUrl;
  private turnSubscription?: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private chessService: ChessService
  ) {
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.turnSubscription = this.chessService.currentTurn$.subscribe(
        (turn) => {
          this.updateBoardStates(turn);
        }
      );
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleMessage);
    if (this.turnSubscription) {
      this.turnSubscription.unsubscribe();
    }
  }

  private updateBoardStates(currentTurn: 'white' | 'black') {
    if (!this.iframe1?.nativeElement || !this.iframe2?.nativeElement) {
      console.log('Iframes ainda não estão prontos');
      return;
    }

    [this.iframe1, this.iframe2].forEach((iframe) => {
      iframe.nativeElement.contentWindow.postMessage(
        {
          type: 'TURN_CHANGE',
          currentTurn: currentTurn,
        },
        '*'
      );
    });
  }

  private handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'CHESS_MOVE') {
      try {
        console.log('Main page receiving move:', event.data);
        const targetIframe =
          event.data.move.color === 'white'
            ? this.iframe2.nativeElement.contentWindow
            : this.iframe1.nativeElement.contentWindow;

        targetIframe.postMessage(
          {
            type: 'CHESS_MOVE',
            move: event.data.move,
          },
          '*'
        );

        // Atualizar o serviço com o novo movimento
        this.chessService.sendMove(event.data.move);
      } catch (error) {
        console.error('Error processing move:', error);
      }
    }
  };
}
