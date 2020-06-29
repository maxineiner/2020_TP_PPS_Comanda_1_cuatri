import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { PollClient } from 'src/app/classes/poll-client';
import { AuthService } from 'src/app/services/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LoadingService } from 'src/app/services/loading.service';
import { isNullOrUndefined } from 'util';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';
import { Profiles } from 'src/app/classes/enums/profiles';
import { Status } from 'src/app/classes/enums/Status';

@Component({
  selector: 'app-poll-client-list',
  templateUrl: './poll-client-list.page.html',
  styleUrls: ['./poll-client-list.page.scss'],
})
export class PollClientListPage implements OnInit {

  currentUser: User;
  private polls: Array<PollClient>;
  private gotPoll: boolean;
  Profiles = Profiles;
  Status = Status;

  constructor(
    private router: Router,
    private pollService: PollService,
    private cameraService: CameraService,
    private userService: UserService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.polls = new Array<PollClient>();

    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUserById(user.uid).then(userData => {
      this.currentUser = Object.assign(new User, userData.data());
    })

    this.pollService.getAllPolls().subscribe(polls => {
      this.loadingService.showLoading().then(() => {
        this.polls = polls.map(pollAux => {
          let poll = pollAux.payload.doc.data() as PollClient;
          this.loadPhotos(poll.photos).then(photos => poll.photos = photos);
          return poll;
        });

        if (this.currentUser.profile != Profiles.Owner) {
          let userId = this.currentUser.id;

          if (this.polls.find(x => x.userId == userId)) {
            this.gotPoll = true;
            let pollAux = this.polls.find(x => x.userId == userId);
            this.polls = this.polls.filter(x => x.userId !== userId);
            this.polls.unshift(pollAux);
          }
        }
      }).then(() => {
        this.loadingService.closeLoading();
      });
    });
  }

  ngOnInit() {
  }

  async loadPhotos(photos) {
    let photosUrl = new Array<string>();

    photos.forEach(async photo => {
      let imgUrl = await this.cameraService.getImageByName('encuestas', photo);
      photosUrl.push(imgUrl);
    });

    return photosUrl;
  }

  doPoll() {
    if (this.gotPoll) {
      this.notificationService.presentToast("Solo se puede realizar una encuesta!", "danger", "middle");
      return;
    }

    this.router.navigateByUrl('/encuestas/cliente');
  }
}
