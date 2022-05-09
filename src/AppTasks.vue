<template>
  <div id="root-vue-tasks">
    <component :is="currentView" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TaskView from "./views/task-view.vue";
import TaskAdd from "./views/task-add.vue";
import TaskEdit from "./views/task-edit.vue";
import TaskList from "./views/task-list.vue";

const routes = {
  "/": TaskView,
  "/create": TaskAdd,
};

interface State {
  key: number;
  rand: string;
  currentPath: string;
}

@Options({
  components: {
    TaskView,
    TaskAdd,
    TaskEdit,
    TaskList,
  },

  computed: {
    getTasksView(): any {
      return this.$refs["taskView"].instance;
    },
    currentView(): any {
      const path = window.location.pathname.slice(1);
      const tokens = path.split("/");
      switch (tokens[0]) {
        case "create":
          return TaskAdd;
        case "edit":
          return TaskEdit;
        case "list":
          return TaskList;
        default:
          return TaskView;
      }
    },
  },

  methods: {
    setEventHandler(handler: any) {
      // this.$refs.tasksView.setEventHandler(handler)
      this.$store.commit("tasks/SET_TASK_ACTION_EVENT_HANDLER", handler);
    },

    showAddView() {
      // this.$refs.tasksView.showAddView();
      window.open(window.location + "/");
    },

    showListView() {
      this.$refs.tasksView.showListView();
      window.open(window.location + "/list");
    },
  },

  created() {
    window.addEventListener("hashchange", () => {
      this.currentPath = window.location.pathname;
    });
    if (window.VUETASKS && window.VUETASKS.config) {
      this.config = window.VUETASKS.config;
      this.$store.commit(
        "tasks/SET_VIEW_PERMISSION",
        this.config.tasks_view || false
      );
      this.$store.commit(
        "tasks/SET_ADD_PERMISSION",
        this.config.tasks_add || false
      );
      this.$store.commit(
        "tasks/SET_EDIT_PERMISSION",
        this.config.tasks_edit || false
      );
      this.$store.commit(
        "tasks/SET_DELETE_PERMISSION",
        this.config.tasks_del || false
      );
      this.$store.commit(
        "tasks/SET_REOPEN_PERMISSION",
        this.config.tasks_reopen || false
      );
      this.$store.commit(
        "tasks/SET_UNDELETE_PERMISSION",
        this.config.tasks_undelete || false
      );

      let currentCaseRecord = null;
      if (window.VUETASKS.config.currentCaseRecord) {
        currentCaseRecord = this.config.currentCaseRecord;
        // if (Object.keys(currentCaseRecord).length) {
        //   this.object = "case";
        //   this.object_id = currentCaseRecord.get("id");
        // }
      } else {
        currentCaseRecord = { id: 14 };
      }
      this.$store.commit("tasks/SET_CASE", currentCaseRecord);
      this.$store.dispatch("tasks/fetchTasks");
      // this.$store.dispatch('tasks/setCase', this.currentCaseRecord)
    }
  },
  data: (): State => {
    return {
      key: 0,
      rand: "",
      currentPath: window.location.pathname,
    };
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html,
body {
  min-height: 99%;
  height: 99%;
  width: 99%;
  margin-left: 5px;
}

#root {
  height: 99%;
}

* {
  box-sizing: border-box;
}

.app {
  @import "./themes/generated/variables.base.scss";
  background-color: darken($base-bg, 5);
  display: flex;
}
</style>
