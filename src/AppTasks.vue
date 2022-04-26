<template>
  <div id="root">
    <!-- <img alt="Vue logo" src="./assets/bt-logo.png"> -->
    <!-- <HomeScreen msg="Welcome to Boomtown Chat"/> -->
    <TasksView :key="key" ref="tasksView" />
  </div>
</template>

<script>
// import HomeScreen from './components/HomeScreen.vue'
import TasksView from './views/tasks-view.vue'

export default {
  name: 'App',

  components: {
    TasksView
  },

  computed: {
    getTasksView() {
      return this.$refs['tasksView'].instance;
    },
  },

  methods: {
    showAddView() {
      this.$refs.tasksView.showAddView()
    },
    showListView() {
      this.$refs.tasksView.showListView()
    },
    forceUpdate() {
      this.key++;
    },
    // async onMenuAddTask() {
    //   console.log('onMenuAddTask');
    // }
  },

  created() {
    this.rand = Math.round(Math.random() * 1000)
  },

  mounted() {
    this.$refs.tasksView.showAddView()
    window.test = this
    // Event.$on("com.goboomtown.tasksview.menuAddTask", group => {
    //   this.onMenuAddTask();
    // });
  },

  data() {
    return {
      key: 0,
      rand: ''
    }
  },

}

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
