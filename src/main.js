// Vue.js kütüphanesini içe aktarıyoruz
import Vue from 'vue';

// Font Awesome'ı import edin
import '@fortawesome/fontawesome-free/css/all.min.css';
// Uygulamanın ana bileşeni olan App.vue dosyasını içe aktarıyoruz
import App from './App.vue';
import store from "./store/store";

// Vue'nun production tip uyarısını devre dışı bırakıyoruz
Vue.config.productionTip = false;

// Bootstrap CSS dosyasını içe aktarıyoruz
import 'bootstrap/dist/css/bootstrap.css';

// BootstrapVue CSS dosyasını içe aktarıyoruz
import 'bootstrap-vue/dist/bootstrap-vue.css';

// BootstrapVue JavaScript kütüphanesini içe aktarıyoruz
import BootstrapVue from 'bootstrap-vue';

// Uygulamanın özel stil dosyasını içe aktarıyoruz
import './assets/css/main.css';

import './registerServiceWorker'

// BootstrapVue eklentisini Vue.js ile kullanıma alıyoruz
Vue.use(BootstrapVue);

// Yeni bir Vue örneği yaratıyoruz
new Vue({
  // render fonksiyonu ile App.vue bileşenini render ediyoruz
  render: h => h(App),
  store,
 
  // Vue örneğini #app id'li HTML elemanına monte ediyoruz
}).$mount('#app');
