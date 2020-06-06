import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/classes/poll';
import { PollService } from 'src/app/services/poll.service';
import { Collections } from 'src/app/classes/enums/collections';

@Component({
  selector: 'app-poll-client-list',
  templateUrl: './poll-client-list.page.html',
  styleUrls: ['./poll-client-list.page.scss'],
})
export class PollClientListPage implements OnInit {
  
  private polls: Array<Poll>;

  constructor(
    private pollService: PollService) { 
    this.pollService.getAllPolls(Collections.ClientPolls).subscribe(polls => {
      this.polls = polls.map(poll => poll.payload.doc.data() as Poll);
    });
  }

  ngOnInit() {
  }

  deletePoll(poll){
    this.pollService.deletePoll(Collections.ClientPolls, poll.id);
  }

  modifyPoll(poll){
    
  }

}
