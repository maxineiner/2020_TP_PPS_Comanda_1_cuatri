import { EmailTemplate } from './../classes/emailTemplate';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collections } from '../classes/enums/collections';
import { Observable } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {


  private emailTemplatesCollection = Collections.EmailTemplates;
  private email: EmailTemplate;

  constructor(private http: HttpClient,
    private dataService: DataService) {
  }

  sendAprovalEmail(destinationEmailAddress: string) {

    this.getEmailTemplateById('YeYzySy0pkZSOhC5scsb').then(emailTemplate => {
      this.email = Object.assign(new EmailTemplate, emailTemplate.data());

      let auxEmail =
      {
        "to": destinationEmailAddress,
        "subject": this.email.subject,
        "html": this.email.html
      }

      this.http.post<any>('https://us-central1-elementales-4394b.cloudfunctions.net/mailer', auxEmail).subscribe(data => {
        console.log(data);
      })
    });
  }


  getEmailTemplateById(emailTemplateId) {
    return this.dataService.getOne(this.emailTemplatesCollection, emailTemplateId);
  }


}