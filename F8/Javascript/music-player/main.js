// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek    //? src: HTML Audio/Video methods
// 4. CD rotate
// 5. Next / Prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/music/song1.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assets/music/song2.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path:
        "./assets/music/song3.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./assets/music/song1.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "./assets/music/song2.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./assets/music/song3.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],

  render: function() {
    const htmls = this.songs.map(song => {
      return `
      <div class="song">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `
    })
    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    })
  },

  handleEvents: function() {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    
    // Modify CD size
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWith = cdWidth - scrollTop

      cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
      cd.style.opacity = newCdWith / cdWidth; 
    }

    // Click play
    playBtn.onclick = function() {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      
    }

    // When song is played
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing')
    }

    // When song is paused
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing')
    }

    // When song progress changed
    audio.ontimeupdate = function() {
      //todo(video: 38:41): if(audio)
      console.log(audio.currentTime / audio.duration * 100);
    }
  },

  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  start: function() {
    // Define properties for object
    this.defineProperties();

    //Listen to DOM events and handle it
    this.handleEvents();

    this.loadCurrentSong();

    //Render playlist
    this.render();


  }
}

app.start();