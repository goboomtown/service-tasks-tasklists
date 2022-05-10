<template>
  <div
    id="task-list-view"
    data-testid="tasks-list-tasks-view"
    v-show="$store.state.tasks.permissions.view"
  >
    <h2>Tasklist</h2>
    <h3>Open Tasks</h3>
    <div
      class="tasks-list"
      v-for="task in openTasks"
      v-bind:key="task"
      v-bind:todo="task"
    >
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ formatDate(task.due_datetime) }}</div>
      </div>
      <div class="tasks-actions">
        <input
          type="checkbox"
          data-testid="tasks-complete-checkbox"
          v-model="task.completed"
          @change="completeTask(task, $event)"
          v-show="$store.state.tasks.permissions.edit"
        />
        <DxButton
          class="tasks-button"
          type="normal"
          text="Delete"
          data-testid="tasks-list-open-tasks-delete-button"
          @click="deleteTask(task)"
          v-show="$store.state.tasks.permissions.del"
        />
      </div>
    </div>
    <h3>Completed Tasks</h3>
    <div
      class="tasks-list"
      v-for="task in completedTasks"
      v-bind:key="task"
      v-bind:todo="task"
    >
      <div class="task-name-description">
        <div class="task-name">{{ task.name }}</div>
        <div class="task-description">{{ formatDate(task.due_datetime) }}</div>
      </div>
      <div class="tasks-actions">
        <input
          type="checkbox"
          data-testid="tasks-complete-checkbox"
          v-model="task.completed"
          @change="completeTask(task, $event)"
          v-show="$store.state.tasks.permissions.reopen"
        />
        <DxButton
          class="tasks-button"
          type="normal"
          text="Delete"
          data-testid="tasks-list-open-tasks-delete-button"
          @click="deleteTask(task)"
          v-show="$store.state.tasks.permissions.del"
        />
      </div>
    </div>
    <DxButton
      class="tasks-button"
      type="normal"
      text="Cancel"
      data-testid="tasks-list-tasks-cancel-button"
      @click="showHomeView"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

// import axios from "axios";
import DxButton from "devextreme-vue/button";
import DxDateBox from "devextreme-vue/date-box";
import DxTextBox from "devextreme-vue/text-box";
import { Task } from "../interfaces/task";

interface DateBoxConfigs {
  minDate: Date;
}

interface Event {
  action: string;
  task: Task;
  date: string;
}

interface Visibility {
  tasks: boolean;
  add: boolean;
  edit: boolean;
  list: boolean;
}

interface State {
  dateBoxConfigs: DateBoxConfigs;
  config?: any;
}

@Options({
  setup() {
    return {};
  },

  data: (): State => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    return {
      dateBoxConfigs: {
        minDate: today,
      },
      config: {},
    };
  },
  components: {
    DxButton,
    DxDateBox,
    DxTextBox,
  },

  computed: {
    openTasks() {
      return this.$store.getters["tasks/openTasks"];
    },
    completedTasks() {
      return this.$store.getters["tasks/completedTasks"];
    },
    topOpenTasks() {
      return this.$store.getters["tasks/topOpenTasks"];
    },
    action() {
      return this.$store.state.taskActions;
    },
  },

  methods: {
    isDateObject(date: any): boolean {
      return date !== null && date.constructor.toString().indexOf("Date") > -1;
    },

    isDateString(date: any): boolean {
      return (
        date !== null &&
        new Date(date).toString() !== "Invalid Date" &&
        !isNaN(new Date(date).getTime())
      );
    },

    zeroPad(num: number, places: number): string {
      return String(num).padStart(places, "0");
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
      this.handler = handler;
    },

    sendEvent(event: Event) {
      this.$store.dispatch("tasks/sendEvent", event);
    },

    showHomeView() {
      window.location.replace(window.origin + "/");
    },

    hasOpenTasks() {
      let openTasks = this.$store.getters.openTasks;
      return openTasks ? openTasks.length > 0 : false;
    },
    addTask() {
      this.$store.commit("tasks/CLEAR_CURRENT_TASK");

      this.currentTask = { name: "", description: "" };
      this.hidePanels();
      this.isPanelVisible.add = true;
    },

    deleteTask(task: Task) {
      this.$store.commit("tasks/DELETE_TASK", task);
      this.sendEvent({
        action: this.$store.state.tasks.taskActions.deleted,
        task: task,
        time: new Date().toISOString(),
      });
      this.saveTasks();
    },

    undeleteTask(task: Task) {
      this.$store.commit("tasks/UNDELETE_TASK", task);
      this.sendEvent({
        action: this.$store.state.tasks.taskActions.undeleted,
        task: task,
        time: new Date().toISOString(),
      });
      this.saveTasks();
    },

    completeTask(task: Task, event: any) {
      task.completed = event.target.checked;
      this.sendEvent({
        action: event.target.checked
          ? this.$store.state.tasks.taskActions.completed
          : this.$store.state.tasks.taskActions.reopened,
        task: task,
        time: new Date().toISOString(),
      });
      this.$store.commit("tasks/COMPLETE_TASK", task);
      this.saveTasks();
    },

    async fetchTasks() {
      this.$store.dispatch("tasks/fetchTasks");
    },

    async saveTasks() {
      this.$store.dispatch("tasks/updateTasks");
      // this.$store.dispatch("tasks/fetchTasks");
    },
  },
})
export default class TaskList extends Vue {}
</script>

<style scoped>
div {
  color: #4f4f4f;
}
h2 {
  color: #626363;
  font-size: 1rem;
}
h3 {
  color: #626363;
  font-size: 0.95rem;
}
.label {
  font-size: 0.8rem;
  line-height: 2rem;
}
.tasks-buttons {
  text-align: right;
  padding: 1rem 0;
}
.flex {
  display: flex;
}
.delete {
  flex: 1;
  text-align: left;
}
.cancel-save {
}
.tasks-button {
  margin: 0 0.5rem;
}
.tasks-list {
  display: flex;
}
.tasks-list:hover {
  background-color: #e1e4ea;
}
.task-name-description {
  flex: 1;
}
.task-name {
  font-weight: bold;
  font-size: 0.9rem;
}
.task-description {
  font-size: 0.8rem;
}
.tasks-actions {
  align-items: center;
  text-align: right;
  padding: 1rem;
}
.tasks-actions input[type="checkbox"] {
  margin-right: 1rem;
}
.tasks-actions span {
  cursor: default;
}
</style>
