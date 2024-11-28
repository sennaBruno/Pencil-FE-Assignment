import { Component, ViewChild, Input, OnInit, OnDestroy } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ChessService, ChessMove } from '../../services/chess.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
})
export class ChessBoardComponent implements OnInit, OnDestroy {
  @ViewChild('board') board!: NgxChessBoardView;
  @Input() isBlackPerspective: boolean = false;
  @Input() playerColor: 'white' | 'black' = 'white';

  isDisabled: boolean = false;
  private messageListener: any;

  constructor(private chessService: ChessService) {}

  ngOnInit() {
    this.messageListener = (event: MessageEvent) => {
      if (
        event.data?.type === 'CHESS_MOVE' &&
        event.data.move?.color !== this.playerColor
      ) {
        try {
          // Aplica o movimento no tabuleiro
          this.board.move(`${event.data.move.from}${event.data.move.to}`);
          // Atualiza o turno após receber o movimento
          this.chessService.sendMove(event.data.move);
        } catch (error) {
          console.error('Erro ao mover peça:', error);
        }
      }
    };

    window.addEventListener('message', this.messageListener);

    // Controle de turnos
    this.chessService.currentTurn$.subscribe((turn) => {
      this.isDisabled = turn !== this.playerColor;
      console.log(
        `Turno atual: ${turn}, Jogador: ${this.playerColor}, Desabilitado: ${this.isDisabled}`
      );
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageListener);
  }

  onMoveChange(event: any) {
    console.log('Movimento detectado:', event);

    if (this.isDisabled) {
      console.log('Movimento bloqueado - não é seu turno');
      return;
    }

    const move: ChessMove = {
      from: event.from,
      to: event.to,
      color: this.playerColor,
    };

    // Envia movimento para o pai
    window.parent.postMessage(
      {
        type: 'CHESS_MOVE',
        move: move,
      },
      '*'
    );
  }
}
