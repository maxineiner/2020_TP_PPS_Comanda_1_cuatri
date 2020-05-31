import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/classes/book';
import { NgForm } from '@angular/forms'; 
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  book: Book = new Book();
  form: NgForm;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,

  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.book.clientId = this.authService.getCurrentUser().uid;
    this.book.date = new Date(this.book.date).getSeconds();
    console.log(this.book);
    this.loadingService.showLoading("Guardando Reserva...");
    this.loadingService.closeLoading();
  }
}
