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
      this.polls = polls.map(poll => poll.payload.doc.data() as Poll);
    });
  }

  ngOnInit() {
  }

  deletePoll(poll){
    this.pollService.deletePollClient(poll.id);
  }

  modifyPoll(poll){
    
  }

}
