<template>
  <div id="tasks-view" v-show="showTasksView">
    <h2 class="content-block">Tasks</h2>
    <table>
        <tr v-for="task in topOpenTasks " v-bind:key="task" v-bind:todo="task">
          <td>{{ task.name }}<br>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
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
    <button @click="saveNewTask">Save</button>
  </div>

  <div id="task-edit-view" v-show="showTaskEditView">
      <h2 class="content-block">Edit Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" v-model="completed"></div>
      <button @click="showHomeView">Cancel</button>
      <button @click="deleteCurrentTask">Delete</button>
      <button @click="saveTask">Save</button>
  </div>

  <div id="task-list-view" v-show="showTaskListView">
    <h2 class="content-block">Tasklist</h2>
      <b>Open Tasks</b>
        <table>
          <tr v-for="task in openTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="open-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
       <b>Completed Tasks</b>
        <table>
          <tr v-for="task in completedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
      <b>Deleted Tasks</b>
        <table>
          <tr v-for="task in deletedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button @click="undeleteTask(task)">Undelete</button></td>
          </tr>
        </table>
    <button @click="showHomeView">Cancel</button>
  </div>
</template>

<script>
import axios from "axios";

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  setup() {

    return {
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
      topOpenTasks: [],
      taskName: '',
      taskDescription: '',
      completed: false,
      update: false,
      id: 0,
      maxOpenTasks: 3,
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

    showAddView() {
      this.hideAllViews()
      this.showTaskAddView = true
    },

    showListView() {
      this.hideAllViews()
      this.showTaskListView = true
    },

    addTask() {
      this.clearTaskFields()
      this.hideAllViews()
      this.showTaskAddView = true
    },

    clearTaskFields() {
      this.taskName = ''
      this.taskDescription = ''
      this.completed = false
    },

    saveNewTask() {
      if ( !this.validateRequiredFields() ) {
        return
      }
      this.tasks.push(this.buildTaskFromFormFields())
      this.saveTasks()
      this.showHomeView()
    },

    saveTask() {
      if ( !this.validateRequiredFields() ) {
        return
      }
      this.tasks[this.currentIndex] = this.buildTaskFromFormFields()
      this.saveTasks()
      this.showHomeView()
    },

    buildTaskFromFormFields() {
      return { name: this.taskName, description: this.taskDescription, completed: this.completed, deleted: false }
    },

    validateRequiredFields() {
      return this.taskName.length>0 && this.taskDescription>0
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

    deleteCurrentTask() {
      if ( !this.currentTask ) {
        return
      }
      this.tasks.at(this.currentTask.ID).deleted = true
      this.saveTasks()
      this.showHomeView()
    },

    deleteTask(task) {
      this.tasks.at(task.ID).deleted = true
      this.saveTasks()
    },

    undeleteTask(task) {
      this.tasks.at(task.ID).deleted = false
      this.saveTasks()
    },

    completeTask(task, event) {
      task.completed = event.target.checked
      this.tasks[task.ID] = task
      this.saveTasks()
    },
    
    clearAddTaskFields() {
      this.newTaskName = '';
      this.newTaskDescription = '';
    },

    clearTasks() {
      this.id = 0
      this.tasks = []
      this.openTasks = []
      this.completedTasks = []
      this.deletedTasks = []
      this.topOpenTasks = []
    },

    getUrl() {
      return taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
    },

    async getTasks() {
      try {
        const url = this.getUrl()
        const response = await axios.get(url)
        const tasks = response.data.tasks
        if ( tasks ) {
          this.update = true
          this.clearTasks()
          this.tasks = tasks;
          tasks.map(this.organizeTasks)
          this.topOpenTasks = this.openTasks.slice(0, this.maxOpenTasks)
          if ( this.openTasks.length > 0 ) {
            this.showHomeView()
          }
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
