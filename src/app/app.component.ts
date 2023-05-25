import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppModel, AppState } from './shared/app.state';
import { Observable } from 'rxjs';

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
  @Select(AppState) tasks$: Observable<AppModel>;
  tasks:TaskTile[] = [];

  ngOnInit() {
    this.tasks$.subscribe(tasks => {
      this.tasks = tasks.data;
    });
  }
}
