import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(
    private dataService: DataService
  ) { }

  savePollEmployee(poll){
    return this.dataService.add('encuestas_empleados', poll);
  }
  savePollClient(poll){
    return this.dataService.add('encuestas_clientes', poll);
  }


  getAllPollsEmployee(collection){
    return this.dataService.getAll(collection);
  }
  getAllPollsClient(collection){
    return this.dataService.getAll(collection);
  }


  deletePollEmployee(pollId){
    this.dataService.deleteDocument('encuestas_empleados', pollId);
  }
  deletePollClient(pollId){
    this.dataService.deleteDocument('encuestas_clientes', pollId);
  }


  getPollEmployeeById(pollId){
    return this.dataService.getOne('encuestas_empleados', pollId);
  }
  getPollClientById(pollId){
    return this.dataService.getOne('encuestas_clientes', pollId);
  }
}
