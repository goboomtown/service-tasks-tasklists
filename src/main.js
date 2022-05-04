if(process.env.NODE_ENV !== "production") {
    require('devextreme/dist/css/dx.common.css');
    require('./themes/generated/theme.base.css');
    require('./themes/generated/theme.additional.css');
}
import { createApp }  from "vue";
// import router from "./router";

import App from "./AppTasks";
import appInfo from "./app-info";

const app = createApp(App, { componentKey: 0 });

// app.use(router);
app.config.globalProperties.$appInfo = appInfo;
// app.mount('#app');

if ((window.location.href.indexOf("goboomtown.com") >= 0)) {
    // mount happens in v4 -> app/view/taskslists/TasksVue.js;
    window.VUETASKS = {
        createApp: createApp.bind(this),
        App: App,
        config: {
            //VueJS bootstrap configs passed from app-v4
        }
    };
} else {
    window.VUETASKS = {};
    window.VUETASKS.config = {};
    window.VUETASKS.config.serviceConfig = {};
    window.VUETASKS.config.currentCaseRecord = {};
    window.VUETASKS.config.tasks_view = true;
    window.VUETASKS.config.tasks_add = true;
    window.VUETASKS.config.tasks_edit = true;
    window.VUETASKS.config.tasks_del = true;
    window.VUETASKS.config.tasks_reopen = true;
    window.VUETASKS.config.tasks_undelete = true;

    app.mount('#app');
}

