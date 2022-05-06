import { createStore } from 'vuex'
import axios from "axios"
import { Task } from '../interfaces/task'

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine'
const maxOpenTasks = 3
interface State {
    tasks: [Task],
    newTask: Task,
    currentCase: any
}

export default createStore({
    state: {
        tasks: [],
        newTask: null,
        currentCase: ''
    },
    getters: {
        newTask: state => state.newTask,
        tasks: state => state.tasks,
        case: state => state.currentCase,
        openTasks: state => {
            return state.tasks.length>0 ? state.tasks.filter(task => !task['completed']) : []
        },
        topOpenTasks: state => {
            return state.tasks.length>0 ? state.tasks.filter(task => !task['completed']).slice(0, maxOpenTasks) : []
        },
        completedTasks: state => {
            return state.tasks.length>0 ? state.tasks.filter(task => task['completed']) : []
        },
    },
    mutations: {
        SET_TASKS (state, tasks) {
            state.tasks = tasks
        },
        ADD_TASK (state, task) {
            // state.tasks.push(task)
        },
        CLEAR_NEW_TODO (state) {
            // state.newTask = newTask
        },
        SET_CASE (state, currentCase) {
            state.currentCase = currentCase
        },
    },
    actions: {
        fetchTasks ({ commit }) {
            axios
                .get(taskEngineUrl +'/case/20/default')
                .then(r => r.data)
                .then(tasks => {
                    commit('SET_TASKS', tasks.tasks)
                })
        },
        addTask ({ commit, state }) {
            if (!state.newTask) {
                // do not add empty todos
                return
            }
            const task = {
                title: state.newTask,
                completed: false,
            }
            axios.post(taskEngineUrl+'/todos', task).then(_ => {
                commit('ADD_TASK', task)
            })
        },
        updateTask ({ commit, state }) {
            if (!state.newTask) {
                // do not add empty todos
                return
            }
            const task = {
                title: state.newTask,
                completed: false,
            }
            axios.put(taskEngineUrl+'/todos', task).then(_ => {
                commit('ADD_TASK', task)
            })
        },
        clearNewTodo ({ commit }) {
            commit('CLEAR_NEW_TASK')
        }
    }
})
