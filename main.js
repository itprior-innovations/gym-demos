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

/* ---- testimonial swiper ---- */
var tm = new Swiper('.tm-swiper', { loop: true, speed: 700, autoplay: SHOT ? false : { delay: 7000 } });
document.querySelector('.tm-prev').addEventListener('click', function(){ tm.slidePrev(); });
document.querySelector('.tm-next').addEventListener('click', function(){ tm.slideNext(); });

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

/* ---- timetable ---- */
var DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var TT={
 Monday:[["06.00 - 07.00","Fitness","Paul Flavius","t1"],["07.00 - 08.00","Boxcycle","Ricardo Marshall","t2"],["08.00 - 09.00","Body Building","Joana Williams","t3"],["09.00 - 10.00","Crosfit","Gwen Bass","t4"],["10.00 - 11.00","Cardio","Melanie Byrd","t1"],["11.00 - 12.00","Yoga Basics","Maria Fields","t3"],["12.00 - 01.00","Sports","Melvin Harvey","t2"]],
 Tuesday:[["06.00 - 07.00","Cardio","Melanie Byrd","t1"],["07.00 - 08.00","Fitness","Paul Flavius","t1"],["08.00 - 09.00","Crosfit","Gwen Bass","t4"],["09.00 - 10.00","Boxcycle","Ricardo Marshall","t2"],["10.00 - 11.00","Body Building","Joana Williams","t3"],["11.00 - 12.00","Sports","Melvin Harvey","t2"],["12.00 - 01.00","Yoga Basics","Maria Fields","t3"]],
 Wednesday:[["06.00 - 07.00","Boxcycle","Ricardo Marshall","t2"],["07.00 - 08.00","Body Building","Joana Williams","t3"],["08.00 - 09.00","Fitness","Paul Flavius","t1"],["09.00 - 10.00","Cardio","Melanie Byrd","t1"],["10.00 - 11.00","Crosfit","Gwen Bass","t4"],["11.00 - 12.00","Sports","Melvin Harvey","t2"],["12.00 - 01.00","Yoga Basics","Maria Fields","t3"]],
 Thursday:[["06.00 - 07.00","Crosfit","Gwen Bass","t4"],["07.00 - 08.00","Cardio","Melanie Byrd","t1"],["08.00 - 09.00","Sports","Melvin Harvey","t2"],["09.00 - 10.00","Fitness","Paul Flavius","t1"],["10.00 - 11.00","Boxcycle","Ricardo Marshall","t2"],["11.00 - 12.00","Body Building","Joana Williams","t3"],["12.00 - 01.00","Yoga Basics","Maria Fields","t3"]],
 Friday:[["06.00 - 07.00","Fitness","Paul Flavius","t1"],["07.00 - 08.00","Boxcycle","Ricardo Marshall","t2"],["08.00 - 09.00","Body Building","Joana Williams","t3"],["09.00 - 10.00","Crosfit","Gwen Bass","t4"],["10.00 - 11.00","Cardio","Melanie Byrd","t1"],["11.00 - 12.00","Yoga Basics","Maria Fields","t3"],["12.00 - 01.00","Sports","Melvin Harvey","t2"]],
 Saturday:[["06.00 - 07.00","Body Building","Joana Williams","t3"],["07.00 - 08.00","Crosfit","Gwen Bass","t4"],["08.00 - 09.00","Cardio","Melanie Byrd","t1"],["09.00 - 10.00","Boxcycle","Ricardo Marshall","t2"],["10.00 - 11.00","Fitness","Paul Flavius","t1"],["11.00 - 12.00","Sports","Melvin Harvey","t2"],["12.00 - 01.00","Yoga Basics","Maria Fields","t3"]],
 Sunday:[["06.00 - 07.00","Yoga Basics","Maria Fields","t3"],["07.00 - 08.00","Cardio","Melanie Byrd","t1"],["08.00 - 09.00","Boxcycle","Ricardo Marshall","t2"],["09.00 - 10.00","Fitness","Paul Flavius","t1"],["10.00 - 11.00","Body Building","Joana Williams","t3"],["11.00 - 12.00","Crosfit","Gwen Bass","t4"],["12.00 - 01.00","Sports","Melvin Harvey","t2"]]
};
var tabs=document.getElementById('ttTabs'), rows=document.getElementById('ttRows');
function showDay(d){
  rows.innerHTML = TT[d].map(function(r){
    return '<div class="tt-row"><span>'+r[0]+'</span><span>'+r[1]+'</span><span><img src="'+I[r[3]]+'" alt="">'+r[2]+'</span></div>';
  }).join('');
  Array.prototype.forEach.call(tabs.children, function(x){ x.classList.toggle('on', x.dataset.d===d); });
}
DAYS.forEach(function(d){
  var b=document.createElement('button');
  b.innerHTML='<span>'+d+'</span>'; b.dataset.d=d;
  b.addEventListener('click', function(){ showDay(d); });
  tabs.appendChild(b);
});
showDay('Monday');

/* ---- BMI ---- */
document.getElementById('bmiForm').addEventListener('submit', function(ev){
  ev.preventDefault();
  var ft=parseFloat(document.getElementById('bmiFt').value)||0,
      inc=parseFloat(document.getElementById('bmiIn').value)||0,
      cm=parseFloat(document.getElementById('bmiCm').value)||0,
      type=document.getElementById('bmiType').value||'kg',
      kg=parseFloat(document.getElementById('bmiKg').value)||0;
  if(type==='lb') kg=kg*0.453592;
  if(!kg || (!ft && !inc && !cm)) { document.getElementById('bmiRes').textContent='Please pick height and weight.'; return; }
  var m=cm? cm/100 : (ft*12+inc)*0.0254, b=kg/(m*m);
  var s=b<18.5?'Underweight':b<25?'Normal':b<30?'Overweight':'Obese';
  document.getElementById('bmiRes').textContent='Your BMI: '+b.toFixed(1)+' ('+s+')';
});

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
