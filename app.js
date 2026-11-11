(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const gradeKeys = ['10', '11', '12'];
  const letters = gradeKeys.flatMap(grade => (HEART_DATA[grade] || []).map((entry, index) => ({...entry, grade, index, title: entry.name, content: LETTER_CONTENT[entry.id] || ''})));
  const state = {grade:'all', query:'', sound:true, typing:false};
  let timer = 0, token = 0, audioCtx = null, toastTimer = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TYPE_DELAY = 39;
  function normalize(value){return String(value).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d')}
  function filtered(){const q=normalize(state.query);return letters.filter(x=>(state.grade==='all'||x.grade===state.grade)&&(!q||normalize(`${x.title} ${x.specialty} khối ${x.grade}`).includes(q)))}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1900)}
  function accentFor(grade){return grade==='11'?'emerald':grade==='12'?'amber':'cyan'}
  function renderHearts(){const grid=$('#heartCanvas'),items=filtered();grid.replaceChildren();items.forEach(item=>{const button=document.createElement('button');button.type='button';button.className=`heart-node grade-${item.grade}`;button.dataset.id=item.id;button.setAttribute('aria-label',`Mở thư ${item.title}`);const glyph=document.createElement('span');glyph.className='heart-glyph';glyph.setAttribute('aria-hidden','true');const name=document.createElement('span');name.className='node-name';name.textContent=item.title;const meta=document.createElement('span');meta.className='node-meta';meta.textContent=`KHỐI ${item.grade} · ${item.specialty.toLocaleUpperCase('vi')}`;button.append(glyph,name,meta);button.addEventListener('click',()=>openLetter(item));grid.append(button)});$('#searchEmpty').hidden=items.length>0;$('#resultCount').textContent=`${items.length} lớp`;const dot=$('.grade-dot');dot.className=`grade-dot ${state.grade==='all'?'all-dot':`g${state.grade}`}`;const heading=state.grade==='all'?'36 trái tim':`12 trái tim · Khối ${state.grade}`;$('.grade-intro b').textContent=heading;$('.grade-intro small').textContent=state.grade==='all'?'Ba khối · Một vườn lời chúc':`Sắc màu nhận diện khối ${state.grade}`}
  function stopTyping(){token++;clearTimeout(timer);timer=0;state.typing=false;state.paused=false}
  function keySound(){if(!state.sound)return;try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;if(!audioCtx)audioCtx=new Ctx();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='square';osc.frequency.value=680+Math.random()*170;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.032,audioCtx.currentTime+.004);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.034);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.036)}catch{}}
  function typeText(text){stopTyping();const myToken=token,target=$('#dialogCopy');target.textContent='';if(reduced){target.textContent=text;return}const chars=Array.from(text);let i=0;state.typing=true;const tick=()=>{if(myToken!==token||!$('#letterDialog').open||state.paused)return;if(i>=chars.length){state.typing=false;return}const ch=chars[i++];target.textContent+=ch;if(!/\s/.test(ch))keySound();const delay=TYPE_DELAY+(/[.!?。！？]/u.test(ch)?360:/[,;:，；：]/u.test(ch)?170:/\n/.test(ch)?250:0);timer=setTimeout(tick,delay)};timer=setTimeout(tick,420)}
  function resetFeedback(){
    $$('.feedback-options button').forEach(button=>{
      button.classList.remove('selected');
      button.setAttribute('aria-pressed','false');
    });
    $('#feedbackThanks').textContent='';
    $('#feedbackThanks').classList.remove('feedback-thanks-show');
  }
  function openLetter(item){
    stopTyping();
    resetFeedback();
    const dialog=$('#letterDialog');
    dialog.className=`letter-dialog grade-${item.grade}`;
    $('#dialogGrade').textContent=`KHỐI ${item.grade} · ${item.specialty.toLocaleUpperCase('vi')}`;
    $('#dialogTitle').textContent=item.title;
    $('#dialogCopy').textContent='';
    if(!dialog.open)dialog.showModal();
    typeText(item.content||'');
  }
  function closeLetter(){stopTyping();$('#letterDialog').close()}
  $('#closeDialog').addEventListener('click',closeLetter);$('#letterDialog').addEventListener('close',stopTyping);$('#letterDialog').addEventListener('click',e=>{if(e.target===$('#letterDialog'))closeLetter()});
  // A downward swipe closes the mobile letter sheet; vertical reading scroll remains native.
  let touchStart=null;const sheet=$('#letterDialog');sheet.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY}},{passive:true});sheet.addEventListener('touchend',e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(dy>95&&Math.abs(dy)>Math.abs(dx)*1.25&&sheet.scrollTop<8)closeLetter()},{passive:true});
  const feedbackReplies = [
    'Awww, nhận được chiếc reaction dễ thương của cậu rồi nè ♡',
    'Một lời cảm ơn thật xinh đã được gửi đi ✦',
    'Tụi mình vui vì cậu cảm nhận được sự quan tâm này ☀'
  ];
  $$('.feedback-options button').forEach((button,index)=>button.addEventListener('click',()=>{
    $$('.feedback-options button').forEach(b=>{
      const chosen=b===button;
      b.classList.toggle('selected',chosen);
      b.setAttribute('aria-pressed',String(chosen));
    });
    const thanks=$('#feedbackThanks');
    thanks.textContent=feedbackReplies[index];
    thanks.classList.remove('feedback-thanks-show');
    requestAnimationFrame(()=>thanks.classList.add('feedback-thanks-show'));
  }));
  $$('.grade-tab').forEach(btn=>btn.addEventListener('click',()=>{state.grade=btn.dataset.grade;$$('.grade-tab').forEach(t=>{const active=t===btn;t.classList.toggle('active',active);t.setAttribute('aria-pressed',String(active))});renderHearts()}));
  $('#heartSearch').addEventListener('input',e=>{state.query=e.target.value.trim();$('#clearSearch').hidden=!state.query;renderHearts()});$('#clearSearch').addEventListener('click',()=>{$('#heartSearch').value='';state.query='';$('#clearSearch').hidden=true;renderHearts();$('#heartSearch').focus()});
  $('#randomLetter').addEventListener('click',()=>{const options=filtered();if(!options.length)return toast('Chưa tìm thấy lớp phù hợp.');const item=options[Math.floor(Math.random()*options.length)];openLetter(item)});
  if(!reduced){const root=$('#stars');const count=innerWidth<600?18:38;for(let i=0;i<count;i++){const star=document.createElement('i');star.className='star';star.style.left=`${(i*67+13)%100}%`;star.style.top=`${(i*43+7)%100}%`;star.style.setProperty('--dur',`${5+i%5}s`);star.style.setProperty('--delay',`${-(i%8)}s`);root.append(star)}}
  // Video remains intentionally unconfigured until the owner supplies the final file.
  $('#memoryPlayer').addEventListener('loadedmetadata',()=>{$('#memoryEmpty').hidden=true});
  $('#memoryPlayer').addEventListener('ended',()=>{const invite=$('#filmInvite');invite.classList.add('film-finished');$('#filmInvite .invite-copy').textContent='Thước phim khép lại, nhưng những lời nhắn vẫn còn ở phía trước. Chạm xuống khu vườn để mở một trái tim nhé.';$('#filmInvite .eyebrow').textContent='THE NEXT LITTLE SURPRISE';$('#filmInvite .explore-call b').textContent='Mở khu vườn lời nhắn';invite.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});});
  renderHearts();
  // Mobile navigation closes the keyboard after selecting a section.
  $$('.mobile-dock a').forEach(link=>link.addEventListener('click',()=>{if(document.activeElement===$('#heartSearch'))$('#heartSearch').blur()}));
})();
