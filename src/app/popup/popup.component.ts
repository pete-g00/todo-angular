import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { TaskTile, TasksState } from '../state/tasks/tasks.reducer';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { updateTask, uploadTaskToDB, 
  // uploadTaskToDB
 } from '../state/tasks/tasks.actions';

export interface PopupProps {
  task: TaskTile;
  create: boolean;
  i: number;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: []
})
export class PopupComponent implements OnInit {
  form:FormGroup;
  dataUploaded = false;
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
    this.store.select("tasks").subscribe(state => {
      if (this.dataUploaded && state.updateSuccess?.i === this.data.i) {
        if (state.updateSuccess.success) {
          this.dataUploaded = false;
          this.store.dispatch(updateTask({newValue: this.form.value, i: this.data.i}));
          this.dialogRef.close(this.form.value);
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
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.store.dispatch(uploadTaskToDB({task: this.form.value, i: this.data.i}));
      this.dataUploaded = true;
    } 
  }
}
