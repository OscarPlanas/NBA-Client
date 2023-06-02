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
import * as paillierBigint from 'paillier-bigint';
import { get } from 'mongoose';
import { MyPaillierPublicKey } from 'src/app/models/paillierPubKey';

interface PaillierMessage {
  paillier: string;
}

interface UnpaillierMessage {
  unpaillier: string;
}

@Component({
  selector: 'app-paillier',
  templateUrl: './paillier.component.html',
  styleUrls: ['./paillier.component.css']
})
export class PaillierComponent implements OnInit {
  textToPaillier: FormGroup;
  paillierMessage?: PaillierMessage;
  
  unpaillierMessage?: UnpaillierMessage;
  
  
  pubKeyPaillierServerPromise: Promise<MyPaillierPublicKey>
 
  messagetopaillier1?: bigint;
  messagetopaillier2?: bigint;
  messagetounpaillier?: bigint;
  
  constructor(private formBuilder: FormBuilder) {
    this.textToPaillier = this.formBuilder.group({});
    this.pubKeyPaillierServerPromise = this.getPaillierPubliKey();
    //this.pubKeyServerPromise = this.getPublicKeys();
   }

  ngOnInit(): void {
    this.textToPaillier = this.formBuilder.group({
      messagetopaillier1: [''],
      messagetopaillier2: [''],
      messagetounpaillier: ['']
    });
  }

  /*server genera claves y la pública la pasa al cliente*/
  getPaillierPubliKey = async (): Promise<MyPaillierPublicKey> => {
    const res = await axios.get('http://localhost:3000/publicKeyPallier')
    console.log(res.data);
    const pubKey = MyPaillierPublicKey.fromJSON(res.data)
    console.log(pubKey);
    return pubKey;
    
    
   // return pubKey;
  }
  
  /*El cliente coge dos mensajes y los pasa al server, el cliente 
  los encripta con las claves generadas por el server, devuelve los mensajes sumados y multiplicado encriptados
  */
  messageToPaillier = async () => {
    console.log('Paillier message1:', this.textToPaillier.value.messagetopaillier1);
    console.log('Paillier message2:', this.textToPaillier.value.messagetopaillier2);
    const mess1 = BigInt(this.textToPaillier.value.messagetopaillier1);
    const mess2 = BigInt(this.textToPaillier.value.messagetopaillier2);
    console.log(mess1);
    console.log(mess2);
    
    const paillierPubKey = await this.pubKeyPaillierServerPromise;
    console.log(paillierPubKey);
    console.log(paillierPubKey.n);
    console.log(paillierPubKey.g);
    
    const c1 = paillierPubKey.encrypt(mess1);
    console.log("Ciphertext 1: " + c1);
    const c2 = paillierPubKey.encrypt(mess2);
    console.log("Ciphertext 2: " + c2);


    const encryptedSum = paillierPubKey.addition(c1, c2);
    console.log("Encrypted sum: " + encryptedSum);
    
    //const k = 10n;
    //const encryptedMul = paillierPubKey.multiply(c1, k);
    //console.log("Encrypted multiplication: " + encryptedMul);
    
    this.paillierMessage = { paillier: encryptedSum.toString() };
 
  }
  

  /*cliente envia el mensaje encriptado, el server desencripta y devuelve el mensaje desencriptado*/
  messageToUnpaillier = async () => {
    console.log('Unpaillier message:', this.textToPaillier.value.messagetounpaillier);
    const mess = this.textToPaillier.value.messagetounpaillier;


    const res = await axios.post(`http://localhost:3000/messageToUnpaillier/${mess}`)
    console.log(res.data.messagefinal);

    this.unpaillierMessage = { unpaillier: res.data.messagefinal.toString() };
    
  }
}
