import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/classes/poll';
import { PollService } from 'src/app/services/poll.service';


@Component({
  selector: 'app-poll-employee-list',
  templateUrl: './poll-employee-list.page.html',
  styleUrls: ['./poll-employee-list.page.scss'],
})
export class PollEmployeeListPage implements OnInit {
  private polls: Array<Poll>;

  constructor(private pollService: PollService) { 

    this.pollService.getAllPollsEmployee('encuestas_empleados').subscribe(polls => {
      this.polls = polls.map(poll => poll.payload.doc.data() as Poll);
    });

  }

  ngOnInit() {
  }

  deletePoll(poll){
    this.pollService.deletePollEmployee(poll.id);
  }

  modifyPoll(poll){
    
  }

}
