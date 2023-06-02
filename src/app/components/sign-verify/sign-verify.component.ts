import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bcu from 'bigint-crypto-utils';
import { MyRsaPublicKey } from 'src/app/models/publickey';
import { MyRsaPrivateKey } from 'src/app/models/privatekey';
import * as bc from 'bigint-conversion'

interface SignedMessage {
  signed: string;
}

interface VerifiedMessage {
  verified: string;
}

@Component({
  selector: 'app-sign-verify',
  templateUrl: './sign-verify.component.html',
  styleUrls: ['./sign-verify.component.css']
})
export class SignVerifyComponent implements OnInit {
  textToSign: FormGroup;
  pubKeyServerPromise: Promise<MyRsaPublicKey>
 
  messagetosign?: bigint;
  messagetoverify?: bigint;
  
  signedMessage?: SignedMessage;
  verifiedMessage?: VerifiedMessage;

  constructor(private formBuilder: FormBuilder) {

    this.textToSign = this.formBuilder.group({});
    this.pubKeyServerPromise = this.getPublicKeys();

   }

   ngOnInit(): void {
    this.textToSign = this.formBuilder.group({
      messagetosign: [''],
      messagetoverify: ['']
    });
      console.log("hola");
  }
  getPublicKeys = async (): Promise<MyRsaPublicKey> => {
    const res = await axios.get('http://localhost:3000/publicKey')
    console.log(res.data);
    const pubKey = MyRsaPublicKey.fromJSON(res.data)
    console.log(pubKey);
    return pubKey;
  }

  signMessage = async () => {

    console.log('Signing message:', this.textToSign.value.messagetosign);
    const mess = BigInt(this.textToSign.value.messagetosign);
    console.log(mess);
    const res = await axios.post(`http://localhost:3000/sign/${mess}`)
    console.log(res.data.signature);
    const signed = res.data.signature;
    this.signedMessage = { signed };
  }

  async verifyMessage() {
    console.log('Verifying message:', this.textToSign.value.messagetoverify);
    const mess = bc.base64ToBigint(this.textToSign.value.messagetoverify);
    console.log(mess);
    
    const pubKey = await this.pubKeyServerPromise;
    const verified = pubKey.verify(BigInt(mess));
    
    console.log("verified: " + verified);
    this.verifiedMessage = { verified: verified.toString() };
    
  }

}
