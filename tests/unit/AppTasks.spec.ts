import { shallowMount } from "@vue/test-utils";
import App from "../../src/AppTasks.vue";

describe("AppTasks.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(App, {
      propsData: {},
      mocks: {},
      stubs: {},
    });
  });

  afterEach(() => {});

  // test('is a Vue instance', () => {
  //   expect(wrapper.isVueObject()).toBe(true)
  // });

  test("can complete a task", async () => {
    expect(
      wrapper.findComponent('[data-testid="tasks-complete-checkbox"]').exists()
    );
  });
});
