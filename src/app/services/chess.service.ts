import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChessMove {
  from: string;
  to: string;
  color: 'white' | 'black';
}

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  private currentTurnSubject = new BehaviorSubject<'white' | 'black'>('white');
  currentTurn$ = this.currentTurnSubject.asObservable();

  sendMove(move: ChessMove) {
    const nextTurn = move.color === 'white' ? 'black' : 'white';
    console.log('Alterando turno:', nextTurn);
    this.currentTurnSubject.next(nextTurn);
  }

  getCurrentTurn() {
    return this.currentTurnSubject.value;
  }
}
