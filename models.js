/* Next id generator, not working currently
var Artist = mongoose.model("Artist", artistSchema);
  Artist.find({}, {id: 1, _id: 0}).sort({_id:-1}).limit(1).exec(function (err, docs) {
    if(err)
        console.log(error);
      else
        console.log(docs[0]["id"] + 1);
  });
*/
//const Bcrypt = require("bcryptjs");
var mongoose = require('mongoose');
Schema = mongoose.Schema
connectionString = 'mongodb://localhost:27017/music_app';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, 'useCreateIndex': true })
  .then(client => console.log('Connected to Database'))
  .catch(error => console.error(error))

var userSchema = Schema({
  name: {
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String }
  },
  current_password: { type: String },
  previous_passwords: [ { type: String } ],
  email: { type: String },
  phone_number: { type: Number },
  plan: { type: String },
  previous_plans: [ { type: String } ],
  log_in_history: [
    {
      place: { type: String },
      device: { type: String },
    }, { timestamps: true }
  ],
  favourite_genres: [ { type: Schema.Types.ObjectId, ref: 'Genre' } ],
  favourite_artists: [ { type: Schema.Types.ObjectId, ref: 'Artist' } ]
}, { timestamps: true }
);

var albumSchema = Schema({
  name: { type: String },
  release_date: { type: Date, default: Date.now },
  artists: [ { type: Schema.Types.ObjectId, ref: 'Artist' } ],
  rating: {
    stars: { type: Number },
    review: { type: String }
  }
}, { timestamps: true }
);

var genreSchema = Schema({
  name: { type: String },
}, { timestamps: true }
);

var songSchema = Schema({
  title: { type: String },
  lyrics: { type: String },
  length: {
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: true, min: 0, max: 59 },
    seconds: { type: Number, required: true, min: 0, max: 59 }
  },
  file_location: { type: String },
  director: { type: String },
  lyricist: { type: String },
  instruments: [ {
    instrument: { type: String },
    player: { type: Schema.Types.ObjectId, ref: 'Artist' }
  } ],
  language: { type: String },
  genre: { type: String },
  mood: { type: String },
  total_listens: {
    date: { type: Date },
    listens: { type: Number }
  },
  rating: {
    stars: { type: Number },
    review: { type: String }
  }
}, { timestamps: true }
);

var artistSchema = Schema({
  name: { type: String },
}, { timestamps: true }
);

var songAndArtistSchema = Schema({
  song: { type: Schema.Types.ObjectId, ref: 'Song' },
  artists: { type: Schema.Types.ObjectId, ref: 'Artist' },
}, { timestamps: true }
);

var albumAndSongSchema = Schema({
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
  songs: [ { type: Schema.Types.ObjectId, ref: 'Song' } ],
}, { timestamps: true }
);

var listenHistorySchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  song: { type: Schema.Types.ObjectId, ref: 'Song' },
  total_listens: { type: Number },
  }, { timestamps: true }
);

var playlistSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  playlists: [ [ { type: Schema.Types.ObjectId, ref: 'Song' } ] ]
}, { timestamps: true }
);

var User = mongoose.model("User", userSchema);
var Album = mongoose.model("Album", albumSchema);
var Genre = mongoose.model("Genre", genreSchema);
var Song = mongoose.model("Song", songSchema);
var Artist = mongoose.model("Artist", artistSchema);
var SongAndArtist = mongoose.model("SongAndArtistSchema", songAndArtistSchema);
var AlbumAndSong = mongoose.model("AlbumAndSongSchema", albumAndSongSchema);
var ListenHistory = mongoose.model("ListenHistorySchema", listenHistorySchema);
var Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = {
  User, Album, Genre, Song, Artist, Playlist, SongAndArtist, AlbumAndSong, ListenHistory
};

/*
var artist = new Artist(
  {
    name: "A"
  }
)

artist.save(function (err) {
  if (err)
    console.log(err);
  else {
    console.log("Successfully inserted");
  }
});

Artist.find({}, {_id: 1}, function (err, docs) {
  if (err)
    console.log(err);
  else {
    console.log(docs[0]["_id"]);
  }
});

var album = new Album(
  {
    name: "A",
    rating: {
      stars: 5,
      review: "Good"
    }
  }
)

album.save(function (err) {
  if (err)
    console.log(err);
  else {
    console.log("Successfully inserted");
  }
});


var user = new User({
  name: {
    first_name: "Am",
    middle_name: "What",
    last_name: "Pro"
  },
  //current_password: Bcrypt.hashSync("passo", 10),
  current_password: "passo",
  email: "b@b.com",
  phone_number: 785445,
  plan: "Plan",
  log_in_history: [
    {
      place: "US",
      device: "iP",
    }, { timestamps: true }
  ],
  favourite_genres: "Indie",
  favourite_artists: "VZR"
}
)

user.save(function (err) {
  if (err)
    console.log(err);
  else {
    console.log("Successfully inserted");
  }
});


var schema = function(name) {
  var artist = new Artist(
    {
      name: name
    }
  )
  return artist;
}

sc = schema("Naama Tamilan");
sc.save(function (err) {
  if (err)
    console.log(err);
  else {
    console.log("Successfully inserted");
  }
});
*/
