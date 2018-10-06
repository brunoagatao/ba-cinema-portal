import Vue from 'vue';
import './style.scss';

import genres from './util/genres';

new Vue({
  el: '#app',
  components: {
    'movie-list': {
      template: `<div id="movie-list">
                  <div class="movie" v-for="movie in movies">
                    {{ movie.title }}
                  </div>
                </div>`,
      data: function () {
        return {
          movies: [
            { title: 'Pulp Fiction' },
            { title: 'Home Alone' },
            { title: 'Austin Powers' }
          ]
        };
      }
    },
    'movie-filter': {
      data() {
        return { genres }
      },
      template: `<div id="movie-filter">
                  <h2>Filter results</h2>
                  <div class="filter-group">
                    <check-filter v-for="genre in genres"></check-filter>
                  </div>
                </div>`,
      components: {
        'check-filter': {
          template: `<div>Filter</div>`
        }
      }
    }
  }
});