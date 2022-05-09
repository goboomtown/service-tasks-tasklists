import Vue from "vue";
import Vuex from "vuex";
import { createLogger } from "vuex";
import tasksModule, { TasksState } from "./TasksModule";

export interface State {
  tasks: TasksState;
}

const store = new Vuex.Store<State>({
  plugins: [createLogger()],
  modules: {
    tasks: tasksModule,
  },
});

export default store;
