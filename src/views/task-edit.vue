<template>
  <div
    id="task-edit-view"
    data-testid="tasks-edit-tasks-view"
    v-show="$store.state.tasks.permissions.view"
  >
    <h2>Edit Task</h2>
    <div>
      <div class="label">Name:</div>
      <div>
        <DxTextBox
          v-model:value="currentTask.name"
          data-testid="tasks-edit-name"
        />
      </div>
    </div>
    <div>
      <div class="label">Description:</div>
      <div>
        <DxTextBox
          v-model:value="currentTask.description"
          data-testid="tasks-edit-description"
        />
      </div>
    </div>
    <div>
      <div class="label">Due Date:</div>
      <div>
        <DxDateBox
          v-model:value="currentTask.due_datetime"
          type="datetime"
          data-testid="tasks-add-due-datetime"
          :min="dateBoxConfigs.minDate"
        />
      </div>
    </div>
    <div>
      <div class="label">
        Completed:
        <input
          type="checkbox"
          id="edit-checkbox"
          data-testid="tasks-edit-complete-checkbox"
          v-model="completed"
        />
      </div>
    </div>
    <div class="tasks-buttons flex">
      <div class="delete">
        <DxButton
          class="tasks-button"
          type="normal"
          text="Delete"
          data-testid="tasks-edit-task-delete-button"
          @click="deleteCurrentTask"
          v-show="$store.state.tasks.permissions.del"
        />
      </div>
      <div class="cancel-save">
        <DxButton
          class="tasks-button"
          type="normal"
          text="Cancel"
          data-testid="tasks-edit-task-cancel-button"
          @click="showHomeView"
        />
        <DxButton
          class="tasks-button"
          type="default"
          text="Save"
          data-testid="tasks-edit-task-save-button"
          @click="saveTask"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
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

interface State {
  dateBoxConfigs: DateBoxConfigs;
  config?: any;
}

@Options({
  // setup() {
  //   return {
  //   };
  // },

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
    tasks() {
      return this.$store.getters["tasks/tasks"];
    },
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
    currentTask() {
      const path = window.location.pathname.slice(1);
      const tokens = path.split("/");
      const tasks = this.tasks;
      const currentTask = tasks[tokens[1]]; // this.$store.getters["tasks/currentTask"];
      return currentTask || {};
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

    saveTask() {
      if (!this.validateRequiredFields()) {
        return;
      }
      this.$store.commit("tasks/UPDATE_TASK", this.currentTask);
      this.sendEvent({
        action: this.$store.state.tasks.taskActions.edited,
        task: this.currentTask,
        time: new Date().toISOString(),
      });
      this.saveTasks();
      this.showHomeView();
    },

    validateRequiredFields(): boolean {
      if (this.currentTask.due_datetime) {
        this.currentTask.due_datetime = this.isDateObject(
          this.currentTask.due_datetime
        )
          ? this.currentTask.due_datetime.toISOString()
          : null;
      }
      return this.currentTask.name.length > 0;
    },

    deleteCurrentTask() {
      this.$store.commit(
        "tasks/DELETE_TASK",
        this.$store.state.tasks.currentTask
      );
      this.sendEvent({
        action: this.$store.state.tasks.taskActions.deleted,
        task: this.$store.state.tasks.currentTask,
        time: new Date().toISOString(),
      });
      this.saveTasks();
      this.showHomeView();
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
export default class TaskEdit extends Vue {}
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
