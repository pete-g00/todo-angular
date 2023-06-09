import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { TaskTile, TasksState } from '../state/tasks/tasks.reducer';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { updateTask, uploadTaskToDB } from '../state/tasks/tasks.actions';
import { Subscription } from 'rxjs';
import { Auth, Unsubscribe } from '@angular/fire/auth';

export interface PopupProps {
  task: TaskTile;
  create: boolean;
  i: number;
  id: string;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: []
})
export class PopupComponent implements OnInit, OnDestroy {
  form:FormGroup;
  dataUploaded = false;
  successSubscription:Subscription|undefined;
  userId: string|undefined;
  auth: Auth = inject(Auth);
  unsubscribeAuthState: Unsubscribe|undefined;

  constructor(
      public dialogRef: MatDialogRef<NavbarComponent, TaskTile>,
      @Inject(MAT_DIALOG_DATA) public data: PopupProps,
      private formBuilder:FormBuilder,
      private snackBar: MatSnackBar,
      private store:Store<{tasks: TasksState}>
    ) {
      const todo = this.data.task;
      this.form = this.formBuilder.group({
        title: [todo.title, Validators.required],
        description: [todo.description, Validators.required],
        due: [todo.due, Validators.required],
      });
    }

  ngOnInit(): void {
    this.successSubscription = this.store.select("tasks").subscribe(state => {
      if (this.dataUploaded && state.updateSuccess !== undefined) {
        if (state.updateSuccess === true) {
          console.log("Dispatching update task");
          this.dataUploaded = false;
          this.store.dispatch(updateTask({newValue: this.form.value, id: this.data.id, i: this.data.i}));
          this.dialogRef.close();
          let message: string;
          if (this.data.create) {
            message = "New TODO created!";
          } else {
            message = "TODO updated!";
          }
          this.snackBar.open(message, "Dismiss", {duration: 2500});
        } else {
          console.log("Error uploading data! Try Again.");
        }
      }
    });
    this.unsubscribeAuthState = this.auth.onAuthStateChanged((user) => {
      this.userId = user?.uid;
    });
  }

  save() {
    if (this.userId !== undefined) {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        this.store.dispatch(uploadTaskToDB({task: this.form.value, id: this.data.id, userId: this.userId}));
        this.dataUploaded = true;
      }
    } 
  }

  ngOnDestroy(): void {
    this.successSubscription?.unsubscribe();
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
    }
  }
}
