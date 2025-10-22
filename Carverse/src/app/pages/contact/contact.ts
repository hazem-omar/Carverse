import { Component } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})

export class Contact {
  form: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  public sendEmail() {

    emailjs
      .send('service_x4wiueo', 'template_wstjog1', {...this.form}, {
        publicKey: 'O_zIqaAzvvJnnPhhq',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
