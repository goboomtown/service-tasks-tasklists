<template>
  <div id="tasks-view" data-testid="tasks-show-tasks-view" v-show="isPanelVisible.tasks && $store.state.tasks.permissions.view">
    <h2>Tasks</h2>
    <div class="tasks-list" v-for="task in topOpenTasks" v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ formatDate(task.due_datetime) }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="$store.state.tasks.permissions.edit">
        <span data-testid="tasks-edit-task-button" @click="editTask(task)" v-show="$store.state.tasks.permissions.edit">&gt;</span>
      </div>
    </div>
    <div v-show="isMenuUnavailable">
      <DxButton class="tasks-button" type="normal" text="Add Task" data-testid="tasks-show-tasks-add-button" @click="showAddView" v-show="$store.state.tasks.permissions.add"/>
      <DxButton class="tasks-button" type="normal" text="List Tasks" data-testid="tasks-show-tasks-list-button" @click="showListView"/>
    </div>
  </div>

  <div id="task-add-view" data-testid="tasks-add-tasks-view" v-show="isPanelVisible.add && $store.state.tasks.permissions.view">
    <h2>Add Task</h2>
    <div>
      <div class="label">Name:</div> <div><DxTextBox v-model:value="currentTask.name" data-testid="tasks-add-name"/></div>
    </div>
    <div>
      <div class="label">Description:</div> <div><DxTextBox v-model:value="currentTask.description" data-testid="tasks-add-description" :min="dateBoxConfigs.minDate"/></div>
    </div>
    <div>
      <div class="label">Due Date:</div> <div><DxDateBox v-model:value="currentTask.due_datetime" type="datetime" data-testid="tasks-add-due-datetime" :min="dateBoxConfigs.minDate"/></div>
    </div>
    <div class="tasks-buttons">
      <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-add-task-cancel-button" @click="showHomeView"/>
      <DxButton class="tasks-button" type="default" text="Save" data-testid="tasks-add-task-save-button" @click="saveNewTask"/>
    </div>
  </div>

  <div id="task-edit-view" data-testid="tasks-edit-tasks-view" v-show="isPanelVisible.edit && $store.state.tasks.permissions.view">
    <h2>Edit Task</h2>
    <div>
      <div class="label">Name:</div> <div><DxTextBox v-model:value="currentTask.name" data-testid="tasks-edit-name"/></div>
    </div>
    <div>
      <div class="label">Description:</div> <div><DxTextBox v-model:value="currentTask.description" data-testid="tasks-edit-description"/></div>
    </div>
    <div>
      <div class="label">Due Date:</div> <div><DxDateBox v-model:value="currentTask.due_datetime" type="datetime" data-testid="tasks-add-due-datetime" :min="dateBoxConfigs.minDate"/></div>
    </div>
    <div>
      <div class="label">Completed: <input type="checkbox" id="edit-checkbox" data-testid="tasks-edit-complete-checkbox" v-model="completed"></div>
    </div>
    <div class="tasks-buttons flex">
      <div class="delete">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-edit-task-delete-button" @click="deleteCurrentTask" v-show="$store.state.tasks.permissions.del"/>
      </div>
      <div class="cancel-save">
        <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-edit-task-cancel-button" @click="showHomeView"/>
        <DxButton class="tasks-button" type="default" text="Save" data-testid="tasks-edit-task-save-button" @click="saveTask"/>
      </div>
    </div>
  </div>

  <div id="task-list-view" data-testid="tasks-list-tasks-view" v-show="isPanelVisible.list && $store.state.tasks.permissions.view">
    <h2>Tasklist</h2>
    <h3>Open Tasks</h3>
    <div class="tasks-list" v-for="task in openTasks" v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ formatDate(task.due_datetime) }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="$store.state.tasks.permissions.edit">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)" v-show="$store.state.tasks.permissions.del"/>
      </div>
    </div>
    <h3>Completed Tasks</h3>
    <div class="tasks-list" v-for="task in completedTasks" v-bind:key="task" v-bind:todo="task">
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ formatDate(task.due_datetime) }}</div>
      </div>
      <div class="tasks-actions">
        <input type="checkbox" data-testid="tasks-complete-checkbox" v-model="task.completed" @change="completeTask(task, $event)" v-show="$store.state.tasks.permissions.reopen">
        <DxButton class="tasks-button" type="normal" text="Delete" data-testid="tasks-list-open-tasks-delete-button" @click="deleteTask(task)" v-show="$store.state.tasks.permissions.del"/>
      </div>
    </div>
    <DxButton class="tasks-button" type="normal" text="Cancel" data-testid="tasks-list-tasks-cancel-button" @click="showHomeView"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

// import axios from "axios";
import DxButton from 'devextreme-vue/button';
import DxDateBox from 'devextreme-vue/date-box';
import DxTextBox from 'devextreme-vue/text-box';
import { Task } from '../interfaces/task';

interface DateBoxConfigs {
  minDate: Date
}

interface Event {
  action: string,
  task: Task,
  date: string,
}

interface Visibility {
  tasks: boolean,
  add: boolean,
  edit: boolean,
  list: boolean,
}

interface State {
  dateBoxConfigs: DateBoxConfigs
  config?: any,
  isPanelVisible: Visibility,
  currentCaseRecord?: any,
  object: string,
  object_id: string,
  currentIndex: number,
  currentTask: Task,
  taskName: string,
  taskDescription: string,
  taskDueDatetime: any,
  completed: boolean,
  update: boolean,
  id: number,
  isMenuUnavailable: boolean,
}

@Options({
  setup() {
    return {
    };
  },

  data: (): State => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    return {
      dateBoxConfigs: {
        minDate: today,
      },
      config: {},
      isMenuUnavailable: true,
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
      currentTask: { ID: 0, name: '', description: ''},
      taskName: '',
      taskDescription: '',
      taskDueDatetime: null,
      completed: false,
      update: false,
      id: 0
    }
  },

  created() {
    if ( window.VUETASKS && window.VUETASKS.config ) {
      this.config = window.VUETASKS.config;
      this.$store.commit('tasks/SET_VIEW_PERMISSION', this.config.tasks_view || false)
      this.$store.commit('tasks/SET_ADD_PERMISSION', this.config.tasks_add || false)
      this.$store.commit('tasks/SET_EDIT_PERMISSION', this.config.tasks_edit || false)
      this.$store.commit('tasks/SET_DELETE_PERMISSION', this.config.tasks_del || false)
      this.$store.commit('tasks/SET_REOPEN_PERMISSION', this.config.tasks_reopen || false)
      this.$store.commit('tasks/SET_UNDELETE_PERMISSION', this.config.tasks_undelete || false)

      if ( window.VUETASKS.config.currentCaseRecord ) {
        this.currentCaseRecord = this.config.currentCaseRecord;
        if (Object.keys(this.currentCaseRecord).length) {
          this.object = 'case'
          this.object_id = this.currentCaseRecord.get('id')
        }
      } else {
        this.currentCaseRecord = {id: 20}
      }
      this.$store.commit('tasks/SET_CASE', this.currentCaseRecord)
      this.fetchTasks()
      // this.$store.dispatch('tasks/setCase', this.currentCaseRecord)
    }
    if ( !this.isPanelVisible.list ) {
      this.showHomeView()
    }

  },

  components: {
    DxButton,
    DxDateBox,
    DxTextBox
  },

  computed: {
    openTasks() {
      return this.$store.getters['tasks/openTasks']
    },
    completedTasks() {
      return this.$store.getters['tasks/completedTasks']
    },
    topOpenTasks() {
      return this.$store.getters['tasks/topOpenTasks']
    } ,
    action() {
      return this.$store.state.taskActions
    }
  },

  methods: {
    isDateObject(date: any): boolean {
      return (date !== null && date.constructor.toString().indexOf('Date') > -1);
    },

    isDateString(date: any): boolean {
      return (date !== null && (new Date(date)).toString() !== 'Invalid Date') && !isNaN((new Date(date)).getTime());
    },

    zeroPad(num: number, places: number): string {
      return String(num).padStart(places, '0');
    },

    formatDate(value: any): any {
      if (this.isDateString(value)) {
        const date = new Date(value);
        const month = this.zeroPad(date.getMonth() + 1, 2);
        const day = this.zeroPad(date.getDate(), 2);
        const hour = this.zeroPad(date.getHours(), 2);
        const minutes = this.zeroPad(date.getMinutes(), 2);

        return `${month}/${day}/${date.getFullYear()} ${hour}:${minutes}`;
      }

      return null;
    },

    setEventHandler(handler: any) {
      this.handler = handler
    },

    sendEvent(event: Event) {
      this.$store.dispatch('tasks/sendEvent', event)
    },

    hidePanels() {
      this.isPanelVisible.tasks = false
      this.isPanelVisible.add = false
      this.isPanelVisible.edit = false
      this.isPanelVisible.list = false
    },

    showHomeView() {
      this.hidePanels()
      if ( this.hasOpenTasks() || this.isMenuUnavailable ) {
        this.isPanelVisible.tasks = true
      }
    },

    hasOpenTasks() {
      let openTasks = this.$store.getters.openTasks
      return openTasks ? openTasks.length > 0 : false
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
      this.currentTask = { name: '', description: ''}
      this.hidePanels()
      this.isPanelVisible.add = true
    },

    clearTaskFields() {
      this.taskName = ''
      this.taskDescription = ''
      this.taskDueDatetime = null;
      this.completed = false
    },

    saveNewTask() {
      if ( !this.validateRequiredFields() ) {
        return
      }
      this.$store.commit('tasks/ADD_TASK', this.currentTask)
      this.sendEvent({
        action: this.action().added,
        task: this.currentTask,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    saveTask() {
      if ( !this.validateRequiredFields() ) {
        return
      }
      this.$store.commit('tasks/UPDATE_TASK', this.currentTask)
      this.sendEvent({
        action: this.action().edited,
        task: this.currentTask,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    validateRequiredFields(): boolean {
      this.currentTask.due_datetime = this.isDateObject(this.currentTask.due_datetime)
          ? this.this.currentTask.due_datetime.toISOString()
          : null;
      return this.currentTask.name.length>0
    },

    listTasks() {
      this.hidePanels()
      this.isPanelVisible.list = true
    },
    
    editTask(task: Task) {
      this.hidePanels()
      this.isPanelVisible.edit = true
      this.currentTask = task
      this.currentIndex = task.ID
    },

    deleteCurrentTask() {
      if ( !this.currentTask ) {
        return
      }
      this.$store.commit('tasks/DELETE_TASK', this.currentTask)
      this.sendEvent({
        action: this.action().deleted,
        task: this.currentTask,
        time: new Date().toISOString()
      })
      this.saveTasks()
      this.showHomeView()
    },

    deleteTask(task: Task) {
      this.$store.commit('tasks/DELETE_TASK', task)
      this.sendEvent({
        action: this.action().deleted,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
    },

    undeleteTask(task: Task) {
      this.$store.commit('tasks/UNDELETE_TASK', task)
      this.sendEvent({
        action: this.action().undeleted,
        task: task,
        time: new Date().toISOString()
      })
      this.saveTasks()
    },

    completeTask(task: Task, event: any) {
      task.completed = event.target.checked
      this.sendEvent({
        action: event.target.checked?this.action().completed:this.action().reopened,
        task: task,
        time: new Date().toISOString()
      })
      this.$store.commit('tasks/COMPLETE_TASK', task)
      this.saveTasks()
    },
    
    async fetchTasks() {
      this.$store.dispatch('tasks/fetchTasks')
    },
    
    async saveTasks() {
      this.$store.dispatch('tasks/updateTasks')
    },

    // handleServerError(error: any) {
    //   if (error.response) {
    //     // client received an error response (5xx, 4xx)
    //     console.log("Server Error:", error)
    //   } else if (error.request) {
    //     // client never received a response, or request never left
    //     console.log("Network Error:", error)
    //   } else {
    //     console.log("Client Error:", error)
    //   }
    // },

  },

  mounted() {
  },

})
export default class TasksView extends Vue {}
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
.tasks-list:hover {
  background-color: #e1e4ea;
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
