<template>
  <div id="root">
    <!-- <img alt="Vue logo" src="./assets/bt-logo.png"> -->
    <!-- <HomeScreen msg="Welcome to Boomtown Chat"/> -->
    <TasksView />
  </div>
</template>

<script>
// import HomeScreen from './components/HomeScreen.vue'
import TasksView from './views/tasks-page.vue'

export default {
  name: 'App',
  components: {
    // HomeScreen,
    TasksView
  }
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
