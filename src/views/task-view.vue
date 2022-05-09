<template>
  <div
    id="tasks-view"
    data-testid="tasks-show-tasks-view"
    v-show="$store.state.tasks.permissions.view"
  >
    <h2>Tasks</h2>
    <div
      class="tasks-list"
      v-for="task in topOpenTasks"
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
        <span
          data-testid="tasks-edit-task-button"
          @click="editTask(task)"
          v-show="$store.state.tasks.permissions.edit"
          >&gt;</span
        >
      </div>
    </div>
    <div v-show="isMenuUnavailable">
      <DxButton
        class="tasks-button"
        type="normal"
        text="Add Task"
        data-testid="tasks-show-tasks-add-button"
        @click="showAddView"
        v-show="$store.state.tasks.permissions.add"
      />
      <DxButton
        class="tasks-button"
        type="normal"
        text="List Tasks"
        data-testid="tasks-show-tasks-list-button"
        @click="showListView"
      />
    </div>
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
  isPanelVisible: Visibility;
  currentIndex: number;
  currentTask: Task;
  taskName: string;
  taskDescription: string;
  taskDueDatetime: any;
  completed: boolean;
  update: boolean;
  id: number;
  isMenuUnavailable: boolean;
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
      isMenuUnavailable: true,
      isPanelVisible: {
        tasks: false,
        add: false,
        edit: false,
        list: false,
      },
      currentIndex: 0,
      currentTask: { ID: 0, name: "", description: "" },
      taskName: "",
      taskDescription: "",
      taskDueDatetime: null,
      completed: false,
      update: false,
      id: 0,
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
      return this.$store.state.tasks.taskActions;
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

    hasOpenTasks() {
      let openTasks = this.$store.getters.openTasks;
      return openTasks ? openTasks.length > 0 : false;
    },

    showAddView() {
      window.location.replace(window.origin + "/create");
    },

    showListView() {
      window.location.replace(window.origin + "/list");
    },

    addTask() {
      this.$store.commit("tasks/CLEAR_CURRENT_TASK");
    },

    editTask(task: Task) {
      this.$store.dispatch("tasks/setCurrentTask", task);
      window.location.replace(window.origin + "/edit/" + task.ID);
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
export default class TaskView extends Vue {}
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
