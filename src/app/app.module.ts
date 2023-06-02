import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenerarclausComponent } from './components/generarclaus/generarclaus.component';
import { EncryptDecryptComponent } from './components/encrypt-decrypt/encrypt-decrypt.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './click-outside.directive';
import { SignVerifyComponent } from './components/sign-verify/sign-verify.component';
import { BlindSignaturesComponent } from './components/blind-signatures/blind-signatures.component';
import { PaillierComponent } from './components/paillier/paillier.component';

@NgModule({
  declarations: [
    AppComponent,
    GenerarclausComponent,
    EncryptDecryptComponent,
    ClickOutsideDirective,
    SignVerifyComponent,
    BlindSignaturesComponent,
    PaillierComponent,

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
