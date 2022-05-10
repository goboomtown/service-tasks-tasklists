import axios from "axios";
import { Task } from "../interfaces/task";
import { ActionContext } from "vuex";
import { State } from ".";
import { Permissions } from "@/interfaces/permissions";
import { TaskAction } from "@/interfaces/task-action";

type Context = ActionContext<TasksState, State>;

const taskEngineUrl =
  "https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine";
const maxOpenTasks = 3;

export interface TasksState {
  tasks: Array<Task>;
  update: boolean;
  newTask?: Task | null;
  permissions: Permissions;
  taskActions: TaskAction;
  currentCase: any;
  currentTask: Task | null;
  url: string;
  taskActionEventHandler?: any;
}

export default {
  namespaced: true,
  state: (): TasksState => ({
    tasks: [],
    update: false,
    newTask: null,
    currentCase: "",
    currentTask: { ID: 0 },
    permissions: {
      view: false,
      add: false,
      edit: false,
      del: false,
      reopen: false,
      undelete: false,
    },
    taskActions: {
      completed: "task-completed",
      reopened: "task-reopened",
      added: "task-added",
      edited: "task-edited",
      deleted: "task-deleted",
      undeleted: "task-undeleted",
    },
    url: "",
    taskActionEventHandler: null,
  }),
  getters: {
    newTask: (state: TasksState) => {
      state.newTask;
    },
    tasks: (state: TasksState) => {
      return state.tasks;
    },
    currentTask: (state: TasksState) => {
      return state.currentTask;
    },
    taskWithId: (state: TasksState) => (id: number) => {
      return state.tasks.find((task) => task.ID === id);
    },
    case: (state: TasksState) => {
      state.currentCase;
    },
    openTasks: (state: TasksState) => {
      return state.tasks && state.tasks.length > 0
        ? state.tasks.filter((task) => !task["completed"] && !task["deleted"])
        : [];
    },
    topOpenTasks: (state: TasksState) => {
      return state.tasks && state.tasks.length > 0
        ? state.tasks
            .filter((task) => !task["completed"] && !task["deleted"])
            .slice(0, maxOpenTasks)
        : [];
    },
    completedTasks: (state: TasksState) => {
      return state.tasks && state.tasks.length > 0
        ? state.tasks.filter((task) => task["completed"] && !task["deleted"])
        : [];
    },
  },
  mutations: {
    SET_TASK_ACTION_EVENT_HANDLER(state: TasksState, handler: any) {
      state.taskActionEventHandler = handler;
    },
    SET_TASKS(state: TasksState, tasks: Array<Task>) {
      for (let n = 0; n < tasks.length; n++) {
        tasks[n].ID = n;
      }
      state.update = tasks.length > 0;
      state.tasks = tasks;
    },
    SET_CURRENT_TASK(state: TasksState, task: Task) {
      state.currentTask = task;
    },
    CLEAR_CURRENT_TASK(state: TasksState) {
      state.currentTask = { ID: 0, name: "", description: "" };
    },
    ADD_TASK(state: TasksState, task: Task) {
      state.tasks.push(task);
    },
    UPDATE_TASK(state: TasksState, task: Task) {
      state.tasks[task.ID] = task;
    },
    DELETE_TASK(state: TasksState, task: Task) {
      const newTask: Task = state.tasks[task.ID];
      if (newTask) {
        newTask.deleted = true;
        state.tasks[task.ID] = newTask;
      }
    },
    UNDELETE_TASK(state: TasksState, task: Task) {
      state.tasks[task.ID].deleted = false;
    },
    COMPLETE_TASK(state: TasksState, task: Task) {
      state.tasks[task.ID].completed = task.completed;
    },
    CLEAR_NEW_TASK(state: TasksState) {
      // state.newTask = newTask
    },
    SET_CASE(state: TasksState, currentCase: any) {
      state.currentCase = currentCase;
      state.url = taskEngineUrl + "/case/" + currentCase.id + "/default";
    },
    SET_VIEW_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.view = permission;
    },
    SET_ADD_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.add = permission;
    },
    SET_EDIT_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.edit = permission;
    },
    SET_DELETE_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.del = permission;
    },
    SET_REOPEN_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.reopen = permission;
    },
    SET_UNDELETE_PERMISSION(state: TasksState, permission: boolean) {
      state.permissions.undelete = permission;
    },
  },
  actions: {
    sendEvent: function (context: Context, event: any): void {
      if (context.state.taskActionEventHandler) {
        context.state.taskActionEventHandler(event);
      }
    },
    setCase: function (context: Context, currentCase: any): void {
      context.commit("SET_CASE", currentCase);
    },
    setCurrentTask: function (context: Context, task: Task): void {
      context.commit("SET_CURRENT_TASK", task);
    },
    fetchTasks: function (context: Context): void {
      axios
        .get(context.state.url)
        .then((r) => r.data)
        .then((tasks) => {
          context.commit("SET_TASKS", tasks.tasks);
        });
    },
    addTask: function (context: Context): void {
      if (!context.state.newTask) {
        // do not add empty todos
        return;
      }
      const task = {
        name: context.state.newTask,
        completed: false,
      };
      // axios.post(context.state.url, task).then(_ => {
      //     context.commit('ADD_TASK', task)
      // })
    },
    updateTask: function (context: Context): void {
      if (!context.state.newTask) {
        // do not add empty todos
        return;
      }
      const task = {
        title: context.state.newTask,
        completed: false,
      };
      // axios.put(context.state.url, task).then(_ => {
      //     context.commit('ADD_TASK', task)
      // })
    },
    updateTasks: async function (context: Context): Promise<void> {
      const tasks = { tasks: context.state.tasks };
      const tasksJSON = JSON.stringify(tasks);
      const config = { headers: { "Content-Type": "text/plain" } };
      if (context.state.update) {
        axios
          .put(context.state.url, tasksJSON, config)
          .then((response) => {
            // this.fetchTasks(context)
            // context.dispatch("fetchTasks");
            console.log("here");
          })
          .catch(function (error) {
            if (error.response) {
              // get response with a status code not in range 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // no response
              console.log(error.request);
              // instance of XMLHttpRequest in the browser
              // instance ofhttp.ClientRequest in node.js
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      } else {
        axios.post(context.state.url, tasksJSON, config).then((_) => {
          // this.fetchTasks(context)
          console.log("here");
        });
      }
    },
    clearNewTask: function (context: Context): void {
      context.commit("CLEAR_NEW_TASK");
    },
  },
};
