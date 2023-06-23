import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroduceUsernameComponent } from './components/introduce-username/introduce-username.component';
import { VotingPageComponent } from './components/voting-page/voting-page.component'; // Importa el componente VotingPageComponent
import { VoteCountComponent } from './components/vote-count/vote-count.component';
const routes: Routes = [
  { path: '', component: IntroduceUsernameComponent },
  { path: 'introduce-username', component: IntroduceUsernameComponent },
  { path: 'voting-page', component: VotingPageComponent },
  { path: 'vote-count', component: VoteCountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

