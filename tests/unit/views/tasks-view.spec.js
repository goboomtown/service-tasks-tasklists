import { shallowMount } from '@vue/test-utils'
import TasksView from '../../../src/views/tasks-view.vue'
import App from '../../../src/AppTasks.vue'

describe('tasks-view.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TasksView, {
            propsData: {},
            config: {},
            mocks: {},
            stubs: {},
        });
    });

    afterEach(() => {
    });

    test('can complete a task', async () => {
        expect(wrapper.findComponent('[data-testid="tasks-complete-checkbox"]').exists())
    })

    test('can you show tasks view', async () => {
        wrapper.showHomeView()
        expect(wrapper.showTasksView).toBe(true)
    })
})
