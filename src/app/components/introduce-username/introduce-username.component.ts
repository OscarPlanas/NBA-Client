import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import axios from 'axios';
import * as bc from 'bigint-conversion';
import { MyRsaPublicKey } from 'src/app/models/publickey';

@Component({
  selector: 'app-introduce-username',
  templateUrl: './introduce-username.component.html',
  styleUrls: ['./introduce-username.component.css']
})
export class IntroduceUsernameComponent implements OnInit {
  introduceUsername: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.introduceUsername = this.formBuilder.group({});

  }

  ngOnInit(): void {
    this.introduceUsername = this.formBuilder.group({
      username: [''],
    });
    console.log("IntroduceUsename");
  }

}
