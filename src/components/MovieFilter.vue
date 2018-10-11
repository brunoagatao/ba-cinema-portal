<template>
  <div id='movie-filter'>
    <h2>Filter results</h2>
    <h3>By time of day</h3>
    <div class='filter-group'>
      <check-filter category='time' v-bind:title='time' v-for='time in times' ></check-filter>
    </div>
    <h3>By genre</h3>
    <div class='filter-group'>
      <check-filter category='genre' v-bind:title='genre' v-for='genre in genres'></check-filter>
    </div>
  </div>
</template>

<script>
import genres from '../util/genres';
import times from '../util/times';
import CheckFilter from './CheckFilter.vue';

export default {
  data() {
    return {
      genres,
      times
    };
  },
  components: {
    CheckFilter
  }
};
</script>