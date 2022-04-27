<template>
  <div id="tasks-view" data-testid="tasks-show-tasks-view" v-show="showTasksView">
    <h2 class="content-block">Tasks</h2>
    <table>
        <tr v-for="task in topOpenTasks " v-bind:key="task" v-bind:todo="task">
          <td>{{ task.name }}<br>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
          <td><button data-testid="tasks-edit-task-button" @click="editTask(task)">-></button></td>
        </tr>
    </table>
  </div>

  <div id="task-add-view" data-testid="tasks-add-tasks-view" v-show="showTaskAddView">
    <h2 class="content-block">Add Task</h2>
    <div>Name: <input v-model="taskName"></div>
    <div>Description: <input v-model="taskDescription"></div>
    <button data-testid="tasks-add-task-cancel-button" @click="showHomeView">Cancel</button>
    <button data-testid="tasks-add-task-save-button" @click="saveNewTask">Save</button>
  </div>

  <div id="task-edit-view" data-testid="tasks-edit-tasks-view" v-show="showTaskEditView">
      <h2 class="content-block">Edit Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" v-model="completed"></div>
      <button data-testid="tasks-edit-task-cancel-button" @click="showHomeView">Cancel</button>
      <button data-testid="tasks-edit-task-delete-button" @click="deleteCurrentTask">Delete</button>
      <button data-testid="tasks-edit-task-save-button" @click="saveTask">Save</button>
  </div>

  <div id="task-list-view" data-testid="tasks-list-tasks-view" v-show="showTaskListView">
    <h2 class="content-block">Tasklist</h2>
      <b>Open Tasks</b>
        <table>
          <tr v-for="task in openTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="open-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
       <b>Completed Tasks</b>
        <table>
          <tr v-for="task in completedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
            <td><button data-testid="tasks-list-completed-tasks-delete-button" @click="deleteTask(task)">Delete</button></td>
          </tr>
        </table>
      <b>Deleted Tasks</b>
        <table>
          <tr v-for="task in deletedTasks " v-bind:key="task" v-bind:todo="task">
            <td>{{ task.name }}<br>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" v-model="task.completed" @change="completeTask(task, $event)"></td>
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
        completed: 'completed',
        uncompleted: 'uncompleted',
        added:'added',
        edited: 'edited',
        deleted: 'deleted',
        undeleted: 'undeleted'
      },

      showTasksView: false,
      showTaskAddView: false,
      showTaskEditView: false,
      showTaskListView: false,
      currentCaseRecord: null,
      object: 'case',
      object_id: '20',
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

    hideAllViews() {
      this.showTasksView = false
      this.showTaskAddView = false
      this.showTaskEditView = false
      this.showTaskListView = false
    },

    showHomeView() {
      this.hideAllViews()
      console.log(this.openTasks)
      if ( this.openTasks.length > 0 ) {
        this.showTasksView = true
      }
    },

    showAddView() {
      this.clearTaskFields()
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
          if ( !this.showTaskListView ) {
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
