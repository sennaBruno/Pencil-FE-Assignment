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
    console.log('Alterando turno:', move.color === 'white' ? 'black' : 'white');
    this.currentTurnSubject.next(move.color === 'white' ? 'black' : 'white');
  }

  getCurrentTurn() {
    return this.currentTurnSubject.value;
  }
}
