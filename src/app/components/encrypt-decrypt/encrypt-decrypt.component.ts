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
  
  message?: bigint;
  messagetodecrypt?: bigint;

  encryptedMessage?: EncryptedMessage;
  decryptedMessage?: DecryptedMessage;

  constructor(private formBuilder: FormBuilder) {
    this.textToEncrypt = this.formBuilder.group({});

  }
  ngOnInit(): void {
    this.textToEncrypt = this.formBuilder.group({
      message: [''],
      messagetodecrypt: ['']
    });
    console.log("hola");

  }

 



}





