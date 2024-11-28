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

    this.turnSubscription = this.chessService.currentTurn$.subscribe((turn) => {
      console.log(`${this.playerColor} - Turno atual:`, turn);
      this.isDisabled = turn !== this.playerColor;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.isBlackPerspective) {
        console.log('Rotacionando tabuleiro para perspectiva preta');
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
        console.log(
          `${this.playerColor} recebendo movimento:`,
          event.data.move
        );
        const moveString = `${event.data.move.from}${event.data.move.to}`;
        this.board.move(moveString);
      } catch (error) {
        console.error('Erro ao mover peça:', error);
      }
    }
  };

  onMoveChange(event: any) {
    // Não verifica o turno aqui, pois o [dragDisabled] já controla isso
    console.log(`${this.playerColor} enviando movimento:`, event);

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

    // Atualiza o turno após o movimento
    this.chessService.sendMove(move);
  }
}
