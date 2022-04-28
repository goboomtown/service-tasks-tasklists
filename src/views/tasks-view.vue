<template>
  <div id="tasks-view" data-testid="tasks-show-tasks-view" v-show="isPanelVisible.tasks">
    <h2 class="content-block">Tasks</h2>
    <table>
        <tr v-for="task in tasks.topOpen " v-bind:key="task" v-bind:todo="task">
          <td>{{ task.name }}<br>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
          <td><button data-testid="tasks-edit-task-button" @click="editTask(task)">-></button></td>
        </tr>
    </table>
    <div v-show="isMenuUnavailable">
      <button data-testid="tasks-show-tasks-add-button" @click="showAddView">Add Task</button>
      <button data-testid="tasks-show-tasks-list-button" @click="showListView">List Tasks</button>
    </div>
  </div>

  <div id="task-add-view" data-testid="tasks-add-tasks-view" v-show="isPanelVisible.add">
    <h2 class="content-block">Add Task</h2>
    <div>Name: <input v-model="taskName" data-testid="tasks-add-name"></div>
    <div>Description: <input v-model="taskDescription" data-testid="tasks-add-description"></div>
    <button data-testid="tasks-add-task-cancel-button" @click="showHomeView">Cancel</button>
    <button data-testid="tasks-add-task-save-button" @click="saveNewTask">Save</button>
  </div>

  <div id="task-edit-view" data-testid="tasks-edit-tasks-view" v-show="isPanelVisible.edit">
      <h2 class="content-block">Edit Task</h2>
      <div>Name: <input v-model="taskName" data-testid="tasks-edit-name"></div>
      <div>Description: <input v-model="taskDescription" data-testid="tasks-edit-description"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" data-testid="tasks-edit-complete-checkbox" v-model="completed"></div>
      <button data-testid="tasks-edit-task-cancel-button" @click="showHomeView">Cancel</button>
      <button data-testid="tasks-edit-task-delete-button" @click="deleteCurrentTask">Delete</button>
      <button data-testid="tasks-edit-task-save-button" @click="saveTask">Save</button>
  </div>

  <div id="task-list-view" data-testid="tasks-list-tasks-view" v-show="isPanelVisible.list">
    <h2 class="content-block">Tasklist</h2>
      <b>Open Tasks</b>
        <table>
          <tr v-for="task in tasks.open " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="open-checkbox" data-testid="tasks-list-open-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
       <b>Completed Tasks</b>
        <table>
          <tr v-for="task in tasks.completed " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" data-testid="tasks-list-completed-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button data-testid="tasks-list-completed-tasks-delete-button" @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
      <b>Deleted Tasks</b>
        <table>
          <tr v-for="task in tasks.deleted " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" data-testid="tasks-list-deleted-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button data-testid="tasks-list-deleted-tasks-undelete-button" @click="undeleteTask(task)">Undelete</button></td>
          </tr>
        </table>
    <button data-testid="tasks-list-tasks-cancel-button" @click="showHomeView">Cancel</button>
  </div>
</template>

<script>
import axios from "axios";

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  name: "TasksView",
  
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
      action: {
        completed: 'task-completed',
        uncompleted: 'task-uncompleted',
        added:'task-added',
        edited: 'task-edited',
        deleted: 'task-deleted',
        undeleted: 'task-undeleted'
      },
      tasks: {
        all: [],
        open: [],
        completed: [],
        deleted: [],
        topOpen: [],
      },
      isMenuUnavailable: false,
      isPanelVisible: {
        tasks: false,
        add: false,
        edit: false,
        list: false,
      },
      currentCaseRecord: null,
      object: 'case',
      object_id: '20',
      currentIndex: 0,
      currentTask: null,
      taskName: '',
      taskDescription: '',
      completed: false,
      update: false,
      id: 0,
      maxOpenTasks: 3,
      handler: null
    }
  },

  methods: {
    setEventHandler(handler) {
      this.handler = handler
    },

    sendEvent(event) {
      if ( this.handler ) {
        this.handler(event)
      }
    },

    hidePanels() {
      this.isPanelVisible.tasks = false
      this.isPanelVisible.add = false
      this.isPanelVisible.edit = false
      this.isPanelVisible.list = false
    },

    showHomeView() {
      this.hidePanels()
      console.log(this.openTasks)
      if ( this.hasOpenTasks() || this.isMenuUnavailable ) {
        this.isPanelVisible.tasks = true
      }
    },

    hasOpenTasks() {
      return this.tasks.open.length > 0
    },

    showAddView() {
      this.clearTaskFields()
      this.hidePanels()
      this.isPanelVisible.add = true
    },

    showListView() {
      this.hidePanels()
      this.isPanelVisible.list = true
    },

    addTask() {
      this.clearTaskFields()
      this.hidePanels()
      this.isPanelVisible.add = true
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
      const task = this.buildTaskFromFormFields()
      console.log(task)
      console.log(this.tasks)
      this.tasks.push(task)
      this.sendEvent({
        action: this.action.added,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    saveTask() {
      if ( !this.validateRequiredFields() ) {
        return
      }
      this.tasks[this.currentIndex] = this.buildTaskFromFormFields()
      this.sendEvent({
        action: this.action.edited,
        task: this.tasks[this.currentIndex],
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    buildTaskFromFormFields() {
      return { name: this.taskName, description: this.taskDescription, completed: this.completed, deleted: false }
    },

    validateRequiredFields() {
      return this.taskName.length>0
    },

    listTasks() {
      this.hidePanels()
      this.isPanelVisible.list = true
    },
    
    editTask(task) {
      this.hidePanels()
      this.isPanelVisible.edit = true
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
      this.sendEvent({
        action: this.action.deleted,
        task: this.currentTask,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    deleteTask(task) {
      this.tasks.at(task.ID).deleted = true
      this.sendEvent({
        action: this.action.deleted,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
    },

    undeleteTask(task) {
      this.tasks.at(task.ID).deleted = false
      this.sendEvent({
        action: this.action.undeleted,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
    },

    completeTask(task, event) {
      task.completed = event.target.checked
      this.sendEvent({
        action: event.target.checked?this.action.completed:this.action.uncompleted,
        task: task,
        time: new Date().toISOString()
      })
      this.tasks[task.ID] = task
      this.saveTasks()
    },
    
    clearTasks() {
      this.id = 0
      this.tasks.all = []
      this.tasks.open = []
      this.tasks.completed = []
      this.tasks.deleted = []
      this.tasks.topOpen = []
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
          this.tasks.all = tasks;
          tasks.map(this.organizeTasks)
          this.tasks.topOpen = this.openTasks.slice(0, this.maxOpenTasks)
          if ( !this.isPanelVisible.list ) {
            this.showHomeView()
          }
        }
      } catch (err) {
        if ( this.isMenuUnavailable ) {
          this.isPanelVisible.tasks = true
        }
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
        this.tasks.deleted.push(task)
      } else {
        if ( task.completed ) {
          this.tasks.completed.push(task)
        } else {
          this.tasks.open.push(task)
        }
      }
     },
    
  },

  mounted() {
    this.getTasks();
  },

};
</script>
