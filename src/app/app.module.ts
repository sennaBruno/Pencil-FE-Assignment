import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgxChessBoardModule } from 'ngx-chess-board';

import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { IframePageComponent } from './pages/iframe-page/iframe-page.component';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    IframePageComponent,
    ChessBoardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgxChessBoardModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
