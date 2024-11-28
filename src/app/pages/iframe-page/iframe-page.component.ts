import { Component, OnInit } from '@angular/core';
import { ChessService, ChessMove } from '../../services/chess.service';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css'],
})
export class IframePageComponent implements OnInit {
  constructor(private chessService: ChessService) {}

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'CHESS_MOVE') {
        this.chessService.sendMove(event.data.move);
      }
    });
  }
}
