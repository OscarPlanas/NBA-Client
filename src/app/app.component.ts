import { Component } from '@angular/core';
import navOptions from './data/navOptions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  openNav() {
		setTimeout(() => {
		this.navbarOpen = !this.navbarOpen;
		}, 1);
	}
  navOptions = navOptions;
  title = 'client';
  navbarOpen = false;

}
