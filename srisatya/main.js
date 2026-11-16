/* FitZone demo - original JS. Images come from p1..p6.js as data URIs in window.I */
(function(){
"use strict";
var SHOT=/[?&]shot=1/.test(location.search);
if(SHOT){var st=document.createElement('style');st.textContent='*{animation:none!important;transition:none!important}';document.head.appendChild(st);}

/* ---- inject generated images ---- */
document.querySelectorAll('img[data-i]').forEach(function(e){ if(I[e.dataset.i]) e.src=I[e.dataset.i]; });
document.querySelectorAll('[style*="img_"]').forEach(function(e){
  e.setAttribute('style', e.getAttribute('style').replace(/img_(\w+)\.jpg/g, function(m,k){ return I[k]||m; }));
});

/* ---- hero swiper + per-slide animations ---- */
function playSlide(sw){
  var act = sw.slides[sw.activeIndex];
  if(!act) return;
  act.querySelectorAll('[data-swa]').forEach(function(el){
    el.classList.remove('animate__animated', el.dataset.swa);
    void el.offsetWidth;
    el.style.animationDelay = el.dataset.delay || '0s';
    el.style.animationDuration = '1s';
    el.classList.add('animate__animated', el.dataset.swa);
  });
}
var hero = new Swiper('.hero-swiper', {
  loop: true, speed: 900,
  autoplay: SHOT ? false : { delay: 6000, disableOnInteraction: false },
  pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
  on: { init: function(){ playSlide(this); }, slideChangeTransitionStart: function(){ playSlide(this); } }
});

/* ---- owl carousels ---- */
if (window.jQuery) {
  var $feat = jQuery('.feat-owl').owlCarousel({
    loop:true, margin:26, nav:false, dots:false, autoplay:!SHOT, autoplayTimeout:5000,
    responsive:{0:{items:1,margin:0},576:{items:2},992:{items:3}}
  });
  document.getElementById('featPrev').addEventListener('click', function(){ $feat.trigger('prev.owl.carousel'); });
  document.getElementById('featNext').addEventListener('click', function(){ $feat.trigger('next.owl.carousel'); });

  jQuery('.tr-owl').owlCarousel({
    loop:true, margin:24, nav:false, dots:false, autoplay:!SHOT, autoplayTimeout:5200,
    responsive:{0:{items:1,margin:0},576:{items:2},768:{items:3},1100:{items:4}}
  });

  jQuery('.bmi-sel').select2({ minimumResultsForSearch: Infinity, width:'resolve' });

  jQuery('.jarallax').jarallax({ speed: 0.6 });
}

/* ---- mobile nav ---- */
var burger=document.getElementById('burger'), navlist=document.getElementById('navlist');
burger.addEventListener('click', function(){ navlist.classList.toggle('open'); });
navlist.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ navlist.classList.remove('open'); }); });
document.addEventListener('click', function(e){
  if(navlist.classList.contains('open') && !navlist.contains(e.target) && !burger.contains(e.target)) navlist.classList.remove('open');
});

/* ---- scroll top ---- */
var st=document.getElementById('scrollTop');
window.addEventListener('scroll', function(){ st.classList.toggle('show', window.scrollY>500); }, {passive:true});
st.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

/* ---- scroll reveal (animate.css) ---- */
var io=new IntersectionObserver(function(es){
  es.forEach(function(en){
    if(en.isIntersecting){
      var el=en.target;
      el.classList.add('in','animate__animated','animate__fadeInUp');
      io.unobserve(el);
    }
  });
},{threshold:.12});
if(SHOT){ document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); }); }
else document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

})();
