import Vue from 'vue'
import Vuex from 'vuex'
import {createStore, createLogger} from "vuex"
import tasksModule, { TasksState } from './TasksModule'

// Vue.use(Vuex)

export interface State {
    tasks: TasksState;
}

const store =  new Vuex.Store<State>({
    plugins: [createLogger()],
    modules: {
        tasks: tasksModule
    }
})

export default store
