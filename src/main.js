class Carousel {
  constructor(options) {
    const config = {
      ...{ containerId: '#carousel', slideClass: 'slide', interval: 5000, isPlaying: true, slidesCount: 5 },
      ...options
    };

    this.container = document.querySelector(config.containerId);
    this.SLIDES_COUNT = config.slidesCount;
    this.SLIDE_CLASS = config.slideClass;
    this.TIMER_INTERVAL = config.interval;
    this.isPlaying = config.isPlaying;
    this.slidesConfig = config.slides;
  }

  _initContainer() {
    this.container.classList.add('carousel');
  }

  _initProps() {
    //this.container = document.querySelector('#carousel');
    this.slidesContainer = this.container.querySelector('#slides-container');
    this.slides = this.container.querySelectorAll(`.${this.SLIDE_CLASS}`);
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="fas fa-pause"></i>';
    this.FA_PLAY = '<i class="fas fa-play"></i>';
    this.FA_PREV = '<i class="fas fa-chevron-left"></i>';
    this.FA_NEXT = '<i class="fas fa-chevron-right"></i>';
    this.SWIPE_THRESHOLD = 100;
    this.currentSlide = 0;
    this.timerId = null;
  }

  _initSlides() {
    const slidesContainer = document.createElement('div');
    slidesContainer.setAttribute('id', 'slides-container');
    slidesContainer.classList.add('slides');

    // HD изображения из внешних источников
    const defaultSlidesConfig = [
      {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
        title: 'Горные пейзажи',
        description: 'Величественные горы и чистое небо'
      },
      {
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop',
        title: 'Океанские волны',
        description: 'Бескрайние просторы океана'
      },
      {
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
        title: 'Лесная тропа',
        description: 'Тайны природы в каждом шаге'
      },
      {
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop',
        title: 'Звездное небо',
        description: 'Космическая красота ночного неба'
      },
      {
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop',
        title: 'Городские огни',
        description: 'Яркие огни большого города'
      },
      {
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop',
        title: 'Пустыня',
        description: 'Бескрайние песчаные дюны'
      },
      {
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
        title: 'Закат в горах',
        description: 'Волшебные краски заката'
      }
    ];

    // Используем переданную конфигурацию или дефолтную
    const slidesConfig = this.slidesConfig || defaultSlidesConfig;

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const slide = document.createElement('div');
      slide.setAttribute('class', i ? this.SLIDE_CLASS : `${this.SLIDE_CLASS} active`);

      // Применяем конфигурацию слайда, если она есть
      const config = slidesConfig[i] || {};
      if (Object.keys(config).length > 0) {
        this._applySlideConfig(slide, config);
      } else {
        slide.textContent = `Slide ${i + 1}`;
      }

      slidesContainer.append(slide);
    }

    this.container.append(slidesContainer);
  }

  _applySlideConfig(slide, config) {
    if (config.color) {
      slide.style.backgroundColor = config.color;
    }
    if (config.image) {
      slide.style.backgroundImage = `url(${config.image})`;
    }
    if (config.title || config.description) {
      const slideContent = document.createElement('div');
      slideContent.classList.add('slide-content');
      if (config.title) {
        const title = document.createElement('h2');
        title.classList.add('slide-title');
        title.textContent = config.title;
        slideContent.append(title);
      }
      if (config.description) {
        const description = document.createElement('p');
        description.classList.add('slide-description');
        description.textContent = config.description;
        slideContent.append(description);
      }
      slide.append(slideContent);
    }
  }

  _initControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.setAttribute('id', 'controls-container');
    controlsContainer.classList.add('controls');

    const PAUSE_BTN = `<div id="pause-btn" class="control control-pause">${this.FA_PAUSE}</div>`;
    const PREV_BTN = `<div id="prev-btn" class="control control-prev">${this.FA_PREV}</div>`;
    const NEXT_BTN = `<div id="next-btn" class="control control-next">${this.FA_NEXT}</div>`;

    controlsContainer.innerHTML = PAUSE_BTN + PREV_BTN + NEXT_BTN;

    this.container.append(controlsContainer);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.previousBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

  }

  _initIndicators() {

    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.setAttribute('id', 'indicators-container');
    indicatorsContainer.classList.add('indicators');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
      indicatorsContainer.append(indicator);
    }

    this.container.append(indicatorsContainer);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.container.querySelectorAll('.indicator');
  }


  _initEventListeners() {
    this.pauseBtn.addEventListener('click', this.togglePlayHandler.bind(this));
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this));
    this.previousBtn.addEventListener('click', this.prevHandler.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicatorClickHandler.bind(this));
    document.addEventListener('keydown', this._keydownHandler.bind(this));
  }

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].style.background = null;
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].style.background = window.getComputedStyle(this.slides[this.currentSlide]).background;
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _tick() {
    this.timerId = setInterval(this._gotoNext.bind(this), this.TIMER_INTERVAL);
  }

  _indicatorClickHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pauseHandler();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  _keydownHandler(e) {
    const code = e.code;
    if (code === this.CODE_ARROW_LEFT) this.prevHandler();
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler();
    if (code === this.CODE_SPACE) {
      e.preventDefault();
      this.togglePlayHandler();
    }
  }

  pauseHandler() {
    if (!this.isPlaying) return;
    this.pauseBtn.innerHTML = this.FA_PLAY;
    clearInterval(this.timerId);
    this.isPlaying = !this.isPlaying;
  }

  playHandler() {
    if (this.isPlaying) return;
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = !this.isPlaying;
    this._tick();
  }

  togglePlayHandler() {
    this.isPlaying ? this.pauseHandler() : this.playHandler();
  }

  nextHandler() {
    this._gotoNext();
    this.pauseHandler();
  }

  prevHandler() {
    this._gotoPrev();
    this.pauseHandler();
  }

  init() {
    this._initContainer();
    this._initSlides();
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initEventListeners();
    this._tick();
  }
}

class SwipeCarousel extends Carousel {
  _initEventListeners() {
    super._initEventListeners();
    this.slidesContainer.addEventListener('touchstart', this.swipeStartHandler.bind(this), { passive: true });
    this.slidesContainer.addEventListener('mousedown', this.swipeStartHandler.bind(this));
    this.slidesContainer.addEventListener('touchend', this.swipeEndHandler.bind(this));
    this.slidesContainer.addEventListener('mouseup', this.swipeEndHandler.bind(this));
  }

  swipeStartHandler(e) {
    this.swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
  }

  swipeEndHandler(e) {
    this.swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;

    const diff = this.swipeEndX - this.swipeStartX;

    if (diff > this.SWIPE_THRESHOLD) this.prevHandler();
    if (diff < -this.SWIPE_THRESHOLD) this.nextHandler();
  }
}

const carousel = new SwipeCarousel({
  //containerId: '#root-carousel',
  slideClass: 'slide-item',
  interval: 1000,
  isPlaying: true,
  slidesCount: 7
});

carousel.init();