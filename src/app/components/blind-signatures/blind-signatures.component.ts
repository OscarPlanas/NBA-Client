import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bcu from 'bigint-crypto-utils';
import { MyRsaPublicKey } from 'src/app/models/publickey';
import * as bc from 'bigint-conversion'
import { MyRsaPrivateKey } from 'src/app/models/privatekey';
import { MyRsaKeys } from 'src/app/models/clientKeys';
import { generate } from 'rxjs';

interface BlindedMessage {
  blinded: string;
}

interface UnblindedMessage {
  unblinded: string;
}

@Component({
  selector: 'app-blind-signatures',
  templateUrl: './blind-signatures.component.html',
  styleUrls: ['./blind-signatures.component.css']
})
export class BlindSignaturesComponent implements OnInit {
  textToBlind: FormGroup;
  pubKeyServerPromise: Promise<MyRsaPublicKey>
  KeysClientPromise: Promise<MyRsaKeys>
  messagetoblind?: bigint;
  messagetounblind?: bigint;

  blindedMessage?: BlindedMessage;
  unblindedMessage?: UnblindedMessage;

  blindingFactorPromise: Promise<bigint>;



  constructor(private formBuilder: FormBuilder) {

    this.textToBlind = this.formBuilder.group({});
    this.pubKeyServerPromise = this.getPublicKeys();
    this.KeysClientPromise = this.generateClientKeys();
    this.blindingFactorPromise = this.blindingFactor();
    
    

   }

  ngOnInit(): void {
    this.textToBlind = this.formBuilder.group({
      messagetoblind: [''],
      messagetounblind: ['']
    });
  }
  
  blindingFactor = async () => { 
    const blindingFactor = await bcu.prime(256);
    console.log('Blinding Factor:', blindingFactor.toString());
    return blindingFactor;
  }

  getPublicKeys = async (): Promise<MyRsaPublicKey> => {
    const res = await axios.get('http://localhost:3000/publicKey')
    console.log(res.data);
    const pubKey = MyRsaPublicKey.fromJSON(res.data)
    console.log(pubKey);
    return pubKey;
  }

  generateClientKeys = async () => {
    const privateKey = (await MyRsaKeys.generateMyRsaKeys()).privateKey;
    const privateJson = privateKey.toJSON();
    console.log("clave privada de cliente:");
    console.log(privateJson);
    const publicKey = (await MyRsaKeys.generateMyRsaKeys()).publicKey;
    const publicJson = publicKey.toJSON();
    console.log("clave publica de cliente:");
    console.log(publicJson);
    return {privateKey, publicKey};
  }

  blind = async () => {
    console.log('Message to blind' + this.textToBlind.value.messagetoblind);
    const mess = BigInt(this.textToBlind.value.messagetoblind);
    console.log(mess);
    
    const pubKey = await this.pubKeyServerPromise;
    console.log(pubKey);
    console.log(pubKey.n);
    console.log(pubKey.e);

    const blindingFactor = await this.blindingFactorPromise;
    console.log('Blinding Factor:', blindingFactor.toString());
    
    //console.log(privateKey.n);
    const blindedMessage = (mess * bcu.modPow(blindingFactor, pubKey.e, pubKey.n)) % pubKey.n;
    console.log('Blinded Message:', blindedMessage);
    
    this.blindedMessage = { blinded: blindedMessage.toString() };
    
  }
  
  signblind = async () => {
    console.log('Message to unblind ' + this.textToBlind.value.messagetounblind);
    const mess = this.textToBlind.value.messagetounblind;
    console.log(mess);

    const blindingFactor = await this.blindingFactorPromise;
    console.log('Blinding Factor:', blindingFactor.toString());

    const pubKey = await this.pubKeyServerPromise;
    console.log(pubKey);

    const res = await axios.post(`http://localhost:3000/tounblind/${mess}`);
    console.log(res.data);

    const blindedSignature = BigInt(res.data.blindedSignature);
    console.log('Blinded Signature:', blindedSignature.toString());

    const unblindedSignature = (blindedSignature * bcu.modInv(blindingFactor, pubKey.n)) % pubKey.n;
    
    console.log('blindindFactor: ' + blindingFactor.toString());
    console.log('Unblinded Signature:', unblindedSignature.toString());
    
    const blindVerified = pubKey.verify(unblindedSignature);
    console.log('Blind Verified:', blindVerified.toString());

    this.unblindedMessage = { unblinded: blindVerified.toString() };
  }

  /*unblind = async () => {
    console.log('Message to unblind ' + this.textToBlind.value.messagetounblind);
    const mess = this.textToBlind.value.messagetounblind;
    console.log(mess);
    
    const blindingFactor = await this.blindingFactorPromise;
    console.log('Blinding Factor:', blindingFactor.toString());

    const Keys = await this.KeysClientPromise;
    const pubKey = Keys.publicKey;
    console.log(pubKey);
    
    const res = await axios.post(`http://localhost:3000/tounblind/${mess}/${pubKey.n}/${pubKey.e}/${blindingFactor}`);
    console.log(res.data);
    const unblindedMessage = res.data.blindVerified;

    console.log('Unblinded Message:', unblindedMessage.toString());
    this.unblindedMessage = { unblinded: unblindedMessage.toString() };

  }*/


}
