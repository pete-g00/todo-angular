import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { deleteTaskFromDB, deleteTaskFromDBFailure, deleteTaskFromDBSuccess, loadTasksFromDB, loadTasksFromDBFailure, loadTasksFromDBSuccess, uploadTaskToDB, uploadTaskToDBFailure, uploadTaskToDBSuccess } from "./tasks.actions";
import { from, of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";
import { TodoService } from "src/app/task.service";

@Injectable()
export class TaskEffects {
    constructor(private actions$: Actions, private taskService: TodoService) {}

    loadTasks$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadTasksFromDB),
            switchMap(() => 
                from(this.taskService.getTasks()).pipe(
                    map(tasks => loadTasksFromDBSuccess({ tasks })),
                    catchError(() => of(loadTasksFromDBFailure()))
                )
            )
        )
    );

    updateTask$ = createEffect(() => 
        this.actions$.pipe(
            ofType(uploadTaskToDB),
            switchMap(({ task, i }) => {
                return from(this.taskService.uploadTask(task, i)).pipe(
                    map(() => uploadTaskToDBSuccess({ i })),
                    catchError(() => of(uploadTaskToDBFailure({ i })))
                )
            })
        )
    );

    deleteTask$ = createEffect(() => 
        this.actions$.pipe(
            ofType(deleteTaskFromDB),
            switchMap(({ i}) => {
                return from(this.taskService.deleteTask(i)).pipe(
                    map(() => deleteTaskFromDBSuccess({ i })),
                    catchError(() => of(deleteTaskFromDBFailure({ i })))
                )
            })
        )
    );
}
