import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(
    private dataService: DataService
  ) { }

  savePoll(collection, poll){
    return this.dataService.add(collection, poll);
  }

  getAllPolls(collection){
    return this.dataService.getAll(collection);
  }

  deletePoll(collection, pollId){
    this.dataService.deleteDocument(collection, pollId);
  }

  getPollById(collection, pollId){
    return this.dataService.getOne(collection, pollId);
  }

}
