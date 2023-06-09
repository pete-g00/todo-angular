import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent, PopupProps } from '../popup/popup.component';
import { Store } from '@ngrx/store';
import { TaskTile, TasksState } from '../state/tasks/tasks.reducer';
import { AppTheme } from '../state/theme/theme.reducer';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { updateTheme } from '../state/theme/theme.actions';
import { Subscription } from 'rxjs';
import { getAuth, EmailAuthProvider, Auth, Unsubscribe } from '@angular/fire/auth';
import * as firebaseui from 'firebaseui'
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy { 
  private auth: Auth = inject(Auth);
  constructor(public dialog: MatDialog, private store:Store<{tasks: TasksState, theme: AppTheme}>) {}
  public length = 0;
  public theme:AppTheme = "dark";
  tasksMaxIndexSubscription:Subscription|undefined;
  ui = new firebaseui.auth.AuthUI(getAuth());
  loggedIn = false;
  userId:string|undefined;
  unsubscribeAuthState: Unsubscribe|undefined;
  nextId = "";
  
  ngOnInit(): void {
    this.tasksMaxIndexSubscription = this.store.select("tasks").subscribe(tasks => {
      if (tasks.dataPresent) {
        this.length = tasks.tasks.length;
        const maxId = Number.parseInt(tasks.indices[this.length-1]);
        this.nextId = (maxId+1).toString();
      } else {
        this.length = 0;
      }
    });
    this.unsubscribeAuthState = this.auth.onAuthStateChanged((user) => {
      this.loggedIn = user !== null;
      this.userId = user?.uid;
    });
  }

  openCreateTask() {
    if (this.userId !== undefined) {
      this.dialog.closeAll();
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {
        data: {
          create: true,
          task: {
            description: "",
            due: date,
            title: "",
          },
          i: this.length,
          id: this.nextId,
        }
      });
    }
  }

  updateTheme(e:MatButtonToggleChange) {
    this.theme = e.value;
    this.store.dispatch(updateTheme({theme: e.value}));
  }

  openSignIn(): void {
    this.dialog.closeAll();
    const signInDialog = this.dialog.open(SignInComponent);
    
    const uiConfig:firebaseui.auth.Config = {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      callbacks: {
          signInSuccessWithAuthResult() {
            signInDialog.close();
            return false;
          },
      }
    };
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  handleSignOut() {
    // this returns a promise => check that it has succeeded!
    this.auth.signOut().then(() => {
      console.log("Signed Out");
    }).catch(() => {
      console.log("Failed to sign out");
    });
  }
  
  ngOnDestroy(): void {
    this.tasksMaxIndexSubscription?.unsubscribe();
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
    }
  }
}
