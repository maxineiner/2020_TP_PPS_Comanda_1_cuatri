import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private type: string;
  idObject: string = "";

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.idObject = this.activatedRoute.snapshot.paramMap.get('id');
  }
}
