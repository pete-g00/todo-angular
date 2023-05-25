import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { TaskTile } from './../app.component';
import { PopupComponent, PopupProps } from '../popup/popup.component';
import { CompleteTask, IncompleteTask, RemoveTask, UpdateTask } from './../shared/app.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-tile',
  templateUrl: './todo-tile.component.html',
  styleUrls: ['./todo-tile.component.css']
})
export class TodoTileComponent{
  @Input() todo:TaskTile;

  constructor(
    public dialog: MatDialog, 
    private store:Store,
    private snackBar: MatSnackBar
  ) { }
  
  deleteTask() {
    this.snackBar.open("TODO deleted", "Dismiss", {
      duration: 2500
    });
    this.store.dispatch(new RemoveTask(this.todo));
  }

  taskComplete() {
    this.snackBar.open("TODO completed", "Dismiss", {
      duration: 2500
    });
    this.store.dispatch(new CompleteTask(this.todo));
  }
  
  taskIncomplete() {
    this.snackBar.open("TODO reopened", "Dismiss", {
      duration: 2500
    });
    this.store.dispatch(new IncompleteTask(this.todo));
  }

  editTask() {
    const dialogRef = this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {data: {
      create: false,
      task: this.todo
    }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new UpdateTask(this.todo, result));
      }
    });
  }
}
