import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { PollClient } from '../classes/poll-client';
import { Collections } from '../classes/enums/collections';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private pollCollection = Collections.ClientPoll;

  constructor(
    private dataService: DataService
  ) { }

  getProduct(pollId) {
    return this.dataService.getOne(this.pollCollection, pollId);
  }

  savePoll(poll: PollClient) {
    return this.dataService.add(this.pollCollection, poll);
  }

  getAllPolls() {
    return this.dataService.getAll(this.pollCollection);
  }

  modifyPoll(pollId, poll: PollClient) {
    return this.dataService.update(this.pollCollection, pollId, poll);
  }

  deletePoll(pollId) {
    this.dataService.deleteDocument(this.pollCollection, pollId);
  }
}
