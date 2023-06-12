import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/data/hash';
import { getLocaleCurrencySymbol } from '@angular/common';

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
    //this.responseData = { message: res.data.toString()}
    
    if (res.data == 'User does not exist') {
      console.log('User does not exist');
      this.responseData = { message: res.data.toString()};

    } else if (res.data == 'User has already voted') {
      console.log("User already exists");
      this.responseData = { message: res.data.toString()};
    } else if (res.data.status == 'AnonymousIdentity saved'){

      console.log(res.data.status);
      this.responseData = { message: res.data.status.toString()};
      this.sharedService.hash = res.data.useranonymousid['anonymousid'];
      console.log(this.sharedService.hash);
      console.log(res.data.useranonymousid['anonymousid']);
      this.router.navigate(['/voting-page']);
    }
    // Realizar la redirección al componente "voting-page"
    
  }  
}
