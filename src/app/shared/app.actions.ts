import { TaskTile } from './../app.component';

export class AddTask {
    static readonly type = '[app] add task';
    constructor(public payload:TaskTile) { }
}

export class RemoveTask {
    static readonly type = '[app] remove task';
    constructor(public payload:TaskTile) { }
}

export class UpdateTask {
    static readonly type = '[app] update task';
    constructor(public previousValue:TaskTile, public newValue:TaskTile) {}
}

export class CompleteTask{
    static readonly type = '[app] complete task';
    constructor(public payload:TaskTile) {}
}

export class IncompleteTask{
    static readonly type = '[app] incomplete task';
    constructor(public payload:TaskTile) {}
}
