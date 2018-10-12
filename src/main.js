import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import moment from 'moment-timezone';
import './style.scss';

import routes from './util/routes';
import { checkFilter, setDay } from './util/bus';

Vue.use(VueRouter);
Vue.use(VueResource);

moment.tz.setDefault('UTC');
Object.defineProperty(Vue.prototype, '$moment', {
  get() {
    return this.$root.moment;
  }
});

const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', {
  get() {
    return this.$root.bus;
  }
});

const router = new VueRouter({ routes });

new Vue({
  el: '#app',
  data: {
    genre: [],
    time: [],
    movies: [],
    day: moment(),
    moment,
    bus
  },
  created() {
    this.$http.get('/api').then((res) => {
      this.movies = res.data;
    });

    this.$bus.$on('check-filter', checkFilter.bind(this));
    this.$bus.$on('set-day', setDay.bind(this));
  },
  router
});
