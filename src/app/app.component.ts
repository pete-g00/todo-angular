import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { TaskTile, TaskTiles, TasksState } from './state/tasks/tasks.reducer';
import { loadTasksFromDB, updateTask } from './state/tasks/tasks.actions';
import { AppTheme } from './state/theme/theme.reducer';
import { Subscription } from 'rxjs';
import { Auth, Unsubscribe, User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  tasks: TaskTiles = [];
  indices: string[] = [];
  dataLoading = true;
  errorLoadingData = false;
  taskSubscription: Subscription|undefined;
  themeSubscription: Subscription|undefined;
  unsubscribeAuthState: Unsubscribe|undefined;
  user:User|null = null;
  toInt = Number.parseInt;

  constructor(private store:Store<{tasks: TasksState; theme: AppTheme;}>) { }

  public ngOnInit(): void {
    this.unsubscribeAuthState = this.auth.onAuthStateChanged(user => {
      this.user = user;
      if (user === null) {
        this.dataLoading = false;
        this.tasks = [];
        this.indices = [];
      } else {
        this.store.dispatch(loadTasksFromDB({userId: user.uid}));
      }
    });
    this.taskSubscription = this.store.select("tasks").subscribe(state => {
      this.errorLoadingData = false;
      if (this.user !== null) {
        if (state.errorLoadingData) {
          this.errorLoadingData = true;
        } else if (state.dataPresent) {
          this.dataLoading = false;
          this.tasks = state.tasks;
          this.indices = state.indices;
        }
      } 
    });
    this.themeSubscription = this.store.select("theme").subscribe(theme => {
      if (theme === "light") {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
    })
  }

  ngOnDestroy() {
    this.taskSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
    }
  }
}
