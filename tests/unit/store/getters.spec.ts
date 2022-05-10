import getters from "../../../src/store/TasksModule";
import mutations from "../../../src/store/TasksModule";

const state = getters.state();
const testTasks = [
  { ID: 0, name: "Task 1", completed: false, deleted: false },
  { ID: 1, name: "Task 2", completed: false, deleted: false },
  { ID: 2, name: "Task 3", completed: true, deleted: false },
  { ID: 3, name: "Task 4", completed: false, deleted: true },
];

describe("openTasks", () => {
  it("get the open tasks", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const actual = getters.getters.openTasks(state);
    expect(actual.length).toBe(2);
    expect(actual).toStrictEqual([testTasks[0], testTasks[1]]);
  });
});

describe("completedTasks", () => {
  it("get the completed tasks", () => {
    mutations.mutations.SET_TASKS(state, testTasks);
    const actual = getters.getters.completedTasks(state);
    expect(actual.length).toBe(1);
    expect(actual).toStrictEqual([testTasks[2]]);
  });
});
