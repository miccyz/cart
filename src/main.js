import 'bootstrap/dist/css/bootstrap.css';
 
import Vue from 'vue';
import mojKomponent from './App';
 
Vue.filter('walutaG', wartosc => new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN'
}).format(wartosc))
 
new Vue({
  el: '#app',
  components: {
    wlasny: mojKomponent
  },
  template: '<wlasny/>'
})