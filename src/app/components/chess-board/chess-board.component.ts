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

  constructor(private chessService: ChessService) {}

  ngOnInit() {
    window.addEventListener('message', this.handleMessage);

    // Subscribe to turn changes
    this.turnSubscription = this.chessService.currentTurn$.subscribe((turn) => {
      console.log(`${this.playerColor} - Current turn:`, turn);
      this.isDisabled = turn !== this.playerColor;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.isBlackPerspective) {
        console.log('Rotating board for black perspective');
        this.board.reverse();
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleMessage);
    if (this.turnSubscription) {
      this.turnSubscription.unsubscribe();
    }
  }

  private handleMessage = (event: MessageEvent) => {
    if (
      event.data?.type === 'CHESS_MOVE' &&
      event.data.move?.color !== this.playerColor
    ) {
      try {
        console.log(`${this.playerColor} receiving move:`, event.data.move);
        const moveString = `${event.data.move.from}${event.data.move.to}`;
        this.board.move(moveString);
      } catch (error) {
        console.error('Error moving piece:', error);
      }
    }
  };

  onMoveChange(event: any) {
    // No turn check here as [dragDisabled] already controls it
    console.log(`${this.playerColor} sending move:`, event);

    const move: ChessMove = {
      from: event.move.substring(0, 2),
      to: event.move.substring(2, 4),
      color: this.playerColor,
    };

    window.parent.postMessage(
      {
        type: 'CHESS_MOVE',
        move: move,
      },
      '*'
    );

    // Update turn after move
    this.chessService.sendMove(move);
  }
}
