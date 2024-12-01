import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChessMove {
  from: string;
  to: string;
  color: 'white' | 'black';
}

export interface GameState {
  fen: string;
  currentTurn: 'white' | 'black';
  lastMove?: ChessMove;
}

@Injectable({
  providedIn: 'root',
})
export class ChessService {
  private readonly STORAGE_KEY = 'chess_game_state';
  private currentTurnSubject = new BehaviorSubject<'white' | 'black'>('white');
  currentTurn$ = this.currentTurnSubject.asObservable();

  constructor() {
    this.loadGameState();
  }

  private loadGameState() {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      const gameState: GameState = JSON.parse(savedState);
      this.currentTurnSubject.next(gameState.currentTurn);
    }
  }

  saveGameState(fen: string, lastMove?: ChessMove) {
    const gameState: GameState = {
      fen,
      currentTurn: this.currentTurnSubject.value,
      lastMove,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gameState));
  }

  getSavedState(): GameState | null {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }

  clearSavedState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  sendMove(move: ChessMove) {
    const nextTurn = move.color === 'white' ? 'black' : 'white';
    this.currentTurnSubject.next(nextTurn);
  }

  getCurrentTurn() {
    return this.currentTurnSubject.value;
  }

  resetGame() {
    this.currentTurnSubject.next('white');
  }
}
