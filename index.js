var express = require('express');
var app = express();
var models = require('./models');
var bodyParser = require('body-parser');
var session = require('express-session');
const axios = require('axios')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))

const clientID = ''
const clientSecret = ''

User = models.User;
Album = models.Album;
Genre = models.Genre;
Song = models.Song;
Artist = models.Artist;
Playlist = models.Playlist;
SongAndArtist = models.SongAndArtist;
AlbumAndSong = models.AlbumAndSong;
ListenHistory = models.ListenHistory;

// Schema Utility Functions
var user_schema_instantiate = function(json_data) {
  var user = new User({
      name: {
        first_name: json_data.first_name,
        middle_name: json_data.middle_name,
        last_name: json_data.last_name,
      },
      current_password: json_data.current_password,
      previous_passwords: json_data.previous_passwords,
      email: json_data.email,
      phone_number: json_data.phone_number,
      plan: json_data.plan,
      previous_plans: json_data.previous_plans,
      log_in_history: {
        place: json_data.place,
        device: json_data.device
      },
      favourite_genres: json_data.favourite_genres,
      favourite_artists: json_data.favourite_artists
    })
  return user;
}

var album_schema_instantiate = function(json_data) {
  var album = new Album({
    name: json_data.name,
    release_date: json_data.release_date,
    artists: json_data.artists,
    rating: {
      stars: json_data.rating,
      review: json_data.review
    }
  })
  return album;
}

var genre_schema_instantiate = function(json_data) {
  var genre = new Artist({
    name: json_data.name
  })
  return genre;
}

var song_schema_instantiate = function(json_data) {
  var song = new Song({
    title: json_data.title,
    lyrics: json_data.lyrics,
    length: {
      hours: json_data.hours,
      minutes: json_data.minutes,
      seconds: json_data.seconds
    },
    file_location: json_data.file_location,
    director: json_data.director,
    lyricist: json_data.lyricist,

    instruments: {
      instrument: json_data.instrument,
      player: json_data.player
    },
    language: json_data.language,
    genre: json_data.genre,
    mood: json_data.mood,
    total_listens: {
      date: json_data.date,
      listens: json_data.listens
    },
    rating: {
      stars: json_data.stars,
      review: json_data.review
    }
    })
  return song;
}

var artist_schema_instantiate = function(json_data) {
  var artist = new Artist({
    name: json_data.name
  })
  return artist;
}

var song_and_artist_schema_instantiate = function(json_data) {
  var song_and_artist = new songAndArtist({
      song: json_data.name,
      artist: json_data.artist
    })
  return song_and_artist;
}

var album_and_song_schema_instantiate = function(json_data) {
  var album_and_song = new AlbumAndSong({
      album: json_data.album,
      song: json_data.song
    })
  return album_and_song;
}

var listen_history_schema_instantiate = function(json_data) {
  var listen_history = new ListenHistory({
      user: json_data.user,
      song: json_data.song,
      total_listens: json_data.total_listens
    })
  return listen_history;
}

var playlist_schema_instantiate = function(json_data) {
  var playlist = new Playlist({
      user: json_data.user,
      playlists: json_data.playlists
    })
  return playlist;
}

// OAuth
app.get('/oauth/redirect', (request, response) => {
  const request_token = request.query.code
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    const access_token = response.data.access_token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  })
})

// User endpoints
//1. Post User
app.post('/users', function(request, response) {
  user = user_schema_instantiate(request.body);
  user.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

// 2. Get User
app.get('/users', function(request, response) {
  User.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

// 3. Get Artists liked By User
app.get('/users/favourite_artists/:user_id', function(request, response) {
  User.findById(request.params.user_id, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs["favourite_artists"]);
    }
  });
});

//4. Update User

app.put('/users/update/:user_id', function(request, response){
   //artist = artist_schema_instantiate(request.body.name);
   User.updateOne({_id: request.params.user_id}, { "$push": { "favourite_artists": request.body.favourite_artists } }, { new: true }, function (error, res) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(500).send("Successfully Updated");
     }
   });
});

//5. Delete User
app.delete('/users/:phone_number', function(request, response){
   User.remove({phone_number: request.params.phone_number}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// Album endpoints
//1. Post Album
app.post('/albums', function(request, response) {
  album = album_schema_instantiate(request.body);
  album.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get Album
app.get('/albums', function(request, response) {
  Album.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Get Albums Created in last N days
app.get('/albums/:last_n_days', function(request, response) {
  Album.find({ "createdAt": { "$gte" : new Date(Date.now() - 1000 * 3600 * 24 * request.params.last_n_days) } }, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//4. Update Album
app.put('/albums/:name', function(request, response){
   album = album_schema_instantiate(request.body);
   Album.findOneAndUpdate({ name: request.params.name }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//5. Delete Album
app.delete('/artists/:name', function(request, response){
   Album.remove({name: request.params.name}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// Genre endpoints
// 1. Post Artist
app.post('/genres', function(request, response) {
  genre = genre_schema_instantiate(request.body);
  genre.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

// 2. Get Genre
app.get('/genres', function(request, response) {
  Genre.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

// 3. Update Genre
app.put('/genres/:name', function(request, response){
   genre = genre_schema_instantiate(request.body);
   Genre.findOneAndUpdate({ name: request.params.name }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

// 4. Delete Genre
app.delete('/genres/:name', function(request, response){
   Genre.remove({name: request.params.name}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// Song endpoints
//1. Post Song
app.post('/songs', function(request, response) {
  song = song_schema_instantiate(request.body);
  song.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get Song
app.get('/songs', function(request, response) {
  Song.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Get Songs created in last N days
app.get('/songs/latest/:last_n_days', function(request, response) {
  Song.find({ "createdAt": { "$gte" : new Date(Date.now() - 1000 * 3600 * 24 * request.params.last_n_days) } }, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//4. Get Songs by Genre
app.get('/songs/title/:title', function(request, response) {
  Song.findOne({title: request.params.title}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json({docs});
    }
  });
});

//5. Update Song
app.put('/songs/:title', function(request, response){
   song = song_schema_instantiate(request.body);
   Song.findOneAndUpdate({ title: request.params.title }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//6. Delete Song
app.delete('/songs/:title', function(request, response){
   Song.remove({title: request.params.title}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// Artist endpoints
// 1. Post Artist
app.post('/artists', function(request, response) {
  artist = artist_schema_instantiate(request.body);
  artist.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

// 2. Get Artist
app.get('/artists', function(request, response) {
  Artist.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

// 3. Update Artist
app.put('/artists/:name', function(request, response){
   artist = artist_schema_instantiate(request.body);
   Artist.findOneAndUpdate({ name: request.params.name }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

// 4. Delete Artist
app.delete('/artists/:name', function(request, response){
   Artist.remove({name: request.params.name}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// SongAndArtist endpoints
//1. Post SongAndArtist
app.post('/songs-and-artist', function(request, response) {
  song_and_artist = song_and_artist_schema_instantiate(request.body);
  song_and_artist.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get SongAndArtist
app.get('/songs-and-artists', function(request, response) {
  SongAndArtist.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Update SongAndArtist
app.put('/songs-and-artists/:song', function(request, response){
   song_and_artist = song_and_artist_schema_instantiate(request.body);
   SongAndArtistSchema.findOneAndUpdate({ song: request.params.song }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//4. Delete SongAndArtistSchema
app.delete('/songs-and-artists/:song', function(request, response){
   SongAndArtist.remove({song: request.params.song}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// AlbumAndSong endpoints
//1. Post AlbumAndSong
app.post('/albums-and-songs', function(request, response) {
  album_and_song = album_schema_instantiate(request.body);
  album_and_song.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get AlbumAndSong
app.get('/albums-and-songs', function(request, response) {
  AlbumAndSong.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Update AlbumAndSong
app.put('/albums-and-songs/:album', function(request, response){
   album_and_song = album_and_song_schema_instantiate(request.body);
   AlbumAndSong.findOneAndUpdate({ album: request.params.album }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//4. Delete SongAndArtist
app.delete('/songs-and-artists/:album', function(request, response){
   AlbumAndSong.remove({album: request.params.album}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// ListenHistory endpoints
//1. Post ListenHistory
app.post('/listen_history', function(request, response) {
  listen_history = listen_history_schema_instantiate(request.body);
  album_and_song.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get ListenHistory
app.get('/listen_history', function(request, response) {
  ListenHistory.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Update ListenHistory
app.put('/listen_history/:listen_history', function(request, response){
   listen_history = listen_history_schema_instantiate(request.body);
   ListenHistory.findOneAndUpdate({ user: request.params.user }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//4. Delete ListenHistory
app.delete('/listen_history/:user', function(request, response){
   ListenHistory.remove({album: request.params.user}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

// Playlist endpoints
//1. Post Playlist
app.post('/playlists/', function(request, response) {
  playlist = playlist_schema_instantiate(request.body);
  playlist.save(function (error, reponse) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).send("Successfully Posted");
    }
  });
});

//2. Get Playlist
app.get('/playlists', function(request, response) {
  Playlist.find({}, function (error, docs) {
    if (error)
      response.status(500).send({ error: "Error" });
    else {
      response.status(200).json(docs);
    }
  });
});

//3. Update Playlist
app.put('/playlists/:user', function(request, response){
   playlist = playlist_schema_instantiate(request.body);
   Playlist.findOneAndUpdate({ user: request.params.user }, { $set: request.body }, { new: true }, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Updated");
     }
   });
});

//4. Delete Playlist
app.delete('/listen_history/:user', function(request, response){
   Playlist.remove({user: request.params.user}, function (error, reponse) {
     if (error)
       response.status(500).send({ error: "Error" });
     else {
       response.status(200).send("Successfully Deleted");
     }
   });
});

app.listen(3000);
