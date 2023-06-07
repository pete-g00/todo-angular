import { createAction, props } from "@ngrx/store";
import { TaskTile } from "./tasks.reducer";

export const addTask = createAction(
    '[tasks] add task',
    props<{task: TaskTile}>()
);

export const removeTask = createAction(
    '[tasks] remove task',
    props<{i: number}>()
);

export const updateTask = createAction(
    '[tasks] update task',
    props<{i: number, newValue: TaskTile}>()
);

export const loadTasksFromDB = createAction('[tasks] load tasks from db');

export const loadTasksFromDBSuccess = createAction(
    '[tasks] load tasks from db success',
    props<{tasks: TaskTile[]}>()
);

export const loadTasksFromDBFailure = createAction(
    '[tasks] load tasks from db fail'
);

export const uploadTaskToDBSuccess = createAction(
    '[tasks] upload task to db success',
    props<{i:number}>()
);

export const uploadTaskToDB = createAction(
    '[tasks] upload task to db',
    props<{task: TaskTile, i: number}>()
);

export const uploadTaskToDBFailure = createAction(
    '[tasks] upload task to db fail',
    props<{i: number}>()
);

export const deleteTaskFromDB = createAction(
    '[tasks] upload task to db',
    props<{i: number}>()
);

export const deleteTaskFromDBSuccess = createAction(
    '[tasks] upload task to db success',
    props<{i:number}>()
);

export const deleteTaskFromDBFailure = createAction(
    '[tasks] upload task to db fail',
    props<{i: number}>()
);
