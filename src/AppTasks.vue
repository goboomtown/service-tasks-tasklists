<template>
  <div id="root-vue-tasks">
    <!-- <img alt="Vue logo" src="./assets/bt-logo.png"> -->
    <!-- <HomeScreen msg="Welcome to Boomtown Chat"/> -->
    <TasksView ref="tasksView" />
  </div>
</template>


<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TasksView from './views/tasks-view.vue'

@Options({
  components: {
    TasksView
  },

  computed: {
    getTasksView(): any {
      return this.$refs['tasksView'].instance;
    },
  },

  methods: {
    setEventHandler(handler: any) {
      // this.$refs.tasksView.setEventHandler(handler)
      this.$store.commit('tasks/SET_TASK_ACTION_EVENT_HANDLER', handler)
    },

    showAddView() {
      this.$refs.tasksView.showAddView()
    },

    showListView() {
      this.$refs.tasksView.showListView()
    },
  },

  created() {
    this.rand = Math.round(Math.random() * 1000)
  },

  data() {
    return {
      key: 0,
      rand: ''
    }
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


