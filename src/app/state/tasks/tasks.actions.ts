import { createAction, props } from "@ngrx/store";
import { TaskTile, TaskTiles } from "./tasks.reducer";

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
    props<{i: number; newValue: TaskTile; id: string;}>()
);

export const loadTasksFromDB = createAction(
    '[tasks] load tasks from db',
    props<{userId:string}>()
);

export const loadTasksFromDBSuccess = createAction(
    '[tasks] load tasks from db success',
    props<{tasks: TaskTiles; indices: string[]}>()
);

export const loadTasksFromDBFailure = createAction(
    '[tasks] load tasks from db fail'
);

export const uploadTaskToDBSuccess = createAction(
    '[tasks] upload task to db success'
);

export const uploadTaskToDB = createAction(
    '[tasks] upload task to db',
    props<{task: TaskTile, userId:string, id: string}>()
);

export const uploadTaskToDBFailure = createAction(
    '[tasks] upload task to db fail'
);

export const deleteTaskFromDB = createAction(
    '[tasks] delete task from db',
    props<{i: number, id:string, userId: string}>()
);

export const deleteTaskFromDBSuccess = createAction(
    '[tasks] delete task from db success',
    props<{i:number}>()
);

export const deleteTaskFromDBFailure = createAction(
    '[tasks] delete task to db fail',
    props<{i: number}>()
);
