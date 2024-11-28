import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ChessMove {
  from: string;
  to: string;
  color: 'white' | 'black';
}

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  private moveSubject = new Subject<ChessMove>();
  moves$ = this.moveSubject.asObservable();

  sendMove(move: ChessMove) {
    this.moveSubject.next(move);
  }
}
