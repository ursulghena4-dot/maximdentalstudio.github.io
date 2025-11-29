


const form       = document.getElementById('contactForm');
const statusEl   = document.getElementById('formStatus');
const phoneInput = document.getElementById('phone');

// ====== КАРТА (Яндекс) ======
(function waitYmaps(){
  if (window.ymaps && typeof ymaps.ready === 'function') {
    ymaps.ready(initMap);
  } else {
    setTimeout(waitYmaps, 50);
  }
})();

function initMap() {
  const metroExit = [55.740510, 37.656369]; // Марксистская, выход 5
  const clinic    = [55.738670, 37.659549]; // Клиника

  const map = new ymaps.Map('map', {
    center: [(metroExit[0] + clinic[0]) / 2, (metroExit[1] + clinic[1]) / 2],
    zoom: 16,
    controls: ['zoomControl','fullscreenControl'] // кнопки
  }, { suppressMapOpenBlock: true });

  // >>> увеличиваем трекпадом и пальцами
  map.behaviors.enable('drag');
  map.behaviors.enable('scrollZoom'); // колесо/трекпад
  map.behaviors.enable('multiTouch'); // pinch на телефоне
  map.behaviors.enable('dblClickZoom');

  const route = new ymaps.multiRouter.MultiRoute({
    referencePoints: [metroExit, clinic],
    params: { routingMode: 'pedestrian' }
  }, {
    wayPointVisible:false, viaPointVisible:false,
    routeStrokeColor:"#FF8A00", routeStrokeWidth:6
  });

  const metroPlacemark  = new ymaps.Placemark(metroExit,{ balloonContent:'🚇 Марксистская, выход 5' },{ preset:'islands#blueCircleIcon' });
  const clinicPlacemark = new ymaps.Placemark(clinic,{ balloonContent:'🏥 Smile Concept' },{ preset:'islands#redMedicalIcon' });

  map.geoObjects.add(route).add(metroPlacemark).add(clinicPlacemark);
  route.model.events.add('requestsuccess',()=> map.setBounds(route.getBounds(), {checkZoomRange:true, zoomMargin:40}) );

  // кнопка «Открыть карту» на самой карте (если есть)
  document.getElementById('btn-open-yandex')?.addEventListener('click',()=>{
    window.open(`https://yandex.ru/maps/?rtext=${metroExit.join(',')}~${clinic.join(',')}&rtt=pd`,'_blank');
  });
}

// ====== ВИДЖЕТ WhatsApp/Telegram ======
document.addEventListener('DOMContentLoaded', function(){

  const WHATSAPP_PHONE    = "79803617809";      // без +
  const TELEGRAM_USERNAME = "maxim_tyrtyshnyy";  // без @

  const PRESETS = {
    "Запись": [
      "Здравствуйте! Я с вашего сайта. Хочу записаться на консультацию.",
      "Добрый день! Запишите, пожалуйста, на ближайшее свободное время.",
      "Здравствуйте! Нужен осмотр и план лечения. Когда удобно подойти?",
      "Можно записаться к доктору на утро или вечер?",
      "Подскажите, есть ли запись на ближайшие выходные?"
    ],
    "Болит зуб": [
      "Сильно болит зуб. Можно записаться как можно скорее?",
      "Опухла десна, требуется срочный приём.",
      "Боль при холодном/горячем — когда можно на диагностику?",
      "Подскажите, можно ли сегодня подойти на осмотр?"
    ],
    "Гигиена": [
      "Интересует профессиональная чистка. Какая стоимость и ближайшие даты?",
      "Хочу записаться на гигиену и фторирование.",
      "Делаете ли ультразвуковую чистку и AirFlow?",
      "Когда лучше делать чистку перед лечением?",
      "Можно ли прийти вдвоём на чистку — я и супруг(а)?"
    ],
    "Отбеливание": [
      "Подскажите цену и длительность отбеливания. Когда можно записаться?",
      "Нужна консультация по отбеливанию и противопоказаниям.",
      "Какой метод используете — Zoom или лазерное отбеливание?",
      "Отбеливание безопасно для эмали? Делаете ли под наркозом?",
      "Сколько держится эффект отбеливания и как ухаживать после?"
    ],
    "Детский приём": [
      "Хотим записать ребёнка на осмотр. Есть ли ближайшие окна?",
      "Детская чистка и герметизация фиссур — стоимость и запись?",
      "С какого возраста принимаете детей?",
      "Делаете ли лечение под седацией или наркозом?",
      "Ребёнок боится врачей — есть ли у вас детский специалист?"
    ],
    "Протезирование": [
      "Хочу уточнить по протезированию — коронки, вкладки, мосты. Когда можно на консультацию?",
      "Нужна установка коронки на зуб. Подскажите цену и сроки.",
      "Делаете ли безметалловые или циркониевые коронки?",
      "Можно ли поставить временную коронку на период лечения?",
      "Интересует полное протезирование — можно рассчитать стоимость?"
    ],
    "Виниры": [
      "Скажите, пожалуйста, цену виниров и сколько их обычно нужно на улыбку?",
      "Хочу установить виниры — можно ли прийти на консультацию?",
      "Какие материалы используете — керамика или композит?",
      "Делаете ли примерку до установки (mock-up)?",
      "Сколько по времени изготавливаются виниры?"
    ],
    "Эстетика": [
      "Интересует реставрация передних зубов. Какая стоимость?",
      "Хочу улучшить цвет и форму зубов. Можно консультацию по эстетике?",
      "Делаете ли художественную реставрацию?",
      "Хочу обновить старые пломбы на передних зубах. Можно?",
      "Возможна ли коррекция формы зубов без брекетов?"
    ]
  };

  const widget        = document.getElementById("waWidget");
  const waBtn         = document.getElementById("waBtn");
  const tgBtn         = document.getElementById("tgBtn");
  const panel         = document.getElementById("waPanel");
  const panelClose    = document.getElementById("panelClose");
  const msgList       = document.getElementById("msgList");
  const msgSearch     = document.getElementById("msgSearch");
  const addCustom     = document.getElementById("addCustom");
  const chipsWrap     = document.getElementById("chips");
  const composer      = document.getElementById("composer");
  const composerText  = document.getElementById("composerText");
  const composerSend  = document.getElementById("composerSend");
  const composerCancel= document.getElementById("composerCancel");

  // если виджета нет на странице — выходим
  if (!widget) return;

  function navigate(url){
    try {
      const win = window.open(url, "_blank", "noopener");
      if (win && win.focus) { win.focus(); return; }
    } catch(e){}
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function openWhatsApp(message){
    const phone = (WHATSAPP_PHONE||'').replace(/[^\d]/g,'');
    if (!phone) return;
    navigate(`https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`);
  }
  function openTelegramProfile(){
    if (!TELEGRAM_USERNAME) return;
    navigate(`https://t.me/${TELEGRAM_USERNAME}`);
  }

  let activeCategory = "Все";
  const allCats = ["Все", ...Object.keys(PRESETS)];
  allCats.forEach(cat=>{
    const b = document.createElement('button');
    b.type='button';
    b.className = 'chip' + (cat==='Все'?' active':'');
    b.textContent = cat;
    b.addEventListener('click', ()=>{
      widget.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      b.classList.add('active');
      activeCategory = cat;
      renderList();
    });
    chipsWrap?.appendChild(b);
  });

  function fakeTime(){
    const n=new Date();
    return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
  }

  function renderList(){
    if (!msgList) return;
    const q=(msgSearch?.value||"").toLocaleLowerCase();
    msgList.innerHTML='';
    let pool=[];
    if (activeCategory==="Все"){ for (const cat of Object.keys(PRESETS)) pool = pool.concat(PRESETS[cat]); }
    else { pool = PRESETS[activeCategory] || []; }
    const filtered = q ? pool.filter(t => t.toLocaleLowerCase().includes(q)) : pool;

    if (!filtered.length){
      const e=document.createElement('div');
      e.className='msg-item'; e.style.opacity=.8; e.style.cursor='default';
      e.textContent='Ничего не найдено. Попробуйте другой запрос.';
      msgList.appendChild(e); return;
    }
    filtered.forEach(txt=>{
      const item=document.createElement('button');
      item.type='button'; item.className='msg-item';
      item.innerHTML=`<span>${txt}</span> <span class="time">${fakeTime()}</span>`;
      item.addEventListener('click', ()=>{ openWhatsApp(txt); closePanel(); });
      msgList.appendChild(item);
    });
  }

  function openPanel(){
    panel?.classList.add('open');
    if (msgSearch) msgSearch.value='';
    activeCategory='Все';
    widget.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    widget.querySelector('.chip')?.classList.add('active');
    renderList();
    waBtn?.setAttribute('aria-expanded','true');
  }
  function closePanel(){
    panel?.classList.remove('open');
    waBtn?.setAttribute('aria-expanded','false');
    closeComposer();
  }

  function openComposer(prefill=''){
    if (!composer) return;
    composer.hidden=false;
    if (composerText){ composerText.value=prefill; composerText.focus(); }
    composer.scrollIntoView({block:'nearest'});
  }
  function closeComposer(){
    if (!composer) return;
    composer.hidden=true;
    if (composerText) composerText.value='';
  }

  waBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); openPanel(); });
  tgBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); openTelegramProfile(); });
  panelClose?.addEventListener('click', (e)=>{ e.stopPropagation(); closePanel(); });
  document.addEventListener('click', (e)=>{ if (!e.target.closest?.('#waWidget')) closePanel(); });

  ['input','keyup','change'].forEach(ev => msgSearch?.addEventListener(ev, renderList));
  addCustom?.addEventListener('click', (e)=>{ e.stopPropagation(); openComposer(); });
  composerCancel?.addEventListener('click', (e)=>{ e.stopPropagation(); closeComposer(); });
  composerSend?.addEventListener('click', (e)=>{
    e.stopPropagation();
    const val = (composerText?.value || '').trim();
    if (!val){ composerText?.focus(); return; }
    openWhatsApp(val); closePanel();
  });
  composerText?.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); composerSend?.click(); }
  });

});





// ====== REVEAL ======
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window) || !els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  },{threshold:.2});
  els.forEach(el => io.observe(el));
})();

// ====== ПАРАЛЛАКС ДЛЯ ФОТО В HERO ======
(function(){
  const card = document.querySelector('.hero-pro__card[data-parallax]');
  if(!card) return;
  const area = card.parentElement;
  const strength = 18;
  let raf = 0, tx=0, ty=0, cx=0, cy=0;

  const loop = ()=>{ cx += (tx-cx)*0.12; cy += (ty-cy)*0.12;
    card.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = requestAnimationFrame(loop);
  };

  const move = (x,y,rect)=>{
    const rx = ((x - rect.left)/rect.width - .5) * 2;
    const ry = ((y - rect.top)/rect.height - .5) * 2;
    tx = rx*strength; ty = ry*strength;
    if(!raf) raf = requestAnimationFrame(loop);
  };

  area.addEventListener('mousemove', e => move(e.clientX,e.clientY,area.getBoundingClientRect()));
  area.addEventListener('mouseleave', ()=>{ tx=0; ty=0; if(!raf) raf=requestAnimationFrame(loop); });
  area.addEventListener('touchmove', e=>{
    const t = e.touches[0]; move(t.clientX, t.clientY, area.getBoundingClientRect());
  }, {passive:true});
  area.addEventListener('touchend', ()=>{ tx=0; ty=0; if(!raf) raf=requestAnimationFrame(loop); });
})();

// ====== СТАТУС «ОТКРЫТО/ЗАКРЫТО» + КОПИРОВАНИЕ ТЕЛЕФОНА ======
(function(){
  const badge=document.getElementById('open-status');
  const note=document.getElementById('next-open');
  if (!badge || !note) return;

  const t2m=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
  const dd=[...document.querySelectorAll('.sb-hours__grid dd')].map(el=>el.dataset.hours);
  const hours={1:dd[0],2:dd[0],3:dd[0],4:dd[0],5:dd[0],6:dd[1],7:dd[2]};
  const now=new Date(), wd=((now.getDay()+6)%7)+1, slot=hours[wd];
  let open=false,end=null;
  if(slot?.includes('-')){const[s,e]=slot.split('-'); const cur=now.getHours()*60+now.getMinutes(); open=cur>=t2m(s)&&cur<=t2m(e); end=e;}
  badge.textContent=open?'Сейчас открыто':'Сейчас закрыто';
  badge.classList.toggle('is-open',open); badge.classList.toggle('is-closed',!open);
  note.textContent=open?`Сегодня до ${end}.`:'Откроемся по графику.';

  const btn=document.getElementById('btn-copy');
  const tel=document.querySelector('.sb-phone');
  btn?.addEventListener('click',async()=>{
    try{
      await navigator.clipboard.writeText((tel?.textContent||'').replace(/[^\d+]/g,''));
      btn.textContent='Скопировано ✔'; setTimeout(()=>btn.textContent='Скопировать',1500);
    }catch{
      btn.textContent='Ошибка'; setTimeout(()=>btn.textContent='Скопировать',1500);
    }
  });
})();
// ===== Аккордеон в прайсе: в одной карточке открыт только один details =====
(function () {
  const cards = document.querySelectorAll('.ps-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const detailsList = card.querySelectorAll('.ps-item--more details');
    if (!detailsList.length) return;

    detailsList.forEach(dtl => {
      dtl.addEventListener('toggle', () => {
        // реагируем только на ОТКРЫТИЕ
        if (!dtl.open) return;

        detailsList.forEach(other => {
          if (other !== dtl) {
            other.open = false; // закрываем остальные
          }
        });
      });
    });
  });
})();
// ===== Аккордеон в прайсе: в одной карточке открыт только один details =====

    

// ===== Показать ещё работы (6 + 6) =====
(function () {
  const section   = document.getElementById('works');
  if (!section) return;

  const btn       = document.getElementById('worksMoreBtn');
  const extras    = section.querySelectorAll('.work-card--extra');
  const firstCard = section.querySelector('.work-card');

  if (!btn || !extras.length || !firstCard) return;

  btn.addEventListener('click', () => {
    const expanded = section.classList.toggle('works--expanded');

    btn.textContent = expanded
      ? 'Скрыть часть работ'
      : 'Показать ещё работы';

    // ВСЕГДА после клика возвращаемся к началу первых 6 фото
    firstCard.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
})();

// ===== Видео-отзывы: проигрываем прямо в карточке =====
(function () {
  const cards = document.querySelectorAll('.reviews-video-card');
  if (!cards.length) return;

  // Останавливаем все видео и возвращаем превью
  function stopAll() {
    cards.forEach(card => {
      const inner = card.querySelector('.reviews-video-card__inner');
      const img = inner.querySelector('img');
      const btn = inner.querySelector('.reviews-video-card__play');
      const iframe = inner.querySelector('iframe');

      if (iframe) iframe.remove();
      if (img) img.style.display = '';
      if (btn) btn.style.display = '';
      card.removeAttribute('data-playing');
    });
  }

  // Запускаем видео в конкретной карточке
  function play(card) {
    const inner = card.querySelector('.reviews-video-card__inner');
    const img = inner.querySelector('img');
    const btn = inner.querySelector('.reviews-video-card__play');
    const baseUrl = card.dataset.video;
    if (!baseUrl) return;

    // Остановить все остальные
    stopAll();

    const iframe = document.createElement('iframe');
    const autoplayUrl = baseUrl.includes('?')
      ? baseUrl + '&autoplay=1'
      : baseUrl + '?autoplay=1';

    iframe.src = autoplayUrl;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    if (img) img.style.display = 'none';
    if (btn) btn.style.display = 'none';

    inner.appendChild(iframe);
    card.setAttribute('data-playing', '1');
  }

  // Вешаем обработчики на каждую карточку
  cards.forEach(card => {
    const inner = card.querySelector('.reviews-video-card__inner');
    const btn = inner.querySelector('.reviews-video-card__play');

    // клик по всей карточке
    inner.addEventListener('click', () => play(card));

    // клик по кнопке play (чтобы не всплывал лишний event)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      play(card);
    });
  });
})();
