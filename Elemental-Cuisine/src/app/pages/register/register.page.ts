import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private type: string;
  private title: string;
  idObject: string = "";

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.idObject = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.idObject != null) {
      this.title = "Modificación de " + this.type;
    }
    else {
      this.title = "Registro de " + this.type;
    }
  }
}
