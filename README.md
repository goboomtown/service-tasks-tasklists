# Tasks Microcomponent for CXME
                       
## Working with Vue

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Integration with app-v4

### 1. Build and copy the components

```npm run build```

This will create several products in the `dist` 
directory. The products in the `dist/js` directory 
should be copied to the 
`app-v4/resources/scripts/vuetasks` directory.

These products are reference from `app.json` in `app-v4`
as follows:

```js
"js": [
    {"path": "resources/scripts/nprogress-start.js", "includeInBundle": false},
    ...
    {"path": "resources/scripts/vuetasks/app-vue-tasks.min.js", "remote": false},
    {"path": "resources/scripts/vuetasks/chunk-vendors-vue-tasks.min.js", "remote": false},
 ],
```
  
### 2. Initializing the Tasks Vue component

At startup `main.js` will set the following variables to allow
`aap-v4` to reference the component:

```js
window.VUETASKS = {
    createApp: createApp.bind(this),
    App: App,
    config: {
        //VueJS bootstrap configs passed from app-v4
    }
};
```

### 3. Add Tasks Vue component to view hierarchy

The Tasks Vue component acts like an ExtJS component. You
can add it to a view like this:

```js    
items: [
    ...
    {
        xtype: 'tasksvue',
        itemId: 'col2-tasksview-iid',
        cls: 'column-listing  no-border',
        userSelectable: true,
        margin: '0 16 0 16',
        flex: 1,
        hidden: false,
        bind: {
            hidden: '{!splitIOEnableTasks}'
        },
        listeners: {
            // painted: 'handleFeatureFlag'
        },
    },
    ...
```

### 4. Manage the Tasks Vue component
                                  
When the component window is painted the component can be 
mounted for use. Saving the response from the mount call is 
important as it will be used for subsequent calls to 
component functions.

```js
listeners: {
    painted: function(){
        if ( window.VUETASKS ){
            let tasksContainer = document.createElement('div');
            tasksContainer.setAttribute('id', 'vuetasks');
            let parentSelector = '#' + this.bodyElement.id;
            let parentContainer = document.querySelector(parentSelector);
            parentContainer.appendChild(tasksContainer);
            const vueTasks = window.VUETASKS.createApp(
                window.VUETASKS.App
            );
            this.setVuetasks(vueTasks);
            const vueTasksApp = vueTasks.mount('#vuetasks');
            this.setVueTasksApp(vueTasksApp);
        }
    }
}

```

### 5. Calling Tasks Vue functions
                     
After getting the Tasks Vue component you can call 
functions:

```js
let eventListing = Forms.getEventsListing(),
    tasksvue = eventListing.down('#col2-tasksview-iid');
tasksvue.showAddView();
tasksvue.showListView();

```
The Vue component functions are then called in this manner:

```js
showAddView: function() {
    const vueTasksApp = this.getVueTasksApp();
    if ( vueTasksApp ) {
        vueTasksApp.showAddView();
    }
},
```

### 6. Handling Tasks Vue events
    
First we need to create an event handler that we will call to
handle Tasks Vue component events. Here is a sample events
handler that creates case interaction events.
     
```js 
onEvent: function(event) {
    console.log(event);
    let eventsListing = Forms.getEventsListing();
    if ( eventsListing ) {
        let eventsViewModel = eventsListing.getViewModel();
        if ( eventsViewModel ) {
            let store = eventsViewModel.getStore('events');
            if ( store ) {
                const action = event.action?event.action:'task';
                const task = event.task?event.task:null;
                let body = '';
                if ( task ) {
                    body = task.name?task.name:'';
                }
                const interaction_event = {
                    category: 'task-action',
                    type: action,
                    body: body,
                };
                // Apply issueId to newly create log record
                let currentLogRecord = Ext.create('model.issuesLog', {
                    issues_id: currentCaseRecord.get('id'),
                    interaction_event: interaction_event,
                });

                currentLogRecord.save({
                    success: () => {
                        console.log('currentLogRecord saved');
                        store.load();
                    }
                });
            }
        }
    }
},
```

Then we need to set the event handler.

```js
if ( vueTasksApp ) {
    vueTasksApp.setEventHandler(this.onEvent);
}
```

## Using the Tasks Vue Component

By default the component will display at most the top 
three (3) open tasks. 

The component also exposes the following functions:

    showAddView()   - replace the tasks with with an Add Task view
 
    showListView()  - replace the tasks view with a Tasks List view

    setEventHandler(handler) - set the event handler for the component

The component also exposes events in the format:

```js
{
    action: action,
    task: task,
    time: new Date().toISOString()
}
```

where `action` may be one of:

```js
action: {
    completed: 'task-completed',
    uncompleted: 'task-uncompleted',
    added:'task-added',
    edited: 'task-edited',
    deleted: 'task-deleted',
    undeleted: 'task-undeleted'
},
```
