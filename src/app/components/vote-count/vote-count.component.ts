import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-vote-count',
  templateUrl: './vote-count.component.html',
  styleUrls: ['./vote-count.component.css']
})
export class VoteCountComponent implements OnInit {
  
  players?: any[];

  constructor() { }

  ngOnInit(): void {
    this.fetchPlayers();
  }

  fetchPlayers(): void {
    axios.get<any[]>('http://localhost:5432/api/users/getAllPlayers')
      .then(response => {
        this.players = response.data;
        this.sortPlayersByVotes();
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }
  

  sortPlayersByVotes(): void {
    this.players!.sort((a, b) => b.votes - a.votes);
  }

}
