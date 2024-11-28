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

    // Inscreve-se nas mudanças de turno
    this.turnSubscription = this.chessService.currentTurn$.subscribe((turn) => {
      console.log(`${this.playerColor} - Turno atual:`, turn);
      this.isDisabled = turn !== this.playerColor;
    });
  }

  ngAfterViewInit() {
    // Configura a orientação inicial do tabuleiro após a view ser inicializada
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

        // Atualiza o turno após receber o movimento
        this.chessService.sendMove(event.data.move);
      } catch (error) {
        console.error('Erro ao mover peça:', error);
      }
    }
  };

  onMoveChange(event: any) {
    if (this.isDisabled) {
      console.log('Movimento bloqueado - não é seu turno');
      return;
    }

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

    // Atualiza o turno após enviar o movimento
    this.chessService.sendMove(move);
  }
}
