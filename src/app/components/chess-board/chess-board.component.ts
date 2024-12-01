import {
  Component,
  ViewChild,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ChessService, ChessMove } from '../../services/chess.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
})
export class ChessBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('board') board!: NgxChessBoardView;
  @Input() isBlackPerspective: boolean = false;
  @Input() playerColor: 'white' | 'black' = 'white';
  isDisabled: boolean = false;
  private turnSubscription?: Subscription;
  private lastFEN: string = '';

  constructor(private chessService: ChessService) {}

  ngOnInit() {
    window.addEventListener('message', this.handleMessage);
    this.turnSubscription = this.chessService.currentTurn$.subscribe((turn) => {
      const newDisabledState = turn !== this.playerColor;
      if (this.isDisabled !== newDisabledState) {
        this.isDisabled = newDisabledState;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const savedState = this.chessService.getSavedState();

      if (savedState) {
        this.board.setFEN(savedState.fen);
        if (savedState.lastMove) {
          window.parent.postMessage(
            {
              type: 'CHESS_MOVE',
              move: savedState.lastMove,
            },
            '*'
          );
        }
      }

      if (this.isBlackPerspective) {
        this.board.reverse();
      }

      const currentTurn = this.chessService.getCurrentTurn();
      this.isDisabled = currentTurn !== this.playerColor;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleMessage);
    if (this.turnSubscription) {
      this.turnSubscription.unsubscribe();
    }
  }

  onMoveChange(event: any) {
    if (this.isDisabled) {
      return;
    }

    const move: ChessMove = {
      from: event.move.substring(0, 2),
      to: event.move.substring(2, 4),
      color: this.playerColor,
    };

    setTimeout(() => {
      const currentFEN = this.board.getFEN();
      this.chessService.saveGameState(currentFEN, move);

      if (this.isCheckMate(currentFEN)) {
        this.chessService.clearSavedState();
        window.parent.postMessage(
          {
            type: 'CHECKMATE',
            winner: this.playerColor,
          },
          '*'
        );
      }
      this.lastFEN = currentFEN;
    });

    window.parent.postMessage(
      {
        type: 'CHESS_MOVE',
        move: move,
      },
      '*'
    );
  }

  resetBoard() {
    this.board.reset();
    if (this.isBlackPerspective) {
      setTimeout(() => {
        this.board.reverse();
      });
    }
  }

  private handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'TEST_CHECKMATE') {
      this.testCheckMate();
    } else if (event.data?.type === 'TURN_CHANGE') {
      this.isDisabled = event.data.currentTurn !== this.playerColor;
    } else if (
      event.data?.type === 'CHESS_MOVE' &&
      event.data.move?.color !== this.playerColor
    ) {
      try {
        const moveString = `${event.data.move.from}${event.data.move.to}`;
        this.board.move(moveString);
      } catch (error) {
        console.error('Erro ao mover peça:', error);
      }
    } else if (event.data?.type === 'RESET_GAME') {
      this.resetBoard();
    }
  };

  private isCheckMate(fen: string): boolean {
    const moveHistory = this.board.getMoveHistory();
    const lastMove = moveHistory[moveHistory.length - 1];

    if (fen !== this.lastFEN && lastMove?.move.includes('#')) {
      setTimeout(() => {
        window.parent.postMessage(
          {
            type: 'CHECKMATE',
            winner: this.playerColor,
          },
          '*'
        );
      }, 100);
      return true;
    }
    return false;
  }

  testCheckMate() {
    const foolsMatePosition =
      'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 3';
    this.board.setFEN(foolsMatePosition);

    setTimeout(() => {
      window.parent.postMessage(
        {
          type: 'CHECKMATE',
          winner: 'black',
        },
        '*'
      );
    }, 100);
  }
}
