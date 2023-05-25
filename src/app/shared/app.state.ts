import { State, Action, StateContext } from '@ngxs/store';
import { patch, append, removeItem, updateItem } from '@ngxs/store/operators';
import { AddTask, CompleteTask, IncompleteTask, RemoveTask, UpdateTask } from './app.actions';
import { TaskTile } from './../app.component';
import { Injectable } from '@angular/core';

export interface AppModel {
    data: TaskTile[];
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
            description: "Learn how to code a web app using Flutter with a focus on state management!",
            duration: 2,
            left: 3,
            isCompleted: false,
        }]
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
}