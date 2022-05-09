import {Commit, Module} from "vuex"
import axios from "axios"
import { Task } from '../interfaces/task'
import { ActionContext } from "vuex";
import { State } from '.';
import {Permissions} from "@/interfaces/permissions";
import {TaskAction} from "@/interfaces/task-action";

type Context = ActionContext<TasksState, State>;

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine'
const maxOpenTasks = 3

export interface TasksState {
    tasks: Array<Task>,
    update: boolean,
    newTask?: Task | null,
    permissions: Permissions,
    taskActions: TaskAction,
    currentCase: any,
    url: string,
    taskActionEventHandler: any,
}

export default {
    namespaced: true,
    state: (): TasksState => ({
        tasks: [],
        update: false,
        newTask: null,
        currentCase: '',
        permissions: {
            view: false,
            add: false,
            edit: false,
            del: false,
            reopen: false,
            undelete: false,
        },
        taskActions: {
            completed: 'task-completed',
            reopened: 'task-reopened',
            added:'task-added',
            edited: 'task-edited',
            deleted: 'task-deleted',
            undeleted: 'task-undeleted'
        },
        url: '',
        taskActionEventHandler: null
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
            return state.tasks&&state.tasks.length>0 ? state.tasks.filter(task => !task['completed']) : []
        },
        topOpenTasks: (state: TasksState) => {
            return state.tasks&&state.tasks.length>0 ? state.tasks.filter(task => !task['completed']).slice(0, maxOpenTasks) : []
        },
        completedTasks: (state: TasksState) => {
            return state.tasks&&state.tasks.length>0 ? state.tasks.filter(task => task['completed']) : []
        },
    },
    mutations: {
        SET_TASK_ACTION_EVENT_HANDLER (state: TasksState, handler: any) {
            state.taskActionEventHandler = handler
        },
        SET_TASKS (state: TasksState, tasks: Array<Task>) {
            for (let n = 0; n < tasks.length; n++) {
                tasks[n].ID = n
            }
            state.tasks = tasks
        },
        ADD_TASK (state: TasksState, task: Task) {
            state.tasks.push(task)
        },
        UPDATE_TASK (state: TasksState, task: Task) {
            state.tasks[task.ID] = task
        },
        DELETE_TASK (state: TasksState, task: Task) {
            state.tasks[task.ID].deleted = true
        },
        UNDELETE_TASK (state: TasksState, task: Task) {
            state.tasks[task.ID].deleted = false
        },
        COMPLETE_TASK (state: TasksState, task: Task) {
            state.tasks[task.ID].completed = task.completed
        },
        CLEAR_NEW_TASK (state: TasksState) {
            // state.newTask = newTask
        },
        SET_CASE (state: TasksState, currentCase: any) {
            state.currentCase = currentCase
            state.url = taskEngineUrl + '/case/' + currentCase.id + '/default'
        },
        SET_VIEW_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.view = permission
        },
        SET_ADD_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.add = permission
        },
        SET_EDIT_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.edit = permission
        },
        SET_DELETE_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.del = permission
        },
        SET_REOPEN_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.reopen = permission
        },
        SET_UNDELETE_PERMISSION (state: TasksState, permission: boolean) {
            state.permissions.undelete = permission
        },
    },
    actions: {
        sendEvent: function(context: Context, event: any): void {
            if ( context.state.taskActionEventHandler ) {
                context.state.taskActionEventHandler(event)
            }
        },
        setCase: function(context: Context, currentCase: any): void {
            context.commit('SET_CASE', currentCase)
        },
        fetchTasks: function(context: Context): void {
            axios
                .get(context.state.url)
                .then(r => r.data)
                .then(tasks => {
                    context.commit('SET_TASKS', tasks)
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
            // axios.post(context.state.url, task).then(_ => {
            //     context.commit('ADD_TASK', task)
            // })
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
            // axios.put(context.state.url, task).then(_ => {
            //     context.commit('ADD_TASK', task)
            // })
        },
        updateTasks: function(context: Context): void {
            const tasksJSON = JSON.stringify(context.state.tasks)
            const config = { headers: { 'Content-Type': 'text/plain' } }
            axios.put(context.state.url, tasksJSON, config).then(_ => {
                // this.fetchTasks(context)
            })
        },
        clearNewTask: function(context: Context): void {
            context.commit('CLEAR_NEW_TASK')
        }
    }
}
