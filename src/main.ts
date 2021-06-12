import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import VueYouTubeEmbed from "vue-youtube-embed";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(VueYouTubeEmbed);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
