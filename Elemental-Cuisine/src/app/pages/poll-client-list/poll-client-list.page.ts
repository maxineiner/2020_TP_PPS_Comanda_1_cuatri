import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/classes/poll';
import { PollService } from 'src/app/services/poll.service';

@Component({
  selector: 'app-poll-client-list',
  templateUrl: './poll-client-list.page.html',
  styleUrls: ['./poll-client-list.page.scss'],
})
export class PollClientListPage implements OnInit {
  private polls: Array<Poll>;

  constructor(
    private pollService: PollService) { 
    this.pollService.getAllPollsClient('encuestas_clientes').subscribe(polls => {
      this.polls = new Array<Poll>();
      console.log(this.polls);
      polls.forEach(document => {
        const poll = document.payload.doc.data() as Poll;
        poll.id = document.payload.doc.id;
        this.polls.push(poll); 
      })
    });
    console.log(this.polls);
  }

  ngOnInit() {
  }

  deletePoll(poll){
    this.pollService.deletePollClient(poll.id);
  }

  modifyPoll(poll){
    
  }

}
