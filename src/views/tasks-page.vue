<template>
  <div>
    <h2 class="content-block">Tasks</h2>

    <div class="columns medium-4" v-for="(task, index) in tasks " v-bind:key="task" v-bind:todo="task">
      <table>
        <tr>
          <td>{{ index }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          <td><button @click="editTask(task, index)">-></button></td>
        </tr>
      </table>
    </div>

    <div>
      <h2>Add Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div><button @click="addTask">Add</button></div>
    </div>

    <div>
      <h2>Edit Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" v-model="completed"></div>
      <div><button @click="deleteTask">Delete</button></div>
      <div><button @click="updateTask">Update</button></div>
    </div>

    <div>
      <h2>Tasklist</h2>
      <b>Open Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in openTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="opencheckbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
      <b>Completed Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in completedTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
      <b>Deleted Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in deletedTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
    </div>


  </div>
</template>

<script>
import "devextreme/data/odata/store";
import axios from "axios";

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 }
];

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  setup() {
    const dataSourceConfig = {
      store: {
        type: "odata",
        key: "Task_ID",
        url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks"
      },
      expand: "ResponsibleEmployee",
      select: [
        "Task_ID",
        "Task_Subject",
        "Task_Start_Date",
        "Task_Due_Date",
        "Task_Status",
        "Task_Priority",
        "Task_Completion",
        "ResponsibleEmployee/Employee_Full_Name"
      ]
    };
    return {
      dataSourceConfig,
      priorities
    };
  },

  data() {
    return {
      object: 'case',
      object_id: '14',
      currentIndex: 0,
      currentTask: null,
      tasks: [],
      openTasks: [],
      completedTasks: [],
      deletedTasks: [],
      taskName: '',
      taskDescription: '',
      completed: false,
      update: false,
    }
  },

  methods: {
    async getTasks() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        const response = await axios.get(url)
        const tasks = response.data.tasks
        if ( tasks ) {
          this.update = true
          this.tasks = tasks.map(task => ({
            name: task.name,
            description: task.description,
            completed: task.completed,
          }))
          this.openTasks = [];
          this.completedTasks = []
          this.deletedTasks = []
          tasks.map(this.organizeTasks)
          console.log(this.openTasks)
          console.log(this.completedTasks)
        }
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err)
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err)
        } else {
          console.log("Client Error:", err)
        }
      }
    },

    organizeTasks(task) {
      if ( task.completed ) {
        this.completedTasks.push(task)
      } else {
        this.openTasks.push(task)
      }
      if ( task.deleted ) {
        this.deletedTasks.push(task)
      }
    },

    addTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false }
      this.tasks.push(task)
      this.saveTasks()
    },

    updateTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false }
      this.tasks[this.currentIndex] = task
      this.saveTasks()
    },

    async saveTasks() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        // const tasks = Array.from(this.tasks)
        const tasks = new Object()
        tasks.tasks = this.tasks
        const tasksJSON = JSON.stringify(tasks)
        console.log(tasksJSON)
        const config = { headers: { 'Content-Type': 'text/plain' } }
        this.update ? await axios.put(url, tasksJSON, config) : await axios.post(url, tasksJSON, config);
        this.getTasks()
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err)
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err)
        } else {
          console.log("Client Error:", err)
        }
      }
    },

    async deleteTasklist() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        await axios.delete(url);
        this.getTasks()
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          console.log("Server Error:", err)
        } else if (err.request) {
          // client never received a response, or request never left
          console.log("Network Error:", err)
        } else {
          console.log("Client Error:", err)
        }
      }
    },

    editTask(task, index) {
      this.currentIndex = index
      this.taskName = task.name
      this.taskDescription = task.description
      this.completed = task.completed
    },

    deleteTask() {
      this.tasks.splice(this.currentIndex, 1);
      if ( this.tasks.length > 0 ) {
        this.saveTasks()
      } else {
        this.deleteTasklist()
      }
    },

    completeTask(event, index) {
      console.log(index)
      const tasks = Array.from(this.tasks)
      console.log(tasks)
      const task = tasks[index]
      task.completed = event.target.checked
      this.tasks = tasks
      this.saveTasks()
    },
    
    clearAddTaskFields() {
      this.newTaskName = '';
      this.newTaskDescription = '';
    },
  },

  mounted() {
    this.getTasks();
  },

  components: {
  }
};
</script>
