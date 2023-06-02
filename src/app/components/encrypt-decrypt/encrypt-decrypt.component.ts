import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import axios from 'axios';
import * as bc from 'bigint-conversion';
import { MyRsaPublicKey } from 'src/app/models/publickey';

interface EncryptedMessage {
  encrypted2: string;
}
interface DecryptedMessage {
  decrypted: string;
}


@Component({
  selector: 'app-encrypt-decrypt',
  templateUrl: './encrypt-decrypt.component.html',
  styleUrls: ['./encrypt-decrypt.component.css']
})
export class EncryptDecryptComponent implements OnInit {
  textToEncrypt: FormGroup;
  
  pubKeyServerPromise: Promise<MyRsaPublicKey>
  message?: bigint;
  messagetodecrypt?: bigint;

  encryptedMessage?: EncryptedMessage;
  decryptedMessage?: DecryptedMessage;

  constructor(private formBuilder: FormBuilder) {
    this.textToEncrypt = this.formBuilder.group({});
    this.pubKeyServerPromise = this.getPublicKeys();

  }
  ngOnInit(): void {
    this.textToEncrypt = this.formBuilder.group({
      message: [''],
      messagetodecrypt: ['']
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

  async encryptMessage() {
    console.log('Encrypting message:', this.textToEncrypt.value.message);
    const message2 = BigInt(this.textToEncrypt.value.message);
    const pubKey = await this.pubKeyServerPromise
    const encrypted = pubKey.encrypt(message2);
    console.log(encrypted);
    const encrypted2 = bc.bigintToBase64(encrypted);
    this.encryptedMessage = { encrypted2 };
    console.log("en base 64 " + encrypted2);
    console.log("en base 64 otro " + this.encryptedMessage.encrypted2);

  }

  decryptMessage = async () => {
    console.log('Decrypting message:', this.textToEncrypt.value.messagetodecrypt);
    var mess = bc.base64ToBigint(this.textToEncrypt.value.messagetodecrypt);
    console.log(mess);


    const res = await axios.post(`http://localhost:3000/todecrypt/${mess}`)
    console.log(res.data['decrypted']);
    const decrypted = res.data['decrypted'];
    console.log("decrypted: " + decrypted);
    this.decryptedMessage = { decrypted };
  }

}





