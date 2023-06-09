import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { deleteTaskFromDB, deleteTaskFromDBFailure, deleteTaskFromDBSuccess, loadTasksFromDB, loadTasksFromDBFailure, loadTasksFromDBSuccess, uploadTaskToDB, uploadTaskToDBFailure, uploadTaskToDBSuccess } from "./tasks.actions";
import { from, of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";
import { TodoService } from "src/app/state/tasks/task.service";

@Injectable()
export class TaskEffects {
    constructor(private actions$: Actions, private taskService: TodoService) {}

    loadTasks$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadTasksFromDB),
            switchMap(({ userId }) => from(this.taskService.getTasks(userId)).pipe(
                    map(({ indices, tasks }) => loadTasksFromDBSuccess({ tasks, indices })),
                    catchError(() => of(loadTasksFromDBFailure()))
                )
            )
        )
    );

    uploadTask$ = createEffect(() => 
        this.actions$.pipe(
            ofType(uploadTaskToDB),
            switchMap(({ task, id, userId }) => from(this.taskService.uploadTask(task, userId, id)).pipe(
                map(() => uploadTaskToDBSuccess()),
                catchError(() => of(uploadTaskToDBFailure()))
            ))
        )
    );

    deleteTask$ = createEffect(() => 
        this.actions$.pipe(
            ofType(deleteTaskFromDB),
            switchMap(({ i, id, userId }) => from(this.taskService.deleteTask(userId, id)).pipe(
                map(() => deleteTaskFromDBSuccess({ i })),
                catchError(() => of(deleteTaskFromDBFailure({ i })))
            ))
        )
    );
}
