import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { TaskTile } from '../app.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PopupProps {
  task: TaskTile;
  create: boolean;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  form:FormGroup;
  constructor(
      public dialogRef: MatDialogRef<NavbarComponent, TaskTile>,
      @Inject(MAT_DIALOG_DATA) public data: PopupProps,
      private formBuilder:FormBuilder,
      private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    const todo = this.data.task;
    this.form = this.formBuilder.group({
      title: [todo.title, Validators.required],
      description: [todo.description, Validators.required],
      duration: [todo.duration],
      left: [todo.left],
      isCompleted: [todo.isCompleted],
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      if (this.data.create) {
        this.snackBar.open("New TODO created!", "Dismiss", {
          duration: 2500
        });
      } else {
        this.snackBar.open("TODO updated!", "Dismiss", {
          duration: 2500
        });
      }
    } 
  }
}
