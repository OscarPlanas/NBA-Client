import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import axios from 'axios';

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
  message?: Message;

  constructor(private formBuilder: FormBuilder) { 
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
    if (res.data.status == 202) {
      console.log("User does not exist");
      this.message = res.data;

    } else if (res.data.status == 201) {
      console.log("User already exists");
      this.message = res.data;
    } else {

      console.log(res.data.status);
      this.message = res.data.status;
    }
  }  

}
