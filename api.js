const axios = require('axios');
const async = require('async');
const moment = require('moment-timezone');

if (!process.env.OMDB_API_KEY) require('dotenv').config();
moment.tz.setDefault('UTC');

// Axios
const $http = axios.create({
  // baseURL: `http://localhost:${process.env.PORT}/offline_api`,
  baseURL: 'http://www.omdbapi.com'
});

const generateSessions = (id) => {
  let sessions = [];
  let nums = id
    .replace('tt', '')
    .split('')
    .map((item) => {
      let num = parseInt(item);
      if (num === 0) {
        num = 1;
      }
      if (num > 6) {
        num = num - 2;
      }
      return num;
    });
  nums.splice(nums[3], 0, nums[0]);
  nums.shift();
  nums.forEach((num, index) => {
    let date = moment()
      .startOf('day')
      .add(index, 'days');
    for (let i = 0; i < num; i++) {
      let pos = index + i <= nums.length ? index + i : index + i - nums.length;
      let hours = nums[pos] + 12;
      let mins =
        nums[pos] < 2.5 ? 0 : nums[pos] < 5 ? 15 : nums[pos] < 7.5 ? 30 : 45;
      sessions.push({
        id: `${id}_${i}`,
        time: moment(date)
          .add(hours, 'hours')
          .add(mins, 'minutes'),
        seats: Math.round(
          200 -
            nums.reduce((acc, val) => {
              return acc + val;
            }) +
            num * i
        )
      });
    }
  });
  return sessions.sort((a, b) => {
    if (a.time < b.time) {
      return -1;
    } else {
      return a.time > b.time;
    }
  });
};

const cleanData = (movie) => {
  if (
    movie.Rated === 'N/A' ||
    movie.Rated === 'UNRATED' ||
    movie.Rated === 'NOT RATED'
  ) {
    let last = parseInt(movie.imdbID[movie.imdbID.length - 1]);
    movie.Rated = last < 7 ? (last < 4 ? 'G' : 'PG-13') : 'R';
  }
  return movie;
};

module.exports = {
  data: [],
  getData(callback) {
    if (!this.data.length) {
      let ids = process.env.IMDB_IDS.split(',');
      let data = [];
      async.each(
        ids,
        (id, callback) => {
          if (!data.find((item) => item.id === id)) {
            // $http.get(`?i=${id}`)
            $http
              .get(`?apikey=${process.env.OMDB_API_KEY}&i=${id}`)
              .then((response) => {
                let error = response.data.Error;
                if (!error) {
                  data.push({
                    id,
                    movie: cleanData(response.data),
                    sessions: generateSessions(id)
                  });
                }
                callback(error, this.data);
              })
              .catch((err) => {
                callback('An error occurred', this.data);
              });
          } else {
            callback('An error occurred', this.data);
          }
        },
        (err) => {
          if (err) {
            callback(err, null);
          } else {
            this.data = ids.map((id) => data.find((item) => id === item.id));
            callback(null, this.data);
          }
        }
      );
    } else {
      callback(null, this.data);
    }
  }
};
