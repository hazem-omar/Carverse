import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CarProduct } from './pages/car-product/car-product';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Wishlist } from './pages/wishlist/wishlist';
import { Payment } from './pages/payment/payment';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { CarDetails } from './pages/car-details/car-details';
import { ErrorPage } from './pages/error-page/error-page';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'car/:documentId', component: CarDetails },
  { path: 'products', component: CarProduct },
  { path: 'wishlist', component: Wishlist },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'payment', component: Payment },
  { path: '**', component: ErrorPage },
];
