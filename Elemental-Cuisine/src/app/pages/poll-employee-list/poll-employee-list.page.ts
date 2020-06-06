import { Component, OnInit } from '@angular/core';
import { Poll } from 'src/app/classes/poll';
import { PollService } from 'src/app/services/poll.service';
import { Collections } from 'src/app/classes/enums/collections';


@Component({
  selector: 'app-poll-employee-list',
  templateUrl: './poll-employee-list.page.html',
  styleUrls: ['./poll-employee-list.page.scss'],
})
export class PollEmployeeListPage implements OnInit {
  private polls: Array<Poll>;

  constructor(private pollService: PollService) { 

    this.pollService.getAllPolls(Collections.EmployeePolls).subscribe(polls => {
      this.polls = polls.map(poll => poll.payload.doc.data() as Poll);
    });

  }

  ngOnInit() {
  }

  deletePoll(poll){
    this.pollService.deletePoll(Collections.EmployeePolls ,poll.id);
  }

  modifyPoll(poll){
    
  }

}
