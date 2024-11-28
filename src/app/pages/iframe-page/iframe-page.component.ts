import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css'],
})
export class IframePageComponent implements OnInit {
  isBlackPerspective: boolean = false;
  playerColor: 'white' | 'black' = 'white';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const color = this.route.snapshot.queryParams['color'];
    this.isBlackPerspective = color === 'black';
    this.playerColor = color as 'white' | 'black';
  }
}
