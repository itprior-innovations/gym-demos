const D={Monday:[["06.00 - 07.00","Fitness","Rahul V.","t1"],["07.00 - 08.00","Boxcycle","Karthik R.","t4"],["08.00 - 09.00","Body Building","Priya N.","t2"],["09.00 - 10.00","Crossfit","Anita R.","t3"],["10.00 - 11.00","Cardio","Vikram R.","t6"],["11.00 - 12.00","Yoga Basics","Meera D.","t5"],["12.00 - 01.00","Sports","Rahul V.","t1"]]};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],tn=document.getElementById('tabs'),rw=document.getElementById('rows');
function show(d){const o=days.indexOf(d),b=D.Monday;rw.innerHTML=b.map((_,i)=>b[(i+o)%7]).map((r,i)=>r).map((r,i)=>`<div class="tr"><span>${b[i][0]}</span><span>${r[1]}</span><span><img src="${I[r[3]]}" alt="">${r[2]}</span></div>`).join('');
 [...tn.children].forEach(x=>x.classList.toggle('on',x.dataset.d==d))}
days.forEach(d=>{const x=document.createElement('button');x.innerHTML='<span>'+d+'</span>';x.dataset.d=d;x.onclick=()=>show(d);tn.appendChild(x)});show('Monday');
function sc(n){const f=document.getElementById('feat');f.scrollBy({left:n*390,behavior:'smooth'})}
function calc(){const h=+document.getElementById('h').value/100,w=+document.getElementById('w').value,b=w/(h*h);
 const s=b<18.5?'Underweight':b<25?'Normal':b<30?'Overweight':'Obese';document.getElementById('res').textContent='Your BMI: '+b.toFixed(1)+' ('+s+')';return false}
const Q=[["Great trainers and a friendly place. I started with zero fitness and now I train five days a week.","Anny B. - Member"],["Clean gym, good equipment, and the coaches actually track your progress. Worth every rupee.","Gertrud Z. - Yoga Member"],["The group classes keep me motivated. I lost weight and gained confidence.","Josepha N. - Member"]];let qi=0;
function tq(n){qi=(qi+n+Q.length)%Q.length;document.getElementById('q').innerHTML=Q[qi][0]+'<small>- '+Q[qi][1]+'</small>'}tq(0);

document.querySelectorAll('[data-i]').forEach(e=>e.src=I[e.dataset.i]);document.querySelectorAll('[style*="img_"]').forEach(e=>e.setAttribute('style',e.getAttribute('style').replace(/img_(\w+)\.jpg/g,(m,k)=>I[k])));
