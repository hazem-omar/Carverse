import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './pages/home/home';
import { Cover } from './pages/cover/cover';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Payment } from './pages/payment/payment';
import { Wishlist } from './pages/wishlist/wishlist';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Featured } from './pages/featured/featured';
import { CarProduct } from './pages/car-product/car-product';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Cart } from './pages/cart/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer,About,CarProduct,Cart,Contact,Home,Login,Payment,Register,Wishlist,Cover,Featured],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Carverse');
}
