import actions, { TasksState } from "../../../src/store/TasksModule";
import mutations from "../../../src/store/TasksModule";
import rootState, { State } from "@/store"
import { ActionContext } from "vuex";
import axios from "axios";

describe("fetchTasks", () => {
  it("fetch the tasks for a case", async () => {
    // mutations.mutations.SET_CASE(actions.state(), { id: 14 });
    const state = actions.state();
    // state.currentCase = { id: 14 };
    const actionContext: ActionContext<TasksState, State> = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      state: state, // here goes your auth state mock
      getters: {},
      rootState: { tasks: state }, // here goes your root state mock
      rootGetters: {},
    };
    actionContext.commit("tasks/SET_CASE", { id: 14 });
    actionContext.state.currentCase = { id: 14 };
    const taskEngineUrl =
      "https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine";
    actionContext.state.url =
      taskEngineUrl +
      "/case/" +
      actionContext.state.currentCase.id +
      "/default";
    await actions.actions.fetchTasks(actionContext);
    expect(actionContext.state.url).toBeDefined();
    expect(actionContext.state.tasks).toBeDefined();
  });
});
