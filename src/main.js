// Код логіки слайдера пишемо тут
//dom
const container = document.querySelector('#carousel');
const slidesContainer = container.querySelector('#slides-container');
const slides = container.querySelectorAll('.slide');
const indicatorsContainer = container.querySelector('#indicators-container');
const indicators = container.querySelectorAll('.indicator');
const pauseBtn = container.querySelector('#pause-btn');
const previousBtn = container.querySelector('#prev-btn');
const nextBtn = container.querySelector('#next-btn');

//constants
const slides_COUNT = slides.length;
const TIMER_INTERVAL = 2000;
const CODE_SPACE = 'Space';
const CODE_ARROW_LEFT = 'ArrowLeft';
const CODE_ARROW_RIGHT = 'ArrowRight';
const FA_PAUSE = '<i class="fas fa-pause"></i>';
const FA_PLAY = '<i class="fas fa-play"></i>';
//const FA_PREV = '<i class="fas fa-chevron-left"></i>';
//const FA_NEXT = '<i class="fas fa-chevron-right"></i>';
const SWIPE_THRESHOLD = 100;

//variables
let currentSlide = 0;
let timerId = null;
let isPlaying = true;
let swipeStartX = null;
let swipeEndX = null;

function gotoNth(n) {
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');

  // reset bgc of current slide
  indicators[currentSlide].style.background = null;

  currentSlide = (n + slides_COUNT) % slides_COUNT;
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');

  // get bgc of current slide
  indicators[currentSlide].style.background = window.getComputedStyle(slides[currentSlide]).background;
}

function gotoPrev() {
  gotoNth(currentSlide - 1);
}

function gotoNext() {
  gotoNth(currentSlide + 1);
}

function tick() {
  timerId = setInterval(gotoNext, TIMER_INTERVAL);
}

function pauseHandler() {
  if (!isPlaying) return;
  pauseBtn.innerHTML = FA_PLAY;
  clearInterval(timerId);
  isPlaying = !isPlaying;
}

function playHandler() {
  if (isPlaying) return;
  pauseBtn.innerHTML = FA_PAUSE;
  isPlaying = !isPlaying;
  tick();
}

function togglePlayHandler() {
  isPlaying ? pauseHandler() : playHandler();
}

function nextHandler() {
  gotoNext();
  pauseHandler();
}

function prevHandler() {
  gotoPrev();
  pauseHandler();
}

function indicatorClickHandler(e) {
  const { target } = e;
  if (target && target.classList.contains('indicator')) {
    pauseHandler();
    gotoNth(+target.dataset.slideTo);
  }
}

function keydownHandler(e) {
  const code = e.code;
  if (code === CODE_ARROW_LEFT) prevHandler();
  if (code === CODE_ARROW_RIGHT) nextHandler();
  if (code === CODE_SPACE) {
    e.preventDefault();
    togglePlayHandler();
  }
}

function swipeStartHandler(e) {
  swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
}

function swipeEndHandler(e) {
  swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;

  const diff = swipeEndX - swipeStartX;

  if (diff > SWIPE_THRESHOLD) prevHandler();
  if (diff < -SWIPE_THRESHOLD) nextHandler();
}

function initEventListeners() {
  pauseBtn.addEventListener('click', togglePlayHandler);
  nextBtn.addEventListener('click', nextHandler);
  previousBtn.addEventListener('click', prevHandler);
  indicatorsContainer.addEventListener('click', indicatorClickHandler);
  document.addEventListener('keydown', keydownHandler);
  slidesContainer.addEventListener('touchstart', swipeStartHandler, { passive: true });
  slidesContainer.addEventListener('mousedown', swipeStartHandler);
  slidesContainer.addEventListener('touchend', swipeEndHandler);
  slidesContainer.addEventListener('mouseup', swipeEndHandler);
}

function init() {
  initEventListeners();
  tick();
}

init();