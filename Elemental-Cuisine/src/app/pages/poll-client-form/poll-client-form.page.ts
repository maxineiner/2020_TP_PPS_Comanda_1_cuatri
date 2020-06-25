import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';
import { PollClient } from 'src/app/classes/poll-client';
import { NotificationService } from 'src/app/services/notification.service';
import { PollService } from 'src/app/services/poll.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-poll-client-form',
  templateUrl: './poll-client-form.page.html',
  styleUrls: ['./poll-client-form.page.scss'],
})
export class PollClientFormPage implements OnInit {

  private images: Array<any>;
  private poll: PollClient;
  private checks = [
    { val: 'Las comidas', isChecked: false },
    { val: 'Las bebidas', isChecked: false },
    { val: 'El ambiente', isChecked: false },
    { val: 'La atención', isChecked: false }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cameraService: CameraService,
    private pollService: PollService,
    private notificationService: NotificationService,
    private router: Router) {
    this.images = new Array<object>();
    this.poll = new PollClient();

    //para pruebitas con una pic
    // this.loadPhoto("J7h2jsgymwXXj5WH4Ov1c0B7bUc2-1593032249075");
  }

  ngOnInit() {
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      let currentUser = Object.assign(new User, userData.data());
      this.poll.userId = currentUser.id;
      this.poll.userName = currentUser.name + " " + currentUser.surname;
    })
  }

  async takePhoto() {
    if (this.images.length < 3) {
      let imgName = `${this.poll.userId}-${Date.now()}`;
      await this.cameraService.takePhoto('encuestas', imgName);
      this.loadPhoto(imgName);
    }
    else {
      this.notificationService.presentToast("Solo se pueden subir 3 fotos.", "danger", "middle");
    }
  }

  async loadPhoto(imgName) {
    let imgUrl = await this.cameraService.getImageByName('encuestas', imgName);
    this.images.push({ "url": imgUrl, "name": imgName });
  }

  deletePhoto(imgName) {
    this.cameraService.deleteImage('encuestas', imgName).then(
      resp => {
        this.images = this.images.filter(x => x.name != imgName);
      },
      err => {
        this.notificationService.presentToast("Error al eliminar la foto.", "danger", "bottom");
      })
  }

  finalicePoll() {
    this.poll.photos = this.images.map(x => x.name);
    this.poll.toImprove = this.checks.filter(x => x.isChecked).map(x => x.val);

    this.pollService.savePoll(this.poll).then(poll => {
      this.notificationService.presentToast("Encuesta realizada correctamente!", "success", "middle");
      this.router.navigateByUrl('/encuestas');
    });
  }
}
