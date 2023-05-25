import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppModel, AppState } from './shared/app.state';
import { ChangeFilter, Filter } from './shared/app.actions';

// A task tile
export interface TaskTile {
  // the title of the task
  title: string;

  // the description of the task
  description: string;

  // the time it should take to complete the task
  duration: number;

  // the number of days left to complete the task
  left: number;

  // whether the task has been completed
  isCompleted: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks:TaskTile[] = [];
  filter:Filter = Filter.ALL;

  constructor(public store:Store) {}

  ngOnInit() {
    this.store.select<AppModel>(AppState).subscribe(tasks => {
      this.tasks = tasks.data.filter(value => {
        if (tasks.filter == Filter.ALL) {
          return true;
        } 
        return tasks.filter == Filter.ONLY_COMPLETE ? value.isCompleted : !value.isCompleted;
      });
    });
  }

  selectFilter(filter:Filter) {
    this.filter = filter;
    this.store.dispatch(new ChangeFilter(filter));
  }
}
