/* ══════════════════════════════════════════
   KALIBRE DIGITAL LABS — Shared JS
   ══════════════════════════════════════════ */

/* ── MOBILE NAV ── */
function closeNav(){
  document.getElementById('navMobile').classList.remove('open');
  document.getElementById('navHamburger').classList.remove('open');
  document.getElementById('navHamburger').setAttribute('aria-expanded','false');
}
document.getElementById('navHamburger').addEventListener('click',function(){
  var open=this.classList.toggle('open');
  document.getElementById('navMobile').classList.toggle('open',open);
  this.setAttribute('aria-expanded',open);
});

/* ── THREE.JS GALAXY ── */
(function(){
  var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
  var renderer=new THREE.WebGLRenderer({canvas:document.getElementById('bg'),alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  var geo=new THREE.BufferGeometry(),pos=[];
  for(var i=0;i<8000;i++){pos.push((Math.random()-.5)*2000,(Math.random()-.5)*2000,(Math.random()-.5)*2000);}
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  var stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0x00f0ff,size:0.9,transparent:true,opacity:0.7}));
  scene.add(stars);camera.position.z=5;
  var mx=0,my=0;
  document.addEventListener('mousemove',function(e){
    mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);
    var card=document.getElementById('contactCard');
    if(card&&!window.matchMedia('(hover:none),(pointer:coarse)').matches)card.style.transform='rotateY('+(mx*12)+'deg) rotateX('+(-my*12)+'deg)';
  });
  (function animate(){requestAnimationFrame(animate);stars.rotation.y+=0.0003+mx*0.0001;stars.rotation.x+=my*0.0001;renderer.render(scene,camera);})();
  window.addEventListener('resize',function(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
})();

/* ── REVEAL ON SCROLL ── */
(function(){
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(function(r){obs.observe(r);});
})();

/* ── CUSTOM CURSOR ── */
(function(){
  if(window.matchMedia('(hover:none),(pointer:coarse)').matches)return;
  var canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;top:0;left:0;pointer-events:none;z-index:99998;';
  canvas.width=innerWidth;canvas.height=innerHeight;
  document.body.appendChild(canvas);
  window.addEventListener('resize',function(){canvas.width=innerWidth;canvas.height=innerHeight;});
  var dot=document.createElement('div');
  dot.style.cssText='position:fixed;width:14px;height:14px;border-radius:50%;background:#00f0ff;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 10px #00f0ff,0 0 22px rgba(0,240,255,0.8);transition:transform 0.1s;';
  document.body.appendChild(dot);
  document.body.style.cursor='none';
  var ctx=canvas.getContext('2d'),particles=[],cmx=-200,cmy=-200;
  document.addEventListener('mousemove',function(e){
    var cvx=e.clientX-cmx,cvy=e.clientY-cmy,speed=Math.sqrt(cvx*cvx+cvy*cvy);
    cmx=e.clientX;cmy=e.clientY;
    dot.style.left=cmx+'px';dot.style.top=cmy+'px';
    var count=Math.min(6,2+Math.floor(speed/6));
    for(var i=0;i<count;i++){
      var isFront=Math.random()<0.55,spread=isFront?speed*.15:speed*.5,lag=isFront?0:1+Math.random()*2;
      particles.push({x:cmx-(cvx*lag*.08)+(Math.random()-.5)*spread,y:cmy-(cvy*lag*.08)+(Math.random()-.5)*spread,r:isFront?3+Math.random()*(4+speed*.09):2+Math.random()*(3+speed*.06),life:1,decay:isFront?.025+Math.random()*.02:.014+Math.random()*.016,vx:(Math.random()-.5)*.8-cvx*.03,vy:(Math.random()-.5)*.8-cvy*.03-.5,front:isFront});
    }
  });
  document.addEventListener('mousedown',function(){
    dot.style.transform='translate(-50%,-50%) scale(0.6)';
    for(var i=0;i<22;i++){var a=(i/22)*Math.PI*2,sp=2+Math.random()*4;particles.push({x:cmx,y:cmy,r:3+Math.random()*5,life:1,decay:.015+Math.random()*.018,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-.8,front:i%2===0});}
  });
  document.addEventListener('mouseup',function(){dot.style.transform='translate(-50%,-50%) scale(1)';});
  (function loop(){
    requestAnimationFrame(loop);ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];p.life-=p.decay;p.x+=p.vx;p.y+=p.vy;p.vx*=.96;p.vy*=.96;p.r*=.982;
      if(p.life<=0||p.r<.25){particles.splice(i,1);continue;}
      var t=1-p.life,r=p.front?Math.round(t*40):Math.round(80+t*175),g=p.front?Math.round(200+t*55):Math.round(t*20),b=p.front?255:Math.round(255-t*80);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba('+r+','+g+','+b+','+p.life*.9+')';ctx.fill();
    }
  })();
})();

/* ── LEAD FORM ── */
function submitLeadForm(){
  var name=document.getElementById('lf-name').value.trim();
  var phone=document.getElementById('lf-phone').value.trim();
  var email=document.getElementById('lf-email').value.trim();
  var service=document.getElementById('lf-service').value;
  if(!name||(!phone&&!email)){
    alert('Please enter your name and at least a phone number or email address.');
    return;
  }
  var msg='New enquiry from Kalibre website:%0A%0AName: '+encodeURIComponent(name)+'%0APhone: '+encodeURIComponent(phone)+'%0AEmail: '+encodeURIComponent(email)+'%0AService: '+encodeURIComponent(service||'Not specified')+'%0AMessage: '+encodeURIComponent(document.getElementById('lf-msg').value.trim()||'None');
  window.open('https://wa.me/27625411075?text='+msg,'_blank');
  document.getElementById('leadFormWrap').style.display='none';
  document.getElementById('formSuccess').style.display='block';
}

/* ── FAQ ── */
(function(){
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item'),answer=item.querySelector('.faq-answer'),isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(o){if(o!==item){o.classList.remove('open');o.querySelector('.faq-question').setAttribute('aria-expanded','false');o.querySelector('.faq-answer').style.maxHeight='0';}});
      if(isOpen){item.classList.remove('open');btn.setAttribute('aria-expanded','false');answer.style.maxHeight='0';}
      else{item.classList.add('open');btn.setAttribute('aria-expanded','true');answer.style.maxHeight=answer.scrollHeight+'px';}
    });
  });
  document.querySelectorAll('.faq-filter').forEach(function(f){
    f.addEventListener('click',function(){
      var cat=this.dataset.filter;
      document.querySelectorAll('.faq-filter').forEach(function(b){b.classList.remove('active');});
      this.classList.add('active');
      document.querySelectorAll('.faq-item.open').forEach(function(o){o.classList.remove('open');o.querySelector('.faq-question').setAttribute('aria-expanded','false');o.querySelector('.faq-answer').style.maxHeight='0';});
      document.querySelectorAll('.faq-item[data-cat]').forEach(function(item){item.classList.toggle('hidden',cat!=='all'&&item.dataset.cat!==cat);});
    });
  });
  var first=document.querySelector('.faq-item');
  if(first){first.classList.add('open');first.querySelector('.faq-question').setAttribute('aria-expanded','true');var ans=first.querySelector('.faq-answer');ans.style.maxHeight=ans.scrollHeight+'px';}
})();

/* ── TOUCH FLIP FOR SERVICE CARDS ── */
(function(){
  if(!window.matchMedia('(hover:none),(pointer:coarse)').matches)return;
  document.querySelectorAll('.service-flip').forEach(function(card){
    card.addEventListener('click',function(){card.classList.toggle('flipped');});
  });
})();

/* ── COOKIE SYSTEM (POPIA) ── */
(function(){
  var COOKIE_KEY='kd_cookie_consent_v2';
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',wait_for_update:500});
  function setCookie(val){var d=new Date();d.setFullYear(d.getFullYear()+1);document.cookie=COOKIE_KEY+'='+encodeURIComponent(JSON.stringify(val))+';expires='+d.toUTCString()+';path=/;SameSite=Lax';}
  function getCookie(){var m=document.cookie.match(new RegExp('(?:^|; )'+COOKIE_KEY+'=([^;]*)'));try{return m?JSON.parse(decodeURIComponent(m[1])):null;}catch(e){return null;}}
  function delCookie(n){document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';}
  function loadGA(id){if(window._kdGALoaded||!id||id==='G-XXXXXXX')return;window._kdGALoaded=true;var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+id;s.async=true;document.head.appendChild(s);gtag('js',new Date());gtag('config',id,{anonymize_ip:true});}
  function showToast(msg){var t=document.getElementById('kdToast');t.textContent=msg;t.classList.add('kd-show');setTimeout(function(){t.classList.remove('kd-show');},3500);}
  var GA_ID=''; /* INSERT YOUR GA4 MEASUREMENT ID e.g. 'G-XXXXXXXXXX' */
  function applyConsent(prefs,toast){
    setCookie({v:2,ts:new Date().toISOString(),prefs:prefs});
    gtag('consent','update',{analytics_storage:prefs.analytics?'granted':'denied',ad_storage:prefs.marketing?'granted':'denied'});
    if(prefs.analytics){loadGA(GA_ID);}else{delCookie('_ga');delCookie('_gid');document.cookie.split(';').forEach(function(c){if(c.trim().startsWith('_ga_'))delCookie(c.split('=')[0].trim());});}
    if(!prefs.marketing){delCookie('_gcl_au');delCookie('_fbp');}
    document.getElementById('kdCookie').classList.remove('kd-show');
    document.getElementById('kdCookieModal').classList.remove('kd-open');
    if(toast)showToast('✓ Preferences saved. You can change these anytime.');
  }
  window.kdToggleCat=function(cat){var b=document.getElementById('kd-body-'+cat);if(b)b.classList.toggle('kd-open');};
  window.kdOpenPrivacy=function(e){if(e)e.preventDefault();document.getElementById('kdPrivacyModal').classList.add('kd-open');};
  window.kdOpenCookieSettings=function(e){if(e)e.preventDefault();document.getElementById('kdCookieModal').classList.add('kd-open');};
  window.addEventListener('load',function(){
    var ex=getCookie();
    if(!ex||ex.v!==2){setTimeout(function(){document.getElementById('kdCookie').classList.add('kd-show');},1400);}
    else{applyConsent(ex.prefs,false);document.getElementById('kdToggleAnalytics').checked=!!ex.prefs.analytics;document.getElementById('kdToggleMarketing').checked=!!ex.prefs.marketing;}
  });
  function syncToggles(ex){if(ex&&ex.prefs){document.getElementById('kdToggleAnalytics').checked=!!ex.prefs.analytics;document.getElementById('kdToggleMarketing').checked=!!ex.prefs.marketing;}}
  document.getElementById('kdCookieAccept').onclick=function(){document.getElementById('kdToggleAnalytics').checked=true;document.getElementById('kdToggleMarketing').checked=true;applyConsent({analytics:true,marketing:true},true);};
  document.getElementById('kdCookieDecline').onclick=function(){document.getElementById('kdToggleAnalytics').checked=false;document.getElementById('kdToggleMarketing').checked=false;applyConsent({analytics:false,marketing:false},true);};
  document.getElementById('kdCookieManage').onclick=function(){syncToggles(getCookie());document.getElementById('kdCookieModal').classList.add('kd-open');document.getElementById('kdCookie').classList.remove('kd-show');};
  document.getElementById('kdRejectAll').onclick=function(){document.getElementById('kdToggleAnalytics').checked=false;document.getElementById('kdToggleMarketing').checked=false;applyConsent({analytics:false,marketing:false},true);};
  document.getElementById('kdSavePrefs').onclick=function(){applyConsent({analytics:document.getElementById('kdToggleAnalytics').checked,marketing:document.getElementById('kdToggleMarketing').checked},true);};
  document.getElementById('kdReopenBtn').onclick=function(){syncToggles(getCookie());document.getElementById('kdCookieModal').classList.add('kd-open');};
  document.getElementById('kdCookieModal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('kd-open');});
  document.getElementById('kdPrivacyModal').addEventListener('click',function(e){if(e.target===this)this.classList.remove('kd-open');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.getElementById('kdCookieModal').classList.remove('kd-open');document.getElementById('kdPrivacyModal').classList.remove('kd-open');}});
})();
