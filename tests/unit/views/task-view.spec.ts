import { shallowMount } from "@vue/test-utils";
import TaskView from "../../../src/views/task-view.vue";

describe("task-view.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TaskView, {
      propsData: {},
      config: {},
      mocks: {},
      stubs: {},
    });
  });
  test("can complete a task", async () => {
    expect(
      wrapper.findComponent('[data-testid="tasks-complete-checkbox"]').exists()
    );
  });
});
