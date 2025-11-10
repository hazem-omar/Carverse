import { Component } from '@angular/core';
import { Cover } from '../cover/cover';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Featured } from '../featured/featured';
@Component({
  selector: 'app-home',
  imports: [Cover,About,Contact,Featured],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
