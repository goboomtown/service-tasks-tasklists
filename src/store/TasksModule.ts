import {Commit, Module} from "vuex"
import axios from "axios"
import { Task } from '../interfaces/task'
import { ActionContext } from "vuex";
import { State } from '.';

type Context = ActionContext<TasksState, State>;

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine'
const maxOpenTasks = 3

export interface TasksState {
    tasks: Array<Task>,
    newTask?: Task | null,
    currentCase: any,
    url: string
}

export default {
    namespaced: true,
    state: (): TasksState => ({
        tasks: Array<Task>(),
        newTask: null,
        currentCase: '',
        url: ''
    }),
    getters: {
        newTask: (state: TasksState) => {
            state.newTask
        },
        tasks: (state: TasksState) => {
            state.tasks
        },
        case: (state: TasksState) => {
            state.currentCase
        },
        openTasks: (state: TasksState) => {
            return state.tasks.length>0 ? state.tasks.filter(task => !task['completed']) : []
        },
        topOpenTasks: (state: TasksState) => {
            return state.tasks.length>0 ? state.tasks.filter(task => !task['completed']).slice(0, maxOpenTasks) : []
        },
        completedTasks: (state: TasksState) => {
            return state.tasks.length>0 ? state.tasks.filter(task => task['completed']) : []
        },
    },
    mutations: {
        SET_TASKS: function(state: TasksState, tasks: Array<Task>) {
            state.tasks = tasks
        },
        ADD_TASK (state: TasksState, task: Task) {
            // state.tasks.push(task)
        },
        CLEAR_NEW_TASK (state: TasksState) {
            // state.newTask = newTask
        },
        SET_CASE (state: TasksState, currentCase: any) {
            state.currentCase = currentCase
            state.url = taskEngineUrl + '/case/' + currentCase.id + '/default'
        },
    },
    actions: {
        fetchTasks: function(context: Context): void {
            axios
                .get(context.state.url)
                .then(r => r.data)
                .then(tasks => {
                    context.commit('SET_TASKS', tasks.tasks)
                })
        },
        addTask: function(context: Context): void {
            if (!context.state.newTask) {
                // do not add empty todos
                return
            }
            const task = {
                name: context.state.newTask,
                completed: false,
            }
            axios.post(context.state.url, task).then(_ => {
                context.commit('ADD_TASK', task)
            })
        },
        updateTask: function(context: Context): void {
            if (!context.state.newTask) {
                // do not add empty todos
                return
            }
            const task = {
                title: context.state.newTask,
                completed: false,
            }
            axios.put(taskEngineUrl+'/todos', task).then(_ => {
                context.commit('ADD_TASK', task)
            })
        },
        clearNewTodo: function(context: Context): void {
            context.commit('CLEAR_NEW_TASK')
        }
    }
}
