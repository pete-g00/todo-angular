import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TaskTile, TasksState } from '../state/tasks/tasks.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PopupComponent, PopupProps } from '../popup/popup.component';
import { deleteTaskFromDB, removeTask, uploadTaskToDB } from '../state/tasks/tasks.actions';

@Component({
  selector: 'app-todo-tile',
  templateUrl: './todo-tile.component.html',
  styleUrls: []
})
export class TodoTileComponent implements OnInit {
  @Input() todo!: TaskTile;
  @Input() i!: number;
  deletingTask = false;

  constructor(public dialog: MatDialog, private store:Store<{tasks: TasksState}>, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.store.select("tasks").subscribe((state) => {
      if (this.deletingTask && state.deleteSuccess?.i == this.i) {
        if (state.deleteSuccess.success) {
          this.onTaskDeleted();
        } else {
          console.log("Failed to delete the task");
        }
      } 
    });
  }

  getDueTime(date: Date): number {
    const diffSecs = date.getTime() - new Date().getTime();
    var diffDays = Math.ceil(diffSecs/(1000 * 3600 * 24)); 

    return diffDays;
  }
  
  deleteTask() {
    console.log("Dispatching delete task");
    this.store.dispatch(deleteTaskFromDB({i: this.i}));
    this.deletingTask = true;
  }

  onTaskDeleted() {
    this.snackBar.open("TODO deleted", "Dismiss", {
      duration: 2500
    });
    
    this.store.dispatch(removeTask({i: this.i}));
    this.deletingTask = false;
  }

  editTask() {
    console.log("Editing task");
    this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {data: {
      create: false,
      task: this.todo,
      i: this.i
    }});
  }
}
