<template>
<!--  <div>-->
<!--    <h2 class="content-block">Tasks</h2>-->
<!--    <DxDataGrid-->
<!--          :data-source="tasks"-->
<!--          key-expr="ID"-->
<!--          :columns="columns"-->
<!--          :show-borders="true">-->

<!--    <dx-column data-field="name"-->
<!--               caption="Name"-->
<!--               :width="90"-->
<!--               :hiding-priority="2" />-->

<!--    <dx-column-->
<!--        data-field="description"-->
<!--        caption="Description"-->
<!--        :width="190"-->
<!--        :hiding-priority="8"-->
<!--    />-->

<!--    <dx-column-->
<!--        data-field="completed"-->
<!--        caption="Completed"-->
<!--        :hiding-priority="6"-->
<!--    />-->

<!--    </DxDataGrid>-->

<!--&lt;!&ndash;    <form class="task-form" @submit.prevent="onSubmit">&ndash;&gt;-->
<!--&lt;!&ndash;      <dx-form :form-data="formData" >&ndash;&gt;-->
<!--&lt;!&ndash;      </dx-form>&ndash;&gt;-->
<!--&lt;!&ndash;    </form>&ndash;&gt;-->
<!--  </div>-->

  <div>
    <h2 class="content-block">Tasks</h2>

    <table>
<!--    <div class="columns medium-4" v-for="(task, index) in tasks " v-bind:key="task" v-bind:todo="task">-->
        <tr v-for="(task, index) in tasks " v-bind:key="task" v-bind:todo="task">
          <td>{{ task.name }}<br>{{ task.description }}</td>
          <td><input type="checkbox" id="checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          <td><button @click="editTask(task, index)">-></button></td>
        </tr>
<!--    </div>-->
    </table>

    <div>
      <h2>Add Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div><button @click="addTask">Add</button></div>
    </div>

    <div>
      <h2>Edit Task</h2>
      <div>Name: <input v-model="taskName"></div>
      <div>Description: <input v-model="taskDescription"></div>
      <div>Completed: <input type="checkbox" id="edit-checkbox" v-model="completed"></div>
      <div><button @click="deleteTask">Delete</button></div>
      <div><button @click="updateTask">Update</button></div>
    </div>

    <div>
      <h2>Tasklist</h2>
      <b>Open Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in openTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="opencheckbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
      <b>Completed Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in completedTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="completed-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
      <b>Deleted Tasks</b>
      <div class="columns medium-4" v-for="(task, index) in deletedTasks " v-bind:key="task" v-bind:todo="task">
        <table>
          <tr>
            <td>{{ index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td><input type="checkbox" id="deleted-checkbox" v-model="task.completed" @change="completeTask($event, index)"></td>
          </tr>
        </table>
      </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";
// import DxForm, {
//   // DxItem,
//   // DxEmailRule,
//   // DxRequiredRule,
//   // DxLabel,
//   // DxButtonItem,
//   // DxButtonOptions
// } from "devextreme-vue/form";
// import DxDataGrid, {
//   DxColumn,
// } from "devextreme-vue/data-grid";
import { reactive } from 'vue';

const taskEngineUrl = 'https://us-central1-developer-playground-328319.cloudfunctions.net/service-tasks-engine';

export default {
  setup() {
    const formData = reactive({
      email:"",
      password:""
    });

    async function onSubmit() {
      const { email, password } = formData;
      console.log(email, password)
    }

    return {
      formData,
      onSubmit
    };
  },

  components: {
    // DxDataGrid,
    // DxColumn,
    // // DxForm,
    // DxEmailRule,
    // DxRequiredRule,
    // DxItem,
    // DxLabel,
    // DxButtonItem,
    // DxButtonOptions
  },

  data() {
    return {
      object: 'case',
      object_id: '14',
      currentIndex: 0,
      currentTask: null,
      tasks: [],
      openTasks: [],
      completedTasks: [],
      deletedTasks: [],
      taskName: '',
      taskDescription: '',
      completed: false,
      update: false,
      columns: ['name', 'description', 'completed'],
      id: 0,
    }
  },

  methods: {
    async getTasks() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        const response = await axios.get(url)
        const tasks = response.data.tasks
        if ( tasks ) {
          this.update = true
          this.id = 0
          this.tasks = tasks;
          console.log(this.tasks)
          this.openTasks = [];
          this.completedTasks = []
          this.deletedTasks = []
          tasks.map(this.organizeTasks)
          console.log(this.openTasks)
          console.log(this.completedTasks)
        }
      } catch (err) {
        this.handleServerError(err)
      }
    },

    organizeTasks(task) {
      task.ID = this.id++
      if ( task.completed ) {
        this.completedTasks.push(task)
      } else {
        this.openTasks.push(task)
      }
      if ( task.deleted ) {
        this.deletedTasks.push(task)
      }
    },

    addTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false }
      this.tasks.push(task)
      this.saveTasks()
    },

    updateTask() {
      const task = { name: this.taskName, description: this.taskDescription, completed: false }
      this.tasks[this.currentIndex] = task
      this.saveTasks()
    },

    async saveTasks() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        // const tasks = Array.from(this.tasks)
        const tasks = new Object()
        tasks.tasks = this.tasks
        const tasksJSON = JSON.stringify(tasks)
        console.log(tasksJSON)
        const config = { headers: { 'Content-Type': 'text/plain' } }
        this.update ? await axios.put(url, tasksJSON, config) : await axios.post(url, tasksJSON, config);
        this.getTasks()
      } catch (err) {
        this.handleServerError(err)
      }
    },

    async deleteTasklist() {
      try {
        const url = taskEngineUrl + '/' + this.object + '/' + this.object_id + '/default'
        await axios.delete(url);
        this.getTasks()
      } catch (err) {
        this.handleServerError(err)
      }
    },

    handleServerError(error) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.log("Server Error:", error)
      } else if (error.request) {
        // client never received a response, or request never left
        console.log("Network Error:", error)
      } else {
        console.log("Client Error:", error)
      }
    },

    editTask(task, index) {
      this.currentIndex = index
      this.taskName = task.name
      this.taskDescription = task.description
      this.completed = task.completed
    },

    deleteTask() {
      this.tasks.splice(this.currentIndex, 1);
      if ( this.tasks.length > 0 ) {
        this.saveTasks()
      } else {
        this.deleteTasklist()
      }
    },

    completeTask(event, index) {
      console.log(index)
      const tasks = Array.from(this.tasks)
      console.log(tasks)
      const task = tasks[index]
      task.completed = event.target.checked
      this.tasks = tasks
      this.saveTasks()
    },
    
    clearAddTaskFields() {
      this.newTaskName = '';
      this.newTaskDescription = '';
    },
  },

  mounted() {
    this.getTasks();
  },

};
</script>
