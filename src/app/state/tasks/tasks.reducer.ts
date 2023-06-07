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

export interface TasksState {
    tasks: TaskTile[];
    dataPresent: boolean;
    loadingData: boolean;
    errorLoadingData: boolean;
    updateSuccess?: {i: number; success: boolean;};
    deleteSuccess?: {i: number; success: boolean;};
}

const initialState:TasksState = {
    tasks: [],
    loadingData: false,
    dataPresent: false,
    errorLoadingData: false
};

export const tasksReducer = createReducer<TasksState>(
    initialState,
    on(removeTask, ((state, { i }) => {
        const tasks = [...state.tasks];
        tasks.splice(i, 1);
        return {...state, tasks};
    })),
    on(updateTask, ((state, { i, newValue }) => {
        const tasks = [...state.tasks];
        tasks[i] = newValue;
        return {...state, tasks};
    })),
    on(loadTasksFromDB, (state) => {
        return {...state, loadingData: true};
    }),
    on(loadTasksFromDBSuccess, ((state, { tasks }) => {
        return {...state, tasks, dataPresent: true};
    })),
    on(loadTasksFromDBFailure, ((state) => {
        return {...state, errorLoadingData: true};
    })),
    on(deleteTaskFromDB, ((state) => {
        return {...state, deleteSuccess: undefined};
    })),
    on(deleteTaskFromDBSuccess, (state, { i }) => {
        return {...state, deleteSuccess: {i, success: true}};
    }),
    on(deleteTaskFromDBFailure, (state, { i }) => {
        return {...state, deleteSuccess: {i, success: false}};
    }),
    on(uploadTaskToDB, ((state) => {
        return {...state, updateSuccess: undefined};
    })),
    on(uploadTaskToDBSuccess, (state, { i }) => {
        return {...state, updateSuccess: {i, success: true}};
    }),
    on(uploadTaskToDBFailure, (state, { i }) => {
        return {...state, updateSuccess: {i, success: false}};
    }),
)
