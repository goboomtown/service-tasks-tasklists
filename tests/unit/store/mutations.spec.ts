import mutations from "../../../src/store/TasksModule";

const state = mutations.state();
const testTasks = [
  { ID: 0, name: "Task 1", completed: false, deleted: false },
  { ID: 1, name: "Task 2", completed: false, deleted: false },
  { ID: 2, name: "Task 3", completed: true, deleted: false },
  { ID: 3, name: "Task 4", completed: false, deleted: true },
];

describe("SET_TASKS", () => {
  it("sets the tasks", () => {
    const tasks = [
      { ID: 0, name: "Task 1" },
      { ID: 1, name: "Task 2" },
    ];
    mutations.mutations.SET_TASKS(state, tasks);
    expect(state.tasks).toMatchObject(tasks);
  });
});

describe("SET_CURRENT_TASK", () => {
  it("sets the current task", () => {
    const task = { ID: 10, name: "Task 10" };
    mutations.mutations.SET_CURRENT_TASK(state, task);
    expect(state.currentTask).toMatchObject(task);
  });
});

describe("ADD_TASK", () => {
  it("adds a task", () => {
    const task = { ID: 4, name: "Task 5" };
    const beforeCount = state.tasks.length;
    mutations.mutations.ADD_TASK(state, task);
    expect(state.tasks.length).toBeGreaterThan(beforeCount);
  });
});

describe("UPDATE_TASK", () => {
  it("updates a task", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const task = { ID: 0, name: "Task 1", description: "Description" };
    const beforeCount = state.tasks.length;
    mutations.mutations.UPDATE_TASK(state, task);
    expect(state.tasks.length).toBe(beforeCount);
    expect(state.tasks[0].description).toBe(task.description);
  });
});

describe("DELETE_TASK", () => {
  it("deletes a task", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const task = { ID: 3, name: "Task 4" };
    mutations.mutations.DELETE_TASK(state, task);
    expect(state.tasks[3].deleted).toBeTruthy();
  });
});

describe("UNDELETE_TASK", () => {
  it("undeletes a task", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const task = { ID: 3, name: "Task 4" };
    mutations.mutations.UNDELETE_TASK(state, task);
    expect(state.tasks[3].deleted).toBeFalsy();
  });
});

describe("COMPLETE_TASK", () => {
  it("completes a task", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const task = { ID: 0, name: "Task 1", completed: true };
    mutations.mutations.COMPLETE_TASK(state, task);
    expect(state.tasks[task.ID].completed).toBeTruthy();
  });
  it("reopens a task", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const task = { ID: 2, name: "Task 3", completed: false };
    mutations.mutations.COMPLETE_TASK(state, task);
    expect(state.tasks[task.ID].completed).toBeFalsy();
  });
});

// CLEAR_NEW_TASK(state: TasksState) {
//   // state.newTask = newTask
// },
// SET_CASE(state: TasksState, currentCase: any) {
//   state.currentCase = currentCase;
//   state.url = taskEngineUrl + "/case/" + currentCase.id + "/default";
// },
// SET_VIEW_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.view = permission;
// },
// SET_ADD_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.add = permission;
// },
// SET_EDIT_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.edit = permission;
// },
// SET_DELETE_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.del = permission;
// },
// SET_REOPEN_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.reopen = permission;
// },
// SET_UNDELETE_PERMISSION(state: TasksState, permission: boolean) {
//   state.permissions.undelete = permission;
// },
