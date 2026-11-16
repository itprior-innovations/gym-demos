/* Gym demo AI upgrade. No credentials belong in this file. */
(() => {
'use strict';
const ENDPOINT = 'https://itprior-gym-assistant.aisivendra.workers.dev';
const gym = location.pathname.split('/').pop().replace('.html','');
const phone = document.querySelector('a[href^="tel:"]')?.getAttribute('href').slice(4) || '';
const maps = [...document.querySelectorAll('a')].find(a=>a.href.includes('google.com/maps'))?.href;
const panel=document.getElementById('gym-chat'); if(!panel)return;
const box=document.getElementById('chat-answer');
const input=document.getElementById('chat-question');
const form=panel.querySelector('form');
const submit=form.querySelector('button');
const oldFAQ=window.answerFAQ;
let history=[], busy=false;
const te=q=>/[\u0C00-\u0C7F]/.test(q) || document.documentElement.lang==='te' || /telugu|తెలుగు/i.test(q);
const style=document.createElement('style');style.textContent=`.chat-panel{width:390px}.chat-content{overscroll-behavior:contain}.chat-answer{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.65;font-family:Arial,"Noto Sans Telugu",sans-serif}.chat-form input{min-width:0;font-family:Arial,"Noto Sans Telugu",sans-serif}.chat-answer .ai-status{display:block;font-size:11px;letter-spacing:.02em;color:#656565;margin-bottom:8px;white-space:normal}.chat-answer .ai-question{display:block;font-size:12px;color:#555;border-bottom:1px solid #ddd;padding-bottom:8px;margin-bottom:10px;white-space:pre-wrap}.chat-links{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px;white-space:normal}.chat-links a{display:inline-block;font-size:12px;font-weight:bold;color:#17191d!important;background:#f4d534;border:1px solid #d5bc32;border-radius:6px;padding:6px 9px;text-decoration:none}.chat-note{line-height:1.5!important}.chat-form button:disabled{opacity:.6}.chat-answer svg{display:block;max-width:100%;margin-top:12px}.chat-answer figure{margin:12px 0}.chat-answer figcaption{font-size:11px;white-space:normal}.chat-content p{margin-bottom:12px}.chat-head{flex-shrink:0}.chat-content{min-height:0;overflow-y:auto}.chat-form{position:relative}@media(max-width:800px){.chat-panel{width:calc(100vw - 28px);max-height:calc(100dvh - 155px)}.chat-content{font-size:14px}}`;
document.head.append(style);
function labels(){
 const l=te('');
 const launch=document.querySelector('#chat-launch span');launch.dataset.en='Ask the gym · AI';launch.dataset.te='జిమ్ గురించి · AI';launch.textContent=l?launch.dataset.te:launch.dataset.en;
 const title=panel.querySelector('.chat-head strong');title.dataset.en='Demo AI gym assistant';title.dataset.te='నమూనా AI జిమ్ సహాయకుడు';title.textContent=l?title.dataset.te:title.dataset.en;
 panel.setAttribute('aria-label','Demo AI gym assistant');
 const intro=panel.querySelector('.chat-content > p');
 intro.dataset.en='Ask about workouts, food, exercise form or this gym. English or తెలుగు. This is a demo AI, not a live trainer.';
 intro.dataset.te='వ్యాయామాలు, ఆహారం, సరైన పద్ధతి లేదా జిమ్ గురించి అడగండి. ఇది నమూనా AI మాత్రమే, ప్రత్యక్ష ట్రైనర్ కాదు.';
 intro.textContent=l?intro.dataset.te:intro.dataset.en;
 const note=panel.querySelector('.chat-note');
 note.dataset.en='General information, not medical advice. AI can be wrong. Messages go to Cloudflare AI; do not share private or medical details. Free daily quota is shared by all 3 demos. FAQ remains available if AI is busy.';
 note.dataset.te='సాధారణ సమాచారం మాత్రమే, వైద్య సలహా కాదు. AI పొరబడవచ్చు. ప్రశ్నలు Cloudflare AIకి వెళ్తాయి; వ్యక్తిగత లేదా వైద్య వివరాలు పంపవద్దు. 3 నమూనాలకు రోజువారీ ఉచిత పరిమితి ఉమ్మడి. AI అందుబాటులో లేకపోతే FAQ ఉపయోగించవచ్చు.';
 note.textContent=l?note.dataset.te:note.dataset.en;
}
labels();
input.maxLength=700;input.autocomplete='off';input.placeholder='Ask anything fitness / అడగండి';
const priorLang=window.setLang;window.setLang=function(l){priorLang(l);labels();};
function links(q,l){
 const list=document.createElement('div');list.className='chat-links';
 const add=(label,url)=>{if(!url)return;const a=document.createElement('a');a.textContent=label;a.href=url;if(url.startsWith('http')){a.target='_blank';a.rel='noopener noreferrer';}list.append(a);};
 add(l?'కాల్చేయండి':'Call gym','tel:'+phone);
 add('WhatsApp','https://wa.me/'+phone.replace(/\D/g,''));
 add(l?'మ్యాప్':'Gym map',maps);
 if(!/fee|price|hour|location|address|where|ఫీజు|చిరునామా|ఎక్కడ/.test(q.toLowerCase()))add(l?'వ్యాయామ వీడియోలు ↗':'How-to videos ↗','https://www.youtube.com/results?search_query='+encodeURIComponent(q.slice(0,180)+' exercise proper form '+(l?'Telugu':'beginner')));
 if(/image|photo|picture|diagram|చిత్రం|బొమ్మ|ఫోటో/i.test(q))add(l?'చిత్రాల శోధన ↗':'Image references ↗','https://www.google.com/search?tbm=isch&q='+encodeURIComponent(q.slice(0,180)+' exercise technique'));
 return list;
}
function show(text,q,mode,l){
 activeFAQ=null;box.hidden=false;box.replaceChildren();
 const status=document.createElement('small');status.className='ai-status';status.textContent=mode==='ai'?(l?'AI సమాధానం · తప్పులు ఉండవచ్చు':'AI answer · may contain mistakes'):mode==='faq'?(l?'AI అందుబాటులో లేదు · సేవ్ చేసిన FAQ':'AI unavailable · saved FAQ fallback'):(l?'నిర్ధారించిన జిమ్ వివరాలు':'Verified demo gym details');box.append(status);
 const question=document.createElement('strong');question.className='ai-question';question.textContent=q;box.append(question);
 const content=document.createElement('div');content.textContent=text;box.append(content);
 box.append(links(q,l));
 box.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function fallback(q,l){
 const key=/pain|injur|pregnan|medic|diabet|నొప్పి|గాయం|మధుమేహం/.test(q)?'medical':/weight gain|muscle|bulk|protein|బరువు పె|కండర/.test(q)?'muscle':/fat|loss|lose|slim|తగ్గ|కొవ్వు/.test(q)?'fat':/begin|start|routine|plan|కొత్త|మొదలు|వ్యాయామ/.test(q)?'beginner':/diet|food|eat|meal|ఆహార|భోజన/.test(q)?'diet':/join|fee|price|hour|time|contact|train|phone|gym|జిమ్|ఫీజు|సమయ|చేర/.test(q)?'join':'other';
 oldFAQ(key);const text=box.textContent;show(text,q,'faq',l);
}
async function ask(q){
 if(busy||!q.trim())return;q=q.trim().slice(0,700);const l=te(q);busy=true;submit.disabled=true;input.value='';
 box.hidden=false;box.textContent=l?'ఆలోచిస్తున్నాను…':'Thinking…';
 // Gym-specific unknown details are never guessed by a model.
 if(/\b(fee|fees|price|pricing|cost|hours?|opening|closing|timings?|offers?|trainers?|facilities|equipment)\b|ఫీజు|ధర|వేళలు|సమయాలు|ఆఫర్|ట్రైనర్లు/i.test(q) && !/exercise|form|workout|diet|food|protein|sleep|rest|recover|calori|training|వ్యాయామ|ఆహార|నిద్ర/i.test(q)) {
  const row=FAQ.find(x=>x[0]==='join');show(row[l?4:3],q,'verified',l);busy=false;submit.disabled=false;return;
 }
 if(/\b(address|location|directions|map)\b|where (?:is|are|can I find) (?:the gym|you|this|camel|sai|oxyzen)|^where\??$|ఎక్కడ ఉంది|చిరునామా|లొకేషన్|మ్యాప్/i.test(q)){
  const address=[...document.querySelectorAll('p')].find(p=>p.textContent.includes('Andhra Pradesh 5300'));
  // Address is preserved in the map query even when page language changes.
  const raw=maps?new URL(maps).searchParams.get('query'):'';
  show(raw||address?.textContent|| (l?'కింద జిమ్ మ్యాప్ తెరవండి.':'Open the gym map below.'),q,'verified',l);busy=false;submit.disabled=false;return;
 }
 try{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),35000);
  let response;try{response=await fetch(ENDPOINT+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({gym,message:q,history}),signal:controller.signal});}finally{clearTimeout(timer);}
  if(!response.ok)throw new Error('unavailable');const result=await response.json();if(!result.answer)throw new Error('empty');
  show(result.answer,q,'ai',l);history.push({role:'user',content:q},{role:'assistant',content:result.answer});history=history.slice(-4);
  if(/image|photo|picture|diagram|చిత్రం|బొమ్మ|ఫోటో/i.test(q)){
   const figure=document.createElement('figure');figure.innerHTML='<svg viewBox="0 0 280 125" role="img" aria-label="Illustrative exercise symbol, not technique instruction"><rect width="280" height="125" rx="10" fill="#f5f3e8"/><circle cx="140" cy="26" r="12" fill="#17191d"/><path d="M140 40v37m0-26l-35 15m35-15l35 15m-35 11l-25 32m25-32l25 32" fill="none" stroke="#17191d" stroke-width="8" stroke-linecap="round"/><path d="M80 68h20m80 0h20" stroke="#c1a400" stroke-width="12" stroke-linecap="round"/></svg>';
   const cap=document.createElement('figcaption');cap.textContent=l?'వ్యాయామానికి సంకేత చిత్రం మాత్రమే. ఇది జిమ్ ఫోటో లేదా సరైన పద్ధతి సూచన కాదు.':'Illustrative fitness symbol only. Not a gym photo or an exercise-form guide.';figure.append(cap);box.append(figure);
  }
 }catch{fallback(q.toLowerCase(),l);}finally{busy=false;submit.disabled=false;}
}
window.askFAQ=function(e){e.preventDefault();ask(input.value);};
window.answerFAQ=function(key){const row=FAQ.find(x=>x[0]===key);ask(row?row[te('')?2:1]:key);};
})();
