import { Component } from '@angular/core';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent {
  votedPlayer: string | null = null;

  vote(player: string): void {
    this.votedPlayer = player;
  }
}
