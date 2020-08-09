# music_api_node
A music REST API written in Node.js

<b> Consumption </b>
1. Go to http://localhost:3000/ followed by endpoints
2. Use cURL or Postman with needed HTTP verbs
3. MongoDB should be running at: mongodb://localhost:27017/music_app

<b> Dependencies </b> <br>
"node": "12.16.3" <br>
"axios": "^0.19.2", <br>
"bcrypt": "^5.0.0", <br>
"express": "^4.17.1", <br>
"express-session": "^1.17.1", <br>
"mongoose": "^5.9.26", <br>
"pug": "^3.0.0"

<b> Endpoints, DB ans Schema</b>
var userSchema = Schema({ <br>
  name: { <br>
    first_name: { type: String }, <br>
    middle_name: { type: String }, <br>
    last_name: { type: String } <br>
  }, <br>
  current_password: { type: String }, <br>
  previous_passwords: [ { type: String } ], <br>
  email: { type: String }, <br>
  phone_number: { type: Number }, <br>
  plan: { type: String }, <br>
  previous_plans: [ { type: String } ], <br>
  log_in_history: [ <br>
    { <br>
      place: { type: String }, <br>
      device: { type: String }, <br>
    }, { timestamps: true } <br>
  ], <br>
  favourite_genres: [ { type: Schema.Types.ObjectId, ref: 'Genre' } ], <br>
  favourite_artists: [ { type: Schema.Types.ObjectId, ref: 'Artist' } ] <br>
}, { timestamps: true } <br>
); <br>

var albumSchema = Schema({ <br>
  name: { type: String }, <br>
  release_date: { type: Date, default: Date.now }, <br>
  artists: [ { type: Schema.Types.ObjectId, ref: 'Artist' } ], <br>
  rating: { <br>
    stars: { type: Number }, <br>
    review: { type: String } <br>
  } <br>
}, { timestamps: true } <br>
); <br>

var genreSchema = Schema({ <br>
  name: { type: String }, <br>
}, { timestamps: true } <br>
); <br>

var songSchema = Schema({ <br>
  title: { type: String }, <br>
  lyrics: { type: String }, <br>
  length: { <br>
    hours: { type: Number, required: true, min: 0, max: 23 }, <br>
    minutes: { type: Number, required: true, min: 0, max: 59 }, <br>
    seconds: { type: Number, required: true, min: 0, max: 59 } <br>
  }, <br>
  file_location: { type: String }, <br>
  director: { type: String }, <br>
  lyricist: { type: String }, <br>
  instruments: [ { <br>
    instrument: { type: String }, <br>
    player: { type: Schema.Types.ObjectId, ref: 'Artist' } <br>
  } ], <br>
  language: { type: String }, <br>
  genre: { type: String }, <br>
  mood: { type: String }, <br>
  total_listens: { <br>
    date: { type: Date }, <br>
    listens: { type: Number } <br>
  }, <br>
  rating: { <br>
    stars: { type: Number }, <br>
    review: { type: String } <br>
  } <br>
}, { timestamps: true } <br>
); <br>

var artistSchema = Schema({ <br>
  name: { type: String }, <br>
}, { timestamps: true } <br>
); <br>

var songAndArtistSchema = Schema({ <br>
  song: { type: Schema.Types.ObjectId, ref: 'Song' }, <br>
  artists: { type: Schema.Types.ObjectId, ref: 'Artist' }, <br>
}, { timestamps: true } <br>
); <br>

var albumAndSongSchema = Schema({ <br>
  album: { type: Schema.Types.ObjectId, ref: 'Album' }, <br>
  songs: [ { type: Schema.Types.ObjectId, ref: 'Song' } ], <br>
}, { timestamps: true } <br>
); <br>

var listenHistorySchema = Schema({ <br>
  user: { type: Schema.Types.ObjectId, ref: 'User' }, <br>
  song: { type: Schema.Types.ObjectId, ref: 'Song' }, <br>
  total_listens: { type: Number }, <br>
  }, { timestamps: true } <br>
); <br>

var playlistSchema = Schema({ <br>
  user: { type: Schema.Types.ObjectId, ref: 'User' }, <br>
  playlists: [ [ { type: Schema.Types.ObjectId, ref: 'Song' } ] ] <br>
}, { timestamps: true } <br>
);
