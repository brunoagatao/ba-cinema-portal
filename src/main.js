import Vue from 'vue';
import VueResource from 'vue-resource';
import moment from 'moment-timezone';
import './style.scss';

import MovieList from './components/MovieList.vue';
import MovieFilter from './components/MovieFilter.vue';
import { checkFilter } from './util/bus';

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

new Vue({
  el: '#app',
  data: {
    genre: [],
    time: [],
    movies: [],
    moment,
    day: moment(),
    bus
  },
  components: {
    MovieList,
    MovieFilter
  },
  created() {
    this.$http.get('/api').then((res) => {
      this.movies = res.data;
    });

    this.$bus.$on('check-filter', checkFilter.bind(this));
  }
});
