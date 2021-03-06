<template>
  <div id='movie-list'>
    <div v-if='filteredMovies.length'>
      <movie-item v-bind:movie='movie.movie' v-for='movie in filteredMovies'>
        <div class="movie-sessions">
          <div
            class='session-time-wrapper tooltip-wrapper'
            v-tooltip='{ seats: session.seats }'
            v-for='session in filteredSessions(movie.sessions)'
            v-bind:key='session.id'
          >
            <div class="session-time">{{ formatSessionTime(session.time) }}</div>
          </div>
        </div>
      </movie-item>
    </div>
    <div class='no-results' v-else-if='movies.length'>
      {{ noResults }}
    </div>
    <div class='no-results' v-else>
      Loading..
    </div>
  </div>
</template>

<script>
import genres from '../util/genres';
import times from '../util/times';
import MovieItem from './MovieItem.vue';

export default {
  props: ['genre', 'time', 'movies', 'day'],
  methods: {
    formatSessionTime(raw) {
      return this.$moment(raw).format('h:mm A');
    },
    filteredSessions(sessions) {
      return sessions.filter(this.sessionPassesTimeFilter);
    },
    moviePassesGenreFilter(movie) {
      if (!this.genre.length) return true;
      else {
        let movieGenres = movie.movie.Genre.split(', ');

        let matched = true;
        this.genre.forEach((genre) => {
          if (movieGenres.indexOf(genre) === -1) matched = false;
        });

        return matched;
      }
    },
    sessionPassesTimeFilter(session) {
      const sessionTime = this.$moment(session.time);
      if (!this.day.isSame(sessionTime, 'day')) return false;
      else if (this.time.length === 0 || this.time.length === 2) return true;
      else if (this.time[0] === times.AFTER_6PM)
        return sessionTime.hour() >= 18;
      else return sessionTime.hour() < 18;
    }
  },
  computed: {
    filteredMovies() {
      return this.movies
        .filter(this.moviePassesGenreFilter)
        .filter((movie) => movie.sessions.find(this.sessionPassesTimeFilter));
    },
    noResults() {
      const times = this.time.join(', ');
      const genres = this.genre.join(', ');
      return `No results for ${times}${
        times.length && genres.length ? ', ' : ''
      }${genres}.`;
    }
  },
  components: {
    MovieItem
  }
};
</script>