import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RsaKeys {
  publicKey: {
    e: string;
    n: string;
  };
  privateKey: {
    d: string;
    n: string;
  };
}

@Component({
  selector: 'app-generarclaus',
  templateUrl: './generarclaus.component.html',
  styleUrls: ['./generarclaus.component.css']
})
export class GenerarclausComponent {
  rsaKeys: RsaKeys | undefined;

  constructor(private http: HttpClient) {}

  onGenerarclaus() {
    console.log('Generating RSA keys...');
    this.http.get<RsaKeys>('http://localhost:3000/generate-rsa-keys').subscribe(
      (data) => {
        console.log('RSA keys generated:');
        console.log('Public key:', data.publicKey);
        console.log('Private key:', data.privateKey);
        this.rsaKeys = data;
      },
      (error) => {
        console.error('Error generating RSA keys:', error);
      }
    );
  }
}