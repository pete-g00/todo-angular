import { State, Action, StateContext } from '@ngxs/store';
import { patch, append, removeItem, updateItem } from '@ngxs/store/operators';
import { AddTask, CompleteTask, IncompleteTask, RemoveTask, UpdateTask, Filter, ChangeFilter } from './app.actions';
import { TaskTile } from './../app.component';
import { Injectable } from '@angular/core';

export interface AppModel {
    data: TaskTile[];
    filter: Filter;
}

@State<AppModel>({
    name: 'TaskTile',
    defaults: {
        data: [{
            title: "Learn Angular",
            description: "Learn how to code a web app using Angular with a focus on state management!",
            duration: 5,
            left: 1,
            isCompleted: true,
        }, {
            title: "Learn React",
            description: "Learn how to code a web app using React with a focus on state management!",
            duration: 3,
            left: 5,
            isCompleted: false,
        }, {
            title: "Learn Flutter",
            description: "Learn how to code an android and an iOS app using Flutter with a focus on state management!",
            duration: 2,
            left: 3,
            isCompleted: false,
        }],
        filter: Filter.ALL
    },
})

@Injectable()
export class AppState {
    @Action(AddTask)
    addTask(ctx : StateContext<AppModel>, action:AddTask) {
        ctx.setState(
            patch<AppModel>({
                data: append<TaskTile>([action.payload])
            })
        );
    }

    @Action(RemoveTask)
    removeTask(ctx:StateContext<AppModel>, action:RemoveTask) {
        ctx.setState(
            patch<AppModel>({
                data: removeItem<TaskTile>(value => value == action.payload)
            })
        );
    }

    @Action(UpdateTask)
    updateTask(ctx:StateContext<AppModel>, action:UpdateTask) {
        ctx.setState(
            patch<AppModel>({
                data: updateItem<TaskTile>(value => value == action.previousValue, action.newValue)
            })
        );
    }

    @Action(CompleteTask)
    completeTask(ctx:StateContext<AppModel>, action:CompleteTask) {
        ctx.setState(
            patch<AppModel>({
                data: updateItem<TaskTile>(value => value == action.payload, {
                    ... action.payload,
                    isCompleted: true
                })
            })
        );
    }
    
    @Action(IncompleteTask)
    incompleteTask(ctx:StateContext<AppModel>, action:IncompleteTask) {
        ctx.setState(
            patch<AppModel>({
                data: updateItem<TaskTile>(value => value == action.payload, {
                    ... action.payload,
                    isCompleted: false
                })
            })
        );
    }

    @Action(ChangeFilter)
    changeFilter(ctx:StateContext<AppModel>, action:ChangeFilter) {
        ctx.setState(
            patch<AppModel>({
                filter: action.payload
            })
        );
    }
}