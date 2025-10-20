import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CarProduct } from './pages/car-product/car-product';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Wishlist } from './pages/wishlist/wishlist';
import { Payment } from './pages/payment/payment';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: CarProduct },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'car/:id', component: CarProduct },
  { path: 'wishlist', component: Wishlist },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'payment', component: Payment },
  { path: '**', redirectTo: '' }, // fallback
];
