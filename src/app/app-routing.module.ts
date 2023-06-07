import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncryptDecryptComponent } from './components/encrypt-decrypt/encrypt-decrypt.component';
import { IntroduceUsernameComponent } from './components/introduce-username/introduce-username.component';
import { VotingPageComponent } from './voting-page/voting-page.component'; // Importa el componente VotingPageComponent

const routes: Routes = [
  { path: '', component: EncryptDecryptComponent },
  { path: 'introduce-username', component: IntroduceUsernameComponent },
  { path: 'voting-page', component: VotingPageComponent }, // Agrega esta línea
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

