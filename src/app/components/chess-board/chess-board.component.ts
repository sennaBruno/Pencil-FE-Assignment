import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ChessService, ChessMove } from '../../services/chess.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
})
export class ChessBoardComponent implements OnInit {
  @ViewChild('board') board!: NgxChessBoardView;
  @Input() isBlackPerspective: boolean = false;
  @Input() playerColor: 'white' | 'black' = 'white';

  constructor(private chessService: ChessService) {}

  ngOnInit() {
    this.chessService.moves$.subscribe((move: ChessMove) => {
      if (move.color !== this.playerColor) {
        this.board.move(move.from);
      }
    });
  }

  onMoveChange(move: any) {
    const chessMove: ChessMove = {
      from: `${move.move.from}${move.move.to}`,
      to: '',
      color: this.playerColor,
    };

    window.parent.postMessage(
      {
        type: 'CHESS_MOVE',
        move: chessMove,
      },
      '*'
    );
  }
}
