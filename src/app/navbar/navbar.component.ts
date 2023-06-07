import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, PopupProps } from '../popup/popup.component';
import { Store } from '@ngrx/store';
import { TaskTile, TasksState } from '../state/tasks/tasks.reducer';
import { AppTheme } from '../state/theme/theme.reducer';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { updateTheme } from '../state/theme/theme.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit { 
  constructor(public dialog: MatDialog, private store:Store<{tasks: TasksState, theme: AppTheme}>) {}
  public length = 0;
  public theme:AppTheme = "dark";
 
  ngOnInit(): void {
    this.store.select("tasks").subscribe(tasks => {
      if (tasks.dataPresent) {
        this.length = tasks.tasks.length;
      }
    })
  }

  openDialog() {
    this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {data: {
        create: true,
        task: {
          description: "",
          due: new Date(),
          title: "",
        },
        i: this.length
      }
    });
  }

  updateTheme(e:MatButtonToggleChange) {
    this.theme = e.value;
    this.store.dispatch(updateTheme({theme: e.value}));
  }
}
