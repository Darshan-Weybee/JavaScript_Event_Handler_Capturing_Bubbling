'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth SCrolling in learn more

btnScrollTo.addEventListener("click", function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // alternate way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Smooth Scrolling in nav links

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener("click", function(e){
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// });
// alternate way
document.querySelector('.nav__links').addEventListener("click", function (e) {
  e.preventDefault();
  // Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;

  // Active Tab
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Active Content
  const num = clicked.dataset.tab;
  tabContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${num}`).classList.add('operations__content--active');
})

// Menu Tabe Animation
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    sibling.forEach(el => {
      if (el != link)
        el.style.opacity = this
    });
    logo.style.opacity = this;
  }
}
// passing argument into event handlers
nav.addEventListener("mouseover", handleHover.bind(0.5))
nav.addEventListener("mouseout", handleHover.bind(1))

// Sticky Navigation Bar
// const intialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function(){
//   if(window.scrollY > intialCoords.top)
//       nav.classList.add('sticky');
//   else
//       nav.classList.remove('sticky');
// })
// alternate way

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, { root: null, threshold: 0, rootMargin: `-${navHeight}px` });

function stickyNav(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');

}
headerObserver.observe(header);

// Reveal Section
const allsection = document.querySelectorAll(".section");
const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });

function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

allsection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// Lazy Loading images
const imgTargets = document.querySelectorAll("img[data-src]");

function loadimg(entries, observer) {
  const [entry] = entries;

  console.log(entry)
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadimg, { root: null, threshold: 0, rootMargin: '200px' });

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  function createDot() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  function activateDot(slide) {
    document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove("dots__dot--active"));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }

  function nextSlide() {
    if (curSlide == maxSlide)
      curSlide = 0;
    else
      curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function prevSlide() {
    if (curSlide == 0)
      curSlide = maxSlide;
    else
      curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  function init() {
    createDot();
    goToSlide(0);
    activateDot(0);
  }
  init();
  btnLeft.addEventListener("click", prevSlide);
  btnRight.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight") nextSlide();
    else if (e.key == "ArrowLeft") prevSlide();
  })

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/////////////////////////////////////////
/////////////////////////////////////////

// // Selecting Elements

// // to select whole page
// console.log(document.documentElement);

// // to select head part
// console.log(document.head);

// // to select body part
// console.log(document.body);

// document.querySelector('.header');
// const allSections =  document.querySelectorAll(".section");
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));


// // creating and inserting HTML element
// const message = document.createElement("div");
// message.classList.add('cookie-message');

// message.innerHTML = 'we use cookied for improved functionality and analytics, <button class="btn btn--close-cookie">Got it!</button>'

// // prepend use to add the element to starting of the selected element
// // append use to add the element to end of the selected element

// document.querySelector(".header").prepend(message);
// // document.querySelector(".header").append(message);

// // to get copy of the element in document
// // document.querySelector(".header").append(message.cloneNode(true));

// // add before the header element
// document.querySelector(".header").before(message);

// //add after the header element
// document.querySelector(".header").after(message);


// // Delete Elements
// document.querySelector(".btn--close-cookie").addEventListener("click", function(){
//   message.remove();
//   // message.parentElement.removeChild(message);
// });



// // Styles

// // to set style in the element and that style added as inline css
// // .style element also used to get the element but it returns only style that available as inline css
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);

// //if we want the style then we use getComputedStyle function
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// // to add the height in the html element
// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 +'px';

// // to set the custom property like css variable use .setProperty(name, value);
// document.documentElement.style.setProperty('--color-primary','orangered');



// // Attributes
// const logo =  document.querySelector('.nav__logo');
// // to get and set  standard attribute
// console.log(logo.alt);
// console.log(logo.src);
// logo.alt = 'Beautiful minimalist logo';

// //non-standard attribute
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company','jonas');

// //data attributes to store the value in ui in html code
// console.log(logo.dataset.versionNumber);


// //classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// //don't use 
// logo.className = 'jonas';

/////////////////////////////////////
/////////////////////////////////////

// smooth scrolling

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener("click", function(e){
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log("current scroll X/Y", window.pageXOffset, window.pageYOffset);

//   console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
// });

///////////////////////////////////
//////////////////////////////////

// Events

// const h1 = document.querySelector("h1")
// const alerth1 = function(){
//   alert("hiiiiiiiiii");
// }
// h1.addEventListener("mouseenter", alerth1);

// setTimeout(() => h1.removeEventListener("mouseenter", alerth1), 3000);

// h1.onmouseenter = function(){
//   alert("helllooooooo");
// }


/////////////////////////////////////
/////////////////////////////////////


// Event Bubbling and Capturing

// const randomInt = (min, max) => Math.floor(Math.random() * (max-min+1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === true);

//   e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector(".nav").addEventListener("click", function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// }, true);


/////////////////////////////////////
/////////////////////////////////////

// // DOM Traversing

// const h1 = document.querySelector('h1');

// // Going Downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'white';

// // Going upwards: parents
// console.log(h1.parentElement);
// console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var( --gradient-secondary)';
// h1.closest('h1').style.background = 'var( --gradient-primary)';

// // Going SideWay: Sibling
// console.log(h1.previousElementSibling);
// console.log(h1.previousSibling);

// console.log(h1.nextElementSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);


/////////////////////////////////////
/////////////////////////////////////


