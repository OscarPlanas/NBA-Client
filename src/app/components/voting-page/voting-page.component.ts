import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/data/hash';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent {
  votedPlayer: string | null = null;
  playerNames: string[] = [];
  playerRows!: string[][];
  responseData?: string;
//pubKeyServerPromise: Promise<MyRsaPublicKey>
  ngOnInit(): void {
    console.log("VotingPage");
    this.route.queryParams.subscribe(params => {
      this.responseData = this.sharedService.hash;

      console.log(this.responseData); // Check if responseData is retrieved successfully
    });
    
    this.initPlayers();
    this.playerRows = this.chunkArray(this.playerNames, 4);
  }
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}
  async initPlayers(): Promise<void> {
    const players = await this.getPlayers();
    this.playerNames = players.map((player: { name: string }) => player.name);
    this.playerRows = this.chunkArray(this.playerNames, 4);
  }

  getPlayers = async (): Promise<{ name: string }[]> => {
    const response = await fetch('http://localhost:5432/api/players/');
    const players = await response.json();
    console.log(players.map((player: { name: string }) => player.name));
    return players;
  }

  async vote(playerName: string) {
    this.votedPlayer = playerName;
    const hashUser = this.sharedService.hash;
    console.log("HashUser to send with the vote " + hashUser);
    //const response = await fetch(`http://localhost:5432/api/players/${hashUser}/${playerName}`);
    console.log('Button clicked for player:', playerName);
   
  }
  private chunkArray(array: any[], size: number): any[][] {
    return array.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
  }

}
