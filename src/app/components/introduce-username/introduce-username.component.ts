import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { SharedService } from 'src/app/data/hash';

interface Message {
  message: string;
}

@Component({
  selector: 'app-introduce-username',
  templateUrl: './introduce-username.component.html',
  styleUrls: ['./introduce-username.component.css']
})
export class IntroduceUsernameComponent implements OnInit {
  introduceUsername: FormGroup;
  responseData?: Message;

  constructor(private formBuilder: FormBuilder, private router: Router, private sharedService: SharedService) {
    this.introduceUsername = this.formBuilder.group({});

  }

  ngOnInit(): void {
    this.introduceUsername = this.formBuilder.group({
      username: [''],
    });
    console.log("IntroduceUsename");
  }

  createAnonimousUser = async () => {
    console.log('Creating anonimous user: ', this.introduceUsername.value.username);
    const mess = this.introduceUsername.value.username;
    const res = await axios.post(`http://localhost:5432/api/users/createAnonymousIdentity/${mess}`)
    console.log(res.data);

    if (res.data == 'User does not exist') {
      this.responseData = { message: res.data.toString() };

    } else if (res.data == 'User has already voted') {
      this.responseData = { message: res.data.toString() };
    } else if (res.data.status == 'AnonymousIdentity saved') {

      this.responseData = { message: res.data.status.toString() };
      this.sharedService.hash = res.data.useranonymousid['anonymousid'];
      this.router.navigate(['/voting-page']);
    }

  }
}
