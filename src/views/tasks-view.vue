<template>
  <div id="tasks-view" data-testid="tasks-show-tasks-view" v-show="isPanelVisible.tasks && permissions.view">
    <h2>Tasks</h2>
    <div class="tasks-list" v-for="task in tasks.topOpen " v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ task.description }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="permissions.edit">
        <span data-testid="tasks-edit-task-button" @click="editTask(task)" v-show="permissions.edit">&gt;</span>
      </div>
    </div>
    <div v-show="isMenuUnavailable">
      <DxButton class="tasks-button" type="normal" text="Add Task" data-testid="tasks-show-tasks-add-button" @click="showAddView" v-show="permissions.add"/>
      <DxButton class="tasks-button" type="normal" text="List Tasks" data-testid="tasks-show-tasks-list-button" @click="showListView"/>
    </div>
  </div>

  <div id="task-add-view" data-testid="tasks-add-tasks-view" v-show="isPanelVisible.add && permissions.view">
    <h2>Add Task</h2>
    <div>
      <div class="label">Name:</div> <div><DxTextBox v-model:value="taskName" data-testid="tasks-add-name"/></div>
    </div>
    <div>
      <div class="label">Description:</div> <div><DxTextBox v-model:value="taskDescription" data-testid="tasks-add-description"/></div>
    </div>
    <div class="tasks-buttons">
      <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-add-task-cancel-button" @click="showHomeView"/>
      <DxButton class="tasks-button" type="default" text="Save" data-testid="tasks-add-task-save-button" @click="saveNewTask"/>
    </div>
  </div>

  <div id="task-edit-view" data-testid="tasks-edit-tasks-view" v-show="isPanelVisible.edit && permissions.view">
    <h2>Edit Task</h2>
    <div>
      <div class="label">Name:</div> <div><DxTextBox v-model:value="taskName" data-testid="tasks-edit-name"/></div>
    </div>
    <div>
      <div class="label">Description:</div> <div><DxTextBox v-model:value="taskDescription" data-testid="tasks-edit-description"/></div>
    </div>
    <div>
      <div class="label">Completed: <input type="checkbox" id="edit-checkbox" data-testid="tasks-edit-complete-checkbox" v-model="completed"></div>
    </div>
    <div class="tasks-buttons flex">
      <div class="delete">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-edit-task-delete-button" @click="deleteCurrentTask" v-show="permissions.del"/>
      </div>
      <div class="cancel-save">
        <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-edit-task-cancel-button" @click="showHomeView"/>
        <DxButton class="tasks-button" type="default" text="Save" data-testid="tasks-edit-task-save-button" @click="saveTask"/>
      </div>
    </div>
  </div>

  <div id="task-list-view" data-testid="tasks-list-tasks-view" v-show="isPanelVisible.list && permissions.view">
    <h2>Tasklist</h2>
    <h3>Open Tasks</h3>
    <div class="tasks-list" v-for="task in tasks.open " v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ task.description }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="permissions.edit">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)" v-show="permissions.del"/>
      </div>
    </div>
    <h3>Completed Tasks</h3>
    <div class="tasks-list" v-for="task in tasks.completed " v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ task.description }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="permissions.reopen">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)" v-show="permissions.del"/>
      </div>
    </div>
    <h3>Deleted Tasks</h3>
    <div class="tasks-list" v-for="task in tasks.deleted " v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ task.description }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="permissions.edit">
        <DxButton class="tasks-button" type="normal" text="Undelete" data-testid="tasks-list-deleted-tasks-undelete-button" @click="undeleteTask(task)" v-show="permissions.undelete"/>
      </div>
    </div>
    <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-list-tasks-cancel-button" @click="showHomeView"/>
  </div>
</template>

<script>
import axios from "axios";
import DxButton from 'devextreme-vue/button';
import DxTextBox from 'devextreme-vue/text-box';

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  name: "TasksView",
  
  setup() {
    return {
    };
  },

  created() {
    this.currentCaseRecord = window.VUETASKS.config.currentCaseRecord;
    this.permissions.view = window.VUETASKS.config.tasks_view || false;
    this.permissions.add = window.VUETASKS.config.tasks_add || false;
    this.permissions.edit = window.VUETASKS.config.tasks_edit || false;
    this.permissions.del = window.VUETASKS.config.tasks_del || false;
    this.permissions.reopen = window.VUETASKS.config.tasks_reopen || false;
    this.permissions.undelete = window.VUETASKS.config.tasks_undelete || false;

    if (Object.keys(this.currentCaseRecord).length) {
      this.object = 'case'
      this.object_id = this.currentCaseRecord.get('id')
    }
  },

  components: {
    DxButton,
    DxTextBox
  },

  data() {
    return {
      action: {
        completed: 'task-completed',
        reopened: 'task-reopened',
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
      handler: null,
      permissions: {
        view: false,
        add: false,
        edit: false,
        del: false,
        reopen: false,
        undelete: false,
      }
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
      console.log(this.tasks.open)
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
      this.tasks.all.push(task)
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
      this.tasks.all[this.currentIndex] = this.buildTaskFromFormFields()
      this.sendEvent({
        action: this.action.edited,
        task: this.tasks.all[this.currentIndex],
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
      this.tasks.all.at(this.currentTask.ID).deleted = true
      this.sendEvent({
        action: this.action.deleted,
        task: this.currentTask,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    deleteTask(task) {
      this.tasks.all.at(task.ID).deleted = true
      this.sendEvent({
        action: this.action.deleted,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
    },

    undeleteTask(task) {
      this.tasks.all.at(task.ID).deleted = false
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
        action: event.target.checked?this.action.completed:this.action.reopened,
        task: task,
        time: new Date().toISOString()
      })
      this.tasks.all[task.ID] = task
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
          this.tasks.topOpen = this.tasks.open.slice(0, this.maxOpenTasks)
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
        tasks.tasks = this.tasks.all
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
<style scoped>
div{
  color: #4F4F4F;
}
h2 {
  color: #626363;
  font-size: 1rem;
}
h3 {
  color: #626363;
  font-size: .95rem;
}
.label {
  font-size: .8rem;
  line-height: 2rem;
}
.tasks-buttons{
  text-align: right;
  padding: 1rem 0;
}
.flex{
  display: flex;
}
.delete{
  flex: 1;
  text-align: left;
}
.cancel-save{
}
.tasks-button{
  margin: 0 .5rem;
}
.tasks-list{
  display: flex;
}
.task-name-description{
  flex: 1;
}
.task-name{
  font-weight: bold;
  font-size: .9rem;
}
.task-description{
  font-size: .8rem;
}
.tasks-actions{
  align-items: center;
  text-align: right;
  padding: 1rem;
}
.tasks-actions input[type="checkbox"]{
  margin-right: 1rem;
}
.tasks-actions span{
  cursor: default;
}
</style>
