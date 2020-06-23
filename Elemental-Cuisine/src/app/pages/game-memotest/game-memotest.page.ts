import { Component, OnInit } from '@angular/core';
import { CurrentAttentionService } from 'src/app/services/currentAttention.service';
import { AuthService } from 'src/app/services/auth.service';
import { Attention } from 'src/app/classes/attention';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-memotest',
  templateUrl: './game-memotest.page.html',
  styleUrls: ['./game-memotest.page.scss'],
})
export class GameMemotestPage implements OnInit {

  private animals: Array<any>;
  private firstElection: number;

  constructor(
    private currentAttentionService: CurrentAttentionService,
    private authService: AuthService,
    private router: Router) {
    var imgUrl = "assets/images/memotest/";
    this.animals = [
      { id: 1, "name": "pez", "url": imgUrl + "pez.png", color: "primary", revealed: false },
      { id: 2, "name": "pez", "url": imgUrl + "pez.png", color: "primary", revealed: false },
      { id: 3, "name": "lobo", "url": imgUrl + "lobo.png", color: "secondary", revealed: false },
      { id: 4, "name": "lobo", "url": imgUrl + "lobo.png", color: "secondary", revealed: false },
      { id: 5, "name": "mono", "url": imgUrl + "mono.png", color: "tertiary", revealed: false },
      { id: 6, "name": "mono", "url": imgUrl + "mono.png", color: "tertiary", revealed: false },
      { id: 7, "name": "perro", "url": imgUrl + "perro.png", color: "success", revealed: false },
      { id: 8, "name": "perro", "url": imgUrl + "perro.png", color: "success", revealed: false },
      { id: 9, "name": "vaca", "url": imgUrl + "vaca.png", color: "warning", revealed: false },
      { id: 10, "name": "vaca", "url": imgUrl + "vaca.png", color: "warning", revealed: false },
      { id: 11, "name": "elefante", "url": imgUrl + "elefante.png", color: "danger", revealed: false },
      { id: 12, "name": "elefante", "url": imgUrl + "elefante.png", color: "danger", revealed: false },
      { id: 13, "name": "leon", "url": imgUrl + "leon.png", color: "light", revealed: false },
      { id: 14, "name": "leon", "url": imgUrl + "leon.png", color: "light", revealed: false },
      { id: 15, "name": "pato", "url": imgUrl + "pato.png", color: "medium", revealed: false },
      { id: 16, "name": "pato", "url": imgUrl + "pato.png", color: "medium", revealed: false },
      { id: 17, "name": "jirafa", "url": imgUrl + "jirafa.png", color: "dark", revealed: false },
      { id: 18, "name": "jirafa", "url": imgUrl + "jirafa.png", color: "dark", revealed: false },
    ];
  }

  ngOnInit() {
    this.animals = this.shuffle(this.animals);
  }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  reveal(id) {
    let animal = this.animals.find(x => x.id == id);
    animal.revealed = true;
    if (this.firstElection) {
      let firstAnimal = this.animals.find(x => x.id == this.firstElection);
      if (animal.name != firstAnimal.name) {
        setTimeout(function () {
          animal.revealed = false;
          firstAnimal.revealed = false;
        }, 1000);
      }
      else {
        this.animals.find(x => x.revealed == false)
        if (!this.animals.find(x => x.revealed == false)) {
          this.gameFinished();
        }
      }
      this.firstElection = null;
    }
    else {
      this.firstElection = animal.id;
    }
  }

  gameFinished() {
    var userId = this.authService.getCurrentUser().uid;
    this.currentAttentionService.getAttentionById(userId).then(resp => {
      let attention = resp.data() as Attention;

      let message = "Descubriste a todos los animales de nuevo!";

      if (!attention.discount) {
        message = 'Descubriste a todos los animales y ganaste un descuento de 10% en tu pedido!';
        attention.discount = true;
        this.currentAttentionService.modifyAttention(userId, attention);
      }

      Swal.fire({
        title: '¡Felicitaciones!',
        text: message,
        type: 'success',
        padding: '3em',
        backdrop: false
      }).then(() => {
        this.router.navigateByUrl('/juegos');
      });
    });
  }
}
