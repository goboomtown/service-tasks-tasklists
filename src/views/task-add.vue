<template>
  <div id="task-add-view" data-testid="tasks-add-tasks-view">
    <h2>Add Task</h2>
    <div>
      <div class="label">Name:</div>
      <div>
        <DxTextBox
          v-model:value="currentTask.name"
          data-testid="tasks-add-name"
        />
      </div>
    </div>
    <div>
      <div class="label">Description:</div>
      <div>
        <DxTextBox
          v-model:value="currentTask.description"
          data-testid="tasks-add-description"
          :min="dateBoxConfigs.minDate"
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
    <div class="tasks-buttons">
      <DxButton
        class="tasks-button"
        type="normal"
        text="Cancel"
        data-testid="tasks-add-task-cancel-button"
        @click="showHomeView"
      />
      <DxButton
        class="tasks-button"
        type="default"
        text="Save"
        data-testid="tasks-add-task-save-button"
        @click="saveNewTask"
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

interface State {
  dateBoxConfigs: DateBoxConfigs;
  config?: any;
  // currentTask: Task;
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
      // currentTask: { ID: 0, name: "", description: "" },
    };
  },
  components: {
    DxButton,
    DxDateBox,
    DxTextBox,
  },

  computed: {
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

    showHomeView() {
      window.location.replace(window.origin + "/");
    },

    saveNewTask() {
      if (!this.validateRequiredFields()) {
        return;
      }
      this.$store.commit("tasks/ADD_TASK", this.currentTask);
      this.sendEvent({
        action: this.$store.state.tasks.taskActions.added,
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

    async saveTasks() {
      this.$store.dispatch("tasks/updateTasks");
      // this.$store.dispatch("tasks/fetchTasks");
    },
  },
})
export default class TaskAdd extends Vue {}
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
