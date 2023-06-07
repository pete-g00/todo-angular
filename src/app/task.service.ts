import { Injectable, inject } from '@angular/core';
import { TaskTile } from './state/tasks/tasks.reducer';
import { Firestore, Timestamp, collection, deleteDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class TodoService {  
  private db: Firestore = inject(Firestore);

// TODO: The user will also be passed later

  /**
   * Returns all the tasks present.
   * 
   * @returns the tasks
   */
  async getTasks(): Promise<TaskTile[]> {
    const todoRef = collection(this.db, 'default');
    const snapshot = await getDocs(todoRef);
    const tasks:TaskTile[] = [];
    snapshot.forEach((result) => {
      const data = result.data() as {description: string; isCompleted: boolean; title: string; due: Timestamp};
      tasks.push({
        description: data.description,
        due: data.due.toDate(),
        title: data.title
      });
    });

    return tasks;
  }

  /**
   * Uploads a task to the database (i.e. update or add a task).
   * 
   * @param task the task to get added
   * @param i the index where the task gets added
   */
  async uploadTask(task: TaskTile, i:number) {
    if (task !== undefined) {
      console.log("Uploading a task:", task, i);
      // const docRef = doc(this.db, 'default', i.toString());
      // await setDoc(docRef, task);
    }
  }

  /**
   * Deletes the task at index `i`.
   * 
   * @param i the index of the task
   */
  async deleteTask(i:number) {
    console.log("Deleting a task", i);
    // const docRef = doc(this.db, 'default', i.toString());
    // await deleteDoc(docRef);
  }
}