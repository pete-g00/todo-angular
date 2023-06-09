import { createReducer, on } from "@ngrx/store";
import { loadTasksFromDB, loadTasksFromDBFailure, loadTasksFromDBSuccess, removeTask, 
    uploadTaskToDB, uploadTaskToDBFailure, uploadTaskToDBSuccess, 
    updateTask, deleteTaskFromDB, deleteTaskFromDBSuccess, deleteTaskFromDBFailure } from "./tasks.actions";

// A task tile
export interface TaskTile {
    // the title of the task
    title: string;
  
    // the description of the task
    description: string;
  
    // the date by when the task needs to be completed
    due: Date;
}

export type TaskTiles = TaskTile[];

export interface TasksState {
    tasks: TaskTiles;
    indices: string[];
    dataPresent: boolean;
    loadingData: boolean;
    errorLoadingData: boolean;
    updateSuccess?: boolean;
    deleteSuccess?: {i: number; success: boolean;};
}

const initialState:TasksState = {
    tasks: [],
    indices: [],
    loadingData: false,
    dataPresent: false,
    errorLoadingData: false
};

export const tasksReducer = createReducer<TasksState>(
    initialState,
    on(removeTask, ((state, { i }) => {
        const tasks = [...state.tasks];
        tasks.splice(i, 1);
        const indices = [...state.indices];
        indices.splice(i, 1);
        return {...state, tasks, indices};
    })),
    on(updateTask, ((state, { i, newValue, id }) => {
        const tasks = [...state.tasks];
        tasks[i] = newValue;
        const indices = [...state.indices];
        indices[i] = id;
        return {...state, tasks, indices};
    })),
    on(loadTasksFromDB, (state) => ({...state, loadingData: true})),
    on(loadTasksFromDBSuccess, ((state, { tasks, indices }) => ({...state, tasks, indices, loadingData: false, dataPresent: true}))),
    on(loadTasksFromDBFailure, ((state) => ({...state, loadingData: false, errorLoadingData: true}))),
    on(deleteTaskFromDB, ((state) => ({...state, deleteSuccess: undefined}))),
    on(deleteTaskFromDBSuccess, (state, { i }) => ({...state, deleteSuccess: {i, success: true}})),
    on(deleteTaskFromDBFailure, (state, { i }) => ({...state, deleteSuccess: {i, success: false}})),
    on(uploadTaskToDB, ((state) => ({...state, updateSuccess: undefined}))),
    on(uploadTaskToDBSuccess, (state) => ({...state, updateSuccess: true})),
    on(uploadTaskToDBFailure, (state) => ({...state, updateSuccess: false})),
)
