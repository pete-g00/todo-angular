import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TaskTile, TasksState } from './state/tasks/tasks.reducer';
import { loadTasksFromDB } from './state/tasks/tasks.actions';
import { AppTheme } from './state/theme/theme.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  tasks:TaskTile[] = [];
  dataLoading = true;

  constructor(private store:Store<{tasks: TasksState; theme: AppTheme;}>) { }

  public ngOnInit(): void {
    this.store.select("tasks").subscribe(state => {
      if (!state.loadingData && !state.dataPresent) {
        this.store.dispatch(loadTasksFromDB());
      } else if (state.errorLoadingData) {
        console.log("Failed to load the tasks");
      } else {
        this.dataLoading = false;
        this.tasks = state.tasks;
      }
    });
    this.store.select("theme").subscribe(theme => {
      if (theme === "light") {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
    })
  }
}
