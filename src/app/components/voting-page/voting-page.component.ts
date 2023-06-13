import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as bc from 'bigint-conversion'
import { SharedService } from 'src/app/data/hash';
import axios from 'axios';
import { MyPaillierPublicKey } from 'src/app/models/paillierPubKey';


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

  pubKeyPaillierServerPromise: Promise<MyPaillierPublicKey>


  
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
  ) {
    this.pubKeyPaillierServerPromise = this.getPaillierPubliKey();
  }
  async initPlayers(): Promise<void> {
    const players = await this.getPlayers();
    this.playerNames = players.map((player: { name: string }) => player.name);

    this.playerRows = this.chunkArray(this.playerNames, 4);
  }

  /*server genera claves y la pública la pasa al cliente*/
  getPaillierPubliKey = async (): Promise<MyPaillierPublicKey> => {
    const res = await fetch('http://localhost:5432/api/paillier/getPailierPublicKey')
    const key = await res.json()
    console.log(key);
    const pubKey = MyPaillierPublicKey.fromJSON(key)
    console.log(pubKey);
    return pubKey;
    
    
   // return pubKey;
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

    const playerToPaillier = bc.textToBigint(playerName);
    console.log("Player to paillier: " + playerToPaillier);
    
    const paillierPubKey = await this.pubKeyPaillierServerPromise;

    const c1 = paillierPubKey.encrypt(playerToPaillier);
    console.log("C1: " + c1);
   
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
