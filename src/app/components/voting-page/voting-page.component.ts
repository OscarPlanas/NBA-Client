import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import * as bc from 'bigint-conversion';
import * as bcu from 'bigint-crypto-utils';
import { SharedService } from 'src/app/data/hash';
import { MyPaillierPublicKey } from 'src/app/models/paillierPubKey';
import { MyRsaPublicKey } from 'src/app/models/publickey';

interface Player {
  name: string;
  id: number;
}

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent {
  votedPlayer: string | null = null;
  playerNames: { name: string, id: number }[] = [];
  pubKeyServerPromise: Promise<MyRsaPublicKey>
  playerRows!: Player[][];

  responseData?: string;

  pubKeyPaillierServerPromise: Promise<MyPaillierPublicKey>;
  blindingFactorPromise: Promise<bigint>;


  //pubKeyServerPromise: Promise<MyRsaPublicKey>

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.pubKeyPaillierServerPromise = this.getPaillierPubliKey();
    this.pubKeyServerPromise = this.getPublicKeys();
    this.blindingFactorPromise = this.blindingFactor();
  }
  ngOnInit(): void {
    console.log("VotingPage");
    this.route.queryParams.subscribe(params => {
      this.responseData = this.sharedService.hash;

      console.log(this.responseData); // Check if responseData is retrieved successfully
    });

    this.initPlayers();
    this.playerRows = this.chunkArray(this.playerNames, 4);
  }
  blindingFactor = async () => {
    const blindingFactor = await bcu.prime(256);
    console.log('Blinding Factor:', blindingFactor.toString());
    return blindingFactor;
  }
  async initPlayers(): Promise<void> {
    const players = await this.getPlayers();
    this.playerNames = players.map((player: Player) => ({ name: player.name, id: player.id }));

    this.playerRows = this.chunkArray(this.playerNames, 4);
  }

  getPublicKeys = async (): Promise<MyRsaPublicKey> => {
    console.log("getPublicKeys");
    const res = await axios.get('http://localhost:5432/api/users/publicKey')
    console.log(res.data);
    const pubKey = MyRsaPublicKey.fromJSON(res.data)
    console.log(pubKey);
    return pubKey;
  }


  /*server genera claves y la pública la pasa al cliente*/
  getPaillierPubliKey = async (): Promise<MyPaillierPublicKey> => {
    const res = await fetch('http://localhost:5432/api/users/getPailierPublicKey')
    const key = await res.json()
    console.log(key);
    const pubKey = MyPaillierPublicKey.fromJSON(key)
    console.log(pubKey);
    return pubKey;


    // return pubKey;
  }

  getPlayers = async (): Promise<Player[]> => {
    const response = await fetch('http://localhost:5432/api/players/');
    const players = await response.json();
    console.log(players.map((player: Player) => player.name));
    console.log(players.map((player: Player) => player.id));

    return players;
  }


  async vote(playerName: string, playerId: number) {
    this.votedPlayer = playerName;
    const hashUser = this.sharedService.hash;
    console.log("HashUser to send with the vote " + hashUser);
    //const response = await fetch(`http://localhost:5432/api/players/${hashUser}/${playerName}`);
    console.log('Button clicked for player:', playerName, playerId);

    console.log('Player ID:', playerId); // Log the player ID

    const playerToPaillier = bc.textToBigint(playerName);
    console.log("Player to paillier: " + playerToPaillier);
    
    const voteToPaillier = BigInt(1);
    console.log("Vote to paillier: " + voteToPaillier);
    

    const paillierPubKey = await this.pubKeyPaillierServerPromise;

    const paillierVote = paillierPubKey.encrypt(voteToPaillier);
    console.log("C1: " + paillierVote);

    //Encriptamos la ID del jugador
    /* const encrypted = pubKey.encrypt(message2);
    console.log(encrypted);
    const encrypted2 = bc.bigintToBase64(encrypted);
    this.encryptedMessage = { encrypted2 };
    console.log("en base 64 " + encrypted2);
    console.log("en base 64 otro " + this.encryptedMessage.encrypted2);
*/
    console.log('Encrypting message:', playerId);
    const message = BigInt(playerId);
    const pubKey = await this.pubKeyServerPromise
    console.log("AQUI: "+pubKey.e);
    console.log("AQUI: "+pubKey.n);
    const encrypted2 = pubKey.encrypt(message);
    console.log(encrypted2);
    const encrypted64 = bc.bigintToBase64(encrypted2);
    const encrypted = bc.base64ToBigint(encrypted64);

    const res = await axios.post(`http://localhost:5432/api/users/sendVote/${paillierVote}/${encrypted}`);
    console.log(res.data);



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
