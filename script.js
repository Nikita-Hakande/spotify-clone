console.log("Spotify JS loaded");

// SONG DATA
let songs = [
  { songName: "Warriyo - Mortals", filePath: "songs/1.mp3" },
  { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3" },
  { songName: "Invincible", filePath: "songs/3.mp3" },
  { songName: "My Heart", filePath: "songs/4.mp3" },
  { songName: "Heroes Tonight", filePath: "songs/5.mp3" },
  { songName: "Rabba", filePath: "songs/6.mp3" },
  { songName: "Sakhiyaan", filePath: "songs/7.mp3" },
  { songName: "Bhula Dena", filePath: "songs/8.mp3" },
  { songName: "Tumhari Kasam", filePath: "songs/9.mp3" },
  { songName: "Na Jaana", filePath: "songs/10.mp3" },
];

let songIndex = 0;
let audioElement = new Audio(songs[0].filePath);

// ELEMENTS
let masterPlay = document.getElementById("masterPlay");
let myProgressBar = document.getElementById("myProgressBar");
let songItemPlays = document.getElementsByClassName("songItemPlay");
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let shuffleBtn = document.getElementById("shuffle");
let repeatBtn = document.getElementById("repeat");

// STATES
let isShuffle = false;
let isRepeat = false;

// 🔹 RESET UI FUNCTION
function resetSongUI() {
  document.querySelectorAll(".songItem").forEach((item) => {
    item.classList.remove("active");
  });

  document.querySelectorAll(".songItemPlay").forEach((btn) => {
    btn.classList.remove("fa-circle-pause");
    btn.classList.add("fa-circle-play");
  });
}

// 🔹 PLAY SONG BY INDEX (HELPER)
function playSongByIndex(index) {
  resetSongUI();

  songIndex = index;
  audioElement.src = songs[songIndex].filePath;
  audioElement.currentTime = 0;
  audioElement.play();

  document
    .getElementsByClassName("songItem")
    [songIndex].classList.add("active");

  masterPlay.classList.remove("fa-circle-play");
  masterPlay.classList.add("fa-circle-pause");
}

// MAIN PLAY BUTTON
masterPlay.addEventListener("click", () => {
  if (audioElement.paused) {
    audioElement.play();
    masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
    document
      .getElementsByClassName("songItem")
      [songIndex].classList.add("active");
  } else {
    audioElement.pause();
    masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
  }
});

// SONG ITEM PLAY
Array.from(songItemPlays).forEach((element) => {
  element.addEventListener("click", (e) => {
    playSongByIndex(parseInt(e.target.id));
    e.target.classList.replace("fa-circle-play", "fa-circle-pause");
  });
});

// PROGRESS BAR UPDATE
audioElement.addEventListener("timeupdate", () => {
  let progress = (audioElement.currentTime / audioElement.duration) * 100;
  myProgressBar.value = progress || 0;
});

// SEEK
myProgressBar.addEventListener("change", () => {
  audioElement.currentTime =
    (myProgressBar.value * audioElement.duration) / 100;
});

// NEXT
next.addEventListener("click", () => {
  if (isShuffle) {
    playSongByIndex(Math.floor(Math.random() * songs.length));
  } else {
    playSongByIndex((songIndex + 1) % songs.length);
  }
});

// PREVIOUS
previous.addEventListener("click", () => {
  playSongByIndex(songIndex === 0 ? songs.length - 1 : songIndex - 1);
});

// 🔀 SHUFFLE
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active");
});

// 🔁 REPEAT
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active");
});

// SONG END HANDLING
audioElement.addEventListener("ended", () => {
  if (isRepeat) {
    playSongByIndex(songIndex);
  } else if (isShuffle) {
    playSongByIndex(Math.floor(Math.random() * songs.length));
  } else {
    next.click();
  }
});

// 🔍 SEARCH FUNCTIONALITY
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  let filter = searchInput.value.toLowerCase();
  let songItems = document.getElementsByClassName("songItem");

  Array.from(songItems).forEach((item) => {
    let songName = item.querySelector(".songName").innerText.toLowerCase();
    item.style.display = songName.includes(filter) ? "flex" : "none";
  });
});
// ❤️ FAVORITES
document.querySelectorAll(".favorite").forEach((heart, index) => {
  let saved = localStorage.getItem("fav_" + index);
  if (saved === "true") heart.classList.add("active");

  heart.addEventListener("click", () => {
    heart.classList.toggle("active");
    localStorage.setItem("fav_" + index, heart.classList.contains("active"));
  });
});
