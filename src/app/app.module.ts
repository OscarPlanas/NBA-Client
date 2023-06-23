import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './click-outside.directive';
import { IntroduceUsernameComponent } from './components/introduce-username/introduce-username.component';
import { VotingPageComponent } from './components/voting-page/voting-page.component';
import { VoteCountComponent } from './components/vote-count/vote-count.component';

@NgModule({
  declarations: [
    AppComponent,
    ClickOutsideDirective,
    IntroduceUsernameComponent,
    VotingPageComponent,
    VoteCountComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
