import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Collections } from '../classes/enums/collections';

@Injectable({
  providedIn: 'root'
})
export class CurrentAttentionService {

  private currentAttentionCollection = Collections.CurrentAttention;

  constructor(
    private dataService: DataService
  ) { }

  getAttentionById(attentionId) {
    return this.dataService.getOne(this.currentAttentionCollection, attentionId);
  }

  getAllAttentions() {
    return this.dataService.getAll(this.currentAttentionCollection);
  }

  saveAttention(id, attention) {
    return this.dataService.setData(this.currentAttentionCollection, attention, id);
  }

  deleteAttention(attentionId) {
    this.dataService.deleteDocument(this.currentAttentionCollection, attentionId);
  }

  modifyAttention(id, attention) {
    return this.dataService.update(this.currentAttentionCollection, id, attention);
  }
}