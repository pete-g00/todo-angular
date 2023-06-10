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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy { 
  private auth: Auth = inject(Auth);
  public length = 0;
  public theme:AppTheme = "dark";
  tasksMaxIndexSubscription:Subscription|undefined;
  ui = new firebaseui.auth.AuthUI(getAuth());
  loggedIn = false;
  userId:string|undefined;
  unsubscribeAuthState: Unsubscribe|undefined;
  nextId = "";
  
  constructor(
    public dialog: MatDialog, 
    private store:Store<{tasks: TasksState, theme: AppTheme}>,
    private snackBar: MatSnackBar) {}
  
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
      const task = {
        description: "",
        due: date,
        title: "",
      };
      
      this.dialog.open<PopupComponent, PopupProps, TaskTile>(PopupComponent, {
        data: {
          create: true,
          task,
          i: this.length,
          id: this.nextId,
        }
      });
    }
  }

  openSignIn(): void {
    this.dialog.closeAll();
    const signInDialog = this.dialog.open(SignInComponent);
    const snackBar = this.snackBar;
    
    const uiConfig:firebaseui.auth.Config = {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      callbacks: {
          signInSuccessWithAuthResult() {
            signInDialog.close();
            snackBar.open("Successfully signed in", "Dismiss", {
              duration: 2500
            });
            return false;
          },
      }
    };
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  handleSignOut() {
    this.auth.signOut().then(() => {
      this.snackBar.open("Signed Out", "Dismiss", {duration: 2500});
    }).catch(() => {
      this.snackBar.open("Failed to Sign Out", "Dismiss", {duration: 2500});
    });
  }
  
  ngOnDestroy(): void {
    this.tasksMaxIndexSubscription?.unsubscribe();
    if (this.unsubscribeAuthState) {
      this.unsubscribeAuthState();
    }
  }
}
