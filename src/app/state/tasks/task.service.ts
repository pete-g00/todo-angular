import { Injectable, inject } from '@angular/core';
import { TaskTile, TaskTiles } from './tasks.reducer';
import { Firestore, Timestamp, collection, deleteDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class TodoService {  
  private db: Firestore = inject(Firestore);

  /**
   * Returns all the tasks present.
   * 
   * @returns the tasks
   */
  async getTasks(userId:string): Promise<{tasks: TaskTiles; indices: string[]}> {
    const todoRef = collection(this.db, userId);
    const snapshot = await getDocs(todoRef);
    
    const tasks:TaskTiles = [];
    const indices:string[] = [];
    snapshot.forEach((result) => {
      const data = result.data() as {
        description: string; 
        title: string; 
        due: Timestamp
      };
      tasks.push({
        description: data.description,
        due: data.due.toDate(),
        title: data.title
      });
      indices.push(result.id);
    });

    return {tasks, indices};
  }

  /**
   * Uploads a task to the database (i.e. update or add a task).
   * 
   * @param task the task to get added
   * @param id the index where the task gets added
   */
  async uploadTask(task: TaskTile, userId:string, id:string) {
    if (task !== undefined) {
      console.log(`Uploading the task with id ${id}`, task);
      const docRef = doc(this.db, userId, id);
      await setDoc(docRef, task);
    }
  }

  /**
   * Deletes the task at index `i`.
   * 
   * @param id the index of the task
   */
  async deleteTask(userId:string, id:string) {
    console.log(`Deleting a task with id ${id}`);
    const docRef = doc(this.db, userId, id);
    await deleteDoc(docRef);
  }
}