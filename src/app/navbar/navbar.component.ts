import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, PopupProps } from '../popup/popup.component';
import { TaskTile } from '../app.component';
import { Store } from '@ngxs/store';
import { AddTask } from './../shared/app.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent { 
  constructor(public dialog: MatDialog, private store:Store) {}
  
  openDialog() {
    const dialogRef = this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {data: {
        create: true,
        task: {description: "",
        duration: 1,
        isCompleted: false,
        left: 1,
        title: ""
      }
    }});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new AddTask(result));
      }
    });
  }
}
