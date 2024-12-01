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
  showGameEndModal: boolean = false;
  winner: string = '';

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

  private handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'CHESS_MOVE') {
      try {
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

        this.chessService.sendMove(event.data.move);
      } catch (error) {
        console.error('Error processing move:', error);
      }
    } else if (event.data?.type === 'CHECKMATE') {
      this.winner = event.data.winner;
      this.showGameEndModal = true;
    }
  };

  resetGame() {
    this.showGameEndModal = false;
    this.winner = '';

    [this.iframe1, this.iframe2].forEach((iframe) => {
      iframe.nativeElement.contentWindow.postMessage(
        {
          type: 'RESET_GAME',
        },
        '*'
      );
    });

    this.chessService.resetGame();
  }

  private updateBoardStates(currentTurn: 'white' | 'black') {
    if (!this.iframe1?.nativeElement || !this.iframe2?.nativeElement) {
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

  testCheckMate() {
    [this.iframe1, this.iframe2].forEach((iframe) => {
      iframe.nativeElement.contentWindow.postMessage(
        {
          type: 'TEST_CHECKMATE',
        },
        '*'
      );
    });
  }
}
