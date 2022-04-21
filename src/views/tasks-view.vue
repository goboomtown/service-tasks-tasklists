<template>
  <div id="tasks-view" v-show="showTasksView">
    <h2 class="content-block">Tasks</h2>
    <table>
        <tr v-for="(task, index) in openTasks " v-bind:key="task" v-bind:todo="task">
          <td>{{ task.name }}<br>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          <td><button @click="editTask(task)">-></button></td>
        </tr>
    </table>
    <button @click="addTask">Add Task</button>
    <button @click="listTasks">List Tasks</button>
  </div>

  <div id="task-add-view" v-show="showTaskAddView">
    <h2 class="content-block">Add Task</h2>
    <div>Name: <input v-model="taskName"></div>
    <div>Description: <input v-model="taskDescription"></div>
    <button @click="showHomeView">Cancel</button>
    <button @click="saveNewTask">Add</button>
  </div>

  <div id="task-edit-view" v-show="showTaskEditView">
      <h2 class="content-block">Edit Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" v-model="completed"></div>
      <button @click="showHomeView">Cancel</button>
      <button @click="deleteTask">Delete</button>
      <button @click="saveTask">Update</button>
  </div>

  <div id="task-list-view" v-show="showTaskListView">
    <h2 class="content-block">Tasklist</h2>
      <b>Open Tasks</b>
        <table>
          <tr v-for="(task, index) in openTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="open-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
       <b>Completed Tasks</b>
        <table>
          <tr v-for="(task, index) in completedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      <b>Deleted Tasks</b>
        <table>
          <tr v-for="(task, index) in deletedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
    <button @click="showHomeView">Cancel</button>
  </div>
</template>

<script>
import axios from "axios";
import { reactive } from 'vue';

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  setup() {
    const formData = reactive({
      email:"",
      password:""
    });

    async function onSubmit() {
      const { email, password } = formData;
      console.log(email, password)
    }

    return {
      formData,
      onSubmit
    };
  },

  created() {
    this.currentCaseRecord = window.VUETASKS.config.currentCaseRecord;

    if (Object.keys(this.currentCaseRecord).length) {
      this.object = 'case'
      this.object_id = this.currentCaseRecord.get('id')
    }
  },

  components: {
  },

  data() {
    return {
      showTasksView: true,
      showTaskAddView: false,
      showTaskEditView: false,
      showTaskListView: false,
      currentCaseRecord: null,
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
      columns: ['name', 'description', 'completed'],
      id: 0,
    }
  },

  methods: {
    hideAllViews() {
      this.showTasksView = false
      this.showTaskAddView = false
      this.showTaskEditView = false
      this.showTaskListView = false
    },

    showHomeView() {
      this.hideAllViews()
      this.showTasksView = true
    },

    addTask() {
      this.hideAllViews()
      this.showTaskAddView = true
    },

    saveNewTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false }
      this.tasks.push(task)
      this.saveTasks()
      this.showHomeView()
    },

    saveTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false, deleted: false }
      this.tasks[this.currentIndex] = task
      this.saveTasks()
      this.showHomeView()
    },

    listTasks() {
      this.hideAllViews()
      this.showTaskListView = true
    },
    
    editTask(task) {
      this.hideAllViews()
      this.showTaskEditView = true
      this.currentTask = task
      this.currentIndex = task.ID
      this.taskName = task.name
      this.taskDescription = task.description
      this.completed = task.completed
    },

    deleteTask() {
      const index = this.currentTask.ID
      this.tasks.at(index).deleted = true
      this.saveTasks()
      this.showHomeView()
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

    getUrl() {
      return taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
    },

    clearTasks() {
      this.id = 0
      this.tasks = []
      this.openTasks = []
      this.completedTasks = []
      this.deletedTasks = []
    },
    
    async getTasks() {
      try {
        const url = this.getUrl()
        const response = await axios.get(url)
        const tasks = response.data.tasks
        console.log(tasks)
        if ( tasks ) {
          this.update = true
          this.clearTasks()
          this.tasks = tasks;
          tasks.map(this.organizeTasks)
        }
      } catch (err) {
        this.handleServerError(err)
      }
    },

    async saveTasks() {
      try {
        const url = this.getUrl()
        const tasks = new Object()
        tasks.tasks = this.tasks
        const tasksJSON = JSON.stringify(tasks)
        const config = { headers: { 'Content-Type': 'text/plain' } }
        this.update ? await axios.put(url, tasksJSON, config) : await axios.post(url, tasksJSON, config);
        this.getTasks()
      } catch (err) {
        this.handleServerError(err)
      }
    },

    handleServerError(error) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.log("Server Error:", error)
      } else if (error.request) {
        // client never received a response, or request never left
        console.log("Network Error:", error)
      } else {
        console.log("Client Error:", error)
      }
    },

    organizeTasks(task) {
      task.ID = this.id++
      if ( task.deleted ) {
        this.deletedTasks.push(task)
      } else {
        if ( task.completed ) {
          this.completedTasks.push(task)
        } else {
          this.openTasks.push(task)
        }
      }
     },
    
  },

  mounted() {
    this.getTasks();
  },

};
</script>
