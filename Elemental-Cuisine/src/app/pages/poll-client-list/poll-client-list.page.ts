import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import { PollClient } from 'src/app/classes/poll-client';
import { AuthService } from 'src/app/services/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-poll-client-list',
  templateUrl: './poll-client-list.page.html',
  styleUrls: ['./poll-client-list.page.scss'],
})
export class PollClientListPage implements OnInit {

  private polls: Array<PollClient>;
  private gotPoll: boolean;

  constructor(
    private router: Router,
    private pollService: PollService,
    private cameraService: CameraService,    
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.polls = new Array<PollClient>();
  }

  ngOnInit() {
    this.pollService.getAllPolls().subscribe(polls => {

      this.polls = polls.map(pollAux => {
        let poll = pollAux.payload.doc.data() as PollClient;
        this.loadPhotos(poll.photos).then(photos => poll.photos = photos);
        return poll;
      });

      let userId = this.authService.getCurrentUser().uid;

      if (this.polls.find(x => x.userId == userId)) {
        this.gotPoll = true;
        let pollAux = this.polls.find(x => x.userId == userId);
        this.polls = this.polls.filter(x => x.userId !== userId);
        this.polls.unshift(pollAux);
      }
    });
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
