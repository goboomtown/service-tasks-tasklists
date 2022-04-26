import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
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
    app.mount('#app');
}

