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

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const playlist = $('.playlist');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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

  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    //? local storage chỉ lưu string
  },

  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
    playlist.innerHTML = htmls.join('');
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

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'}
    ], {
      duration: 10000, // 10sec
      iterations: Infinity // Loop bao nhiêu lần
    })
    cdThumbAnimate.pause();
    
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
      cdThumbAnimate.play();
    }

    // When song is paused
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing')
      cdThumbAnimate.pause();
    }

    // When song progress changed
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
      }
    }

    // Xử lý khi tua bài hát
    progress.onchange = function(e) { // :onchange: HTML events
      const seekTime = audio.duration * e.target.value / 100;
      audio.currentTime = seekTime;
    }

    // Khi chọn next song
    nextBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render(); // update active song
      _this.scrollToActiveSong();
    }

    // Khi chọn previous song
    prevBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // Handle khi bật/tắt random song
    randomBtn.onclick = function(e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    }

    // Handle phát lại một bài hát
    repeatBtn.onclick = function(e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    }

    // Handle next song khi current song end
    audio.onended = function() {
      if (_this.isRepeat) {
        audio.play();
      } else{
        nextBtn.click();
      }
    }
    //todo: create a function to make sure previous songs will not run again till all the song is ran(array)

    // Lắng nghe hành vi click vào 1 song trong playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        // Handle khi click vào song
        if(songNode) {
          _this.currentIndex = Number(songNode.dataset.index); //index sẽ return string
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Handle khi nhấn vào song option
        if (e.target.closest('.option')) {

        }
      }
    }
  },

  //todo: đối với song ở đầu list thì đẩy vị trí mạnh tay hơn
  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }, 300)
  },

  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },

  nextSong: function() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  
  prevSong: function() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function() {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function() {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Define properties for object
    this.defineProperties();

    //Listen to DOM events and handle it
    this.handleEvents();

    this.loadCurrentSong();

    //Render playlist
    this.render();

    //Hiển thị trạng thái ban đầu của repeat/ random btn
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
    //? check lại _this và this ngay đây
  }
}

app.start();