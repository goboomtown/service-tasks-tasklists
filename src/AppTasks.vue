<template>
  <div id="root-vue-tasks">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import TaskView from "./views/task-view.vue";
import TaskAdd from "./views/task-add.vue";
import TaskEdit from "./views/task-edit.vue";
import TaskList from "./views/task-list.vue";

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
  },

  methods: {
    setEventHandler(handler: any) {
      // this.$refs.tasksView.setEventHandler(handler)
      this.$store.commit("tasks/SET_TASK_ACTION_EVENT_HANDLER", handler);
    },

    showAddView() {
      this.$router.push("/create");
    },

    showListView() {
      this.$router.push("/list");
    },
  },

  created() {
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
      } else {
        currentCaseRecord = { id: 14 };
      }
      this.$store.commit("tasks/SET_CASE", currentCaseRecord);
      this.$store.dispatch("tasks/fetchTasks");
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
