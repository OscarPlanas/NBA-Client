import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import * as bc from 'bigint-conversion';
import * as bcu from 'bigint-crypto-utils';
import { SharedService } from 'src/app/data/hash';
import { MyPaillierPublicKey } from 'src/app/models/paillierPubKey';
import { MyRsaPublicKey } from 'src/app/models/publickey';
import { Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.pubKeyPaillierServerPromise = this.getPaillierPubliKey();
    this.pubKeyServerPromise = this.getPublicKeys();
    this.blindingFactorPromise = this.blindingFactor();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.responseData = this.sharedService.hash;
    });

    this.initPlayers();
    this.playerRows = this.chunkArray(this.playerNames, 4);
  }
  blindingFactor = async () => {
    const blindingFactor = await bcu.prime(256);
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
    return pubKey;
  }


  //Server genera claves y la pública la pasa al cliente
  getPaillierPubliKey = async (): Promise<MyPaillierPublicKey> => {
    const res = await fetch('http://localhost:5432/api/users/getPailierPublicKey')
    const key = await res.json()
    const pubKey = MyPaillierPublicKey.fromJSON(key)
    return pubKey;
  }

  getPlayers = async (): Promise<Player[]> => {
    const response = await fetch('http://localhost:5432/api/players/');
    const players = await response.json();
    return players;
  }


  async vote(playerName: string, playerId: number) {
    this.votedPlayer = playerName;
    const hashUser = this.sharedService.hash;
    console.log("HashUser to send with the vote " + hashUser);

    console.log('Button clicked for player:', playerName, playerId);

    console.log('Player ID:', playerId); // Log the player ID

    const playerToPaillier = bc.textToBigint(playerName);
    console.log("Player to paillier: " + playerToPaillier);
    
    //Encriptamos el voto con paillier
    const voteToPaillier = BigInt(1);
    const paillierPubKey = await this.pubKeyPaillierServerPromise;
    const paillierVote = paillierPubKey.encrypt(voteToPaillier);

    //Encriptamos la ID del jugador
    const message = BigInt(playerId);
    const pubKey = await this.pubKeyServerPromise
    const encrypted2 = pubKey.encrypt(message);
    const encrypted64 = bc.bigintToBase64(encrypted2);
    const encrypted = bc.base64ToBigint(encrypted64);

    //Enviamos el voto encriptado con paillier y la ID del jugador encriptada con RSA
    const res = await axios.post(`http://localhost:5432/api/users/sendVote/${paillierVote}/${encrypted}`);
    console.log(res.data);

    this.router.navigate(['/vote-count']);



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
