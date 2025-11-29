import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactApiUrl = `${environment.apiUrl}/contact-submissions`;
  private newsletterApiUrl = `${environment.apiUrl}/newsletter-subscriptions`;

  constructor(private http: HttpClient) {}

  submitContactForm(submission: ContactSubmission): Observable<any> {
    return this.http.post(this.contactApiUrl, {
      data: submission
    });
  }

  subscribeNewsletter(email: string): Observable<any> {
    return this.http.post(this.newsletterApiUrl, {
      data: {
        email: email,
        subscribed: true
      }
    });
  }
}

