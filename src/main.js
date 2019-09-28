import Vue from 'vue'
import router from "@/router";
import App from './App.vue'

import vue_resource from 'vue-resource'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/static/icons/iconfont.css'
// import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import store from "./store/store";
import plugins from "./plugins";
import Print from 'vue-print-nb'

Vue.use(Print);  //注册

Vue.config.productionTip = false
Vue.use(iView)
// Vue.use(VueQuillEditor)
Vue.use(vue_resource)
Vue.use(plugins)


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
