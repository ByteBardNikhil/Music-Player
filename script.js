let songsData;
let filteredSongs;

fetch("media/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    songsData = data;
    process(data);
    populatingList(data);
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

const nameEl = document.getElementById("song-name");
const artistEl = document.getElementById("singer-name");
const img = document.getElementById("album-cover");
const sourceAudio = document.getElementById("sourceAudio");
const audioEl = document.getElementById("audio-player");
const nextSongBtn = document.getElementById("next-song");
const prevSongBtn = document.getElementById("prev-song");
const genreFilter = document.getElementById("genre-filter");
const songList = document.querySelector(".song-list");
const playListName = document.querySelector(".playlist-input").innerHTML;

let currSong = 0;
function process(data) {
  playSong(currSong, data);
}

function playSong(index, data) {
  const song = data[index];
  currentlyPlayingMusic(song);
}

function currentlyPlayingMusic(song) {
  const { title, artist, artwork, url } = song;

  nameEl.textContent = title;
  img.src = artwork;
  artistEl.textContent = artist;

  sourceAudio.src = url;
  audioEl.load();
  //   audioEl.play();
}
nextSongBtn.addEventListener("click", () => {
  currSong++;
  if (currSong >= songsData.length) {
    currSong = 0;
  }
  playSong(currSong, songsData);
});

prevSongBtn.addEventListener("click", () => {
  currSong--;
  if (currSong < 0) currSong = songsData.length - 1;
  playSong(currSong, songsData);
});

genreFilter.addEventListener("change", (e) => {
  const selectGenre = e.target.value;
  if (selectGenre === "" || selectGenre.toLowerCase() === "all")
    filteredSongs = songsData;
  else {
    filteredSongs = songsData.filter(
      (song) => song.genre.toLowerCase() === selectGenre.toLowerCase()
    );
    console.log(filteredSongs);
  }
  currSong = 0;
  process(filteredSongs);
  populatingList(filteredSongs);
});

function populatingList(songs) {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const songItem = document.createElement("li");
    songItem.classList.add("song-item");
    songItem.textContent = song.title + " - " + song.artist;
    songItem.addEventListener("click", () => {
      currSong = index;
      playSong(currSong, songs);
    });
    songList.append(songItem);
  });
}

//Playlist code started

let playlists = {};
let currentPlaylist = [];
let currentPlaylistName = "";

const createPlaylistBtn = document.getElementById("create-playlist-button");
const playlistNameInput = document.getElementById("playlist-name");
const currentPlaylistEl = document.getElementById("current-playlist");
const allPlaylistsEl = document.getElementById("all-playlists");
const addToPlaylistBtn = document.getElementById("add-to-playlist");

addToPlaylistBtn.addEventListener("click", () => {
  if (!currentPlaylistName) {
    alert("Please create a playlist first!");
    return;
  }

  const currentSong = songsData[currSong]; // Get the currently playing song

  const isSongPresent = currentPlaylist.some(
    (song) => song.title === currentSong.title
  );

  if (isSongPresent) {
    alert("This song is already in the playlist!");
    return;
  }

  addToCurrentPlaylist(currentSong);
});
function addToCurrentPlaylist(song) {
  currentPlaylist.push(song);
  playlists[currentPlaylistName] = [...currentPlaylist];
  updateCurrentPlaylistDisplay();
}

createPlaylistBtn.addEventListener("click", () => {
  const playlistName = playlistNameInput.value.trim();

  if (!playlistName) {
    alert("Please enter a playlist name");
    return;
  }

  if (playlists[playlistName]) {
    alert("A playlist with this name already exists!");
    return;
  }

  playlists[playlistName] = [...currentPlaylist];

  currentPlaylist = [];
  currentPlaylistName = playlistName;

  playlistNameInput.value = "";
  console.log(currentPlaylistName);

  updateAllPlaylistsDisplay();
  updateCurrentPlaylistDisplay();
});
function updateCurrentPlaylistDisplay() {
  currentPlaylistEl.innerHTML = "";

  currentPlaylist.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;

    currentPlaylistEl.appendChild(li);
  });
}
function updateAllPlaylistsDisplay() {
  allPlaylistsEl.innerHTML = "";

  Object.keys(playlists).forEach((playlistName) => {
    const li = document.createElement("li");
    li.textContent = playlistName;
    li.addEventListener("click", () => displayPlaylist(playlistName));
    allPlaylistsEl.appendChild(li);
  });
}

function displayPlaylist(playlistName) {
  currentPlaylist = [...playlists[playlistName]]; // Load the selected playlist into the current playlist
  currentPlaylistName = playlistName;
  updateCurrentPlaylistDisplay();
}
