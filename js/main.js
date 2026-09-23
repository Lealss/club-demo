(function(){
const c=window.siteConfig,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const ICONS={ball:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6c3 3 3 10.8 0 12.8M18.4 5.6c-3 3-3 10.8 0 12.8"/>',bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.6 0 4.5 1.8 4.5 4.5"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 20h8"/>'};
const svg=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[k]||ICONS.ball)+'</svg>';
const pending='<span class="pending">A confirmar</span>';
$$('[data-cfg]').forEach(e=>e.textContent=c[e.dataset.cfg]||'');
$('#schedules').innerHTML=c.schedules?esc(c.schedules):pending;
$('#clubText').textContent=c.clubText||'';
$('#clubTags').innerHTML=c.clubTags.map(t=>'<li>'+esc(t)+'</li>').join('');
function img(el,src){el.onload=()=>el.parentElement.classList.add('has-img');el.onerror=()=>el.remove();el.src=src}
img($('#heroImg'),c.heroImage);img($('#clubImg'),c.clubImage);
$('.hero-bg').insertAdjacentHTML('beforeend','<svg class="lines" viewBox="0 0 200 200" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="6"/><path d="M100 20v160M20 100h160"/></svg>');
$('#activities').innerHTML=c.activities.map(a=>'<article class="card rv"><div class="ico">'+svg(a.icon)+'</div><h3>'+esc(a.name)+'</h3><p>'+esc(a.text)+'</p><a class="more" href="#contacto">Más información</a></article>').join('');
$('#facilities').innerHTML=c.facilities.map(f=>'<article class="card fac rv"><figure class="ph" data-label="FOTO"><img alt="" loading="lazy"></figure><div><h3>'+esc(f.name)+'</h3><p>'+esc(f.text)+'</p></div></article>').join('');
$$('#facilities img').forEach((el,i)=>img(el,c.facilities[i].image));
$('#gallery').innerHTML=c.gallery.map((g,i)=>'<button type="button" class="ph rv '+(g.size||'')+'" data-i="'+i+'" data-label="'+esc(g.label)+'" aria-label="Ampliar foto '+(i+1)+'"><img alt="" loading="lazy"></button>').join('');
$$('#gallery img').forEach((el,i)=>img(el,c.gallery[i].image));
const lb=$('#lb');
$('#gallery').addEventListener('click',e=>{const b=e.target.closest('.ph');if(!b)return;const g=c.gallery[b.dataset.i],p=$('#lbph');
 p.dataset.label=g.label;p.classList.remove('has-img');const i=$('#lbimg');i.onload=()=>p.classList.add('has-img');i.onerror=()=>{i.removeAttribute('src')};i.src=g.image;lb.showModal()});
$('#lbx').onclick=()=>lb.close();lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
const addr=encodeURIComponent(c.address+', '+c.city);
const L={whatsapp:c.whatsapp?'https://wa.me/'+c.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(c.whatsappMsg):'',instagram:c.instagram,directions:'https://www.google.com/maps/dir/?api=1&destination='+addr};
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600)}
$$('[data-link]').forEach(a=>{const k=a.dataset.link,u=L[k];
 if(u){a.href=u;if(k!=='directions'){a.target='_blank';a.rel='noopener'}if(a.dataset.text)a.textContent=k==='whatsapp'?'+'+c.whatsapp.replace(/\D/g,''):u.replace(/^https?:\/\/(www\.)?/,'')}
 else if(a.dataset.text){a.outerHTML=pending}
 else a.addEventListener('click',e=>{e.preventDefault();toast('Link pendiente: se configura en js/config.js')})});
$('#map').src='https://www.google.com/maps?q='+addr+'&output=embed';
const nav=$('#nav'),menu=$('#menu'),bg=$('#burger');
const onS=()=>nav.classList.toggle('solid',scrollY>40||menu.classList.contains('open'));onS();addEventListener('scroll',onS,{passive:true});
function tog(o){menu.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);onS()}
bg.onclick=()=>tog(!menu.classList.contains('open'));
menu.addEventListener('click',e=>{if(e.target.closest('a'))tog(false)});
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
$$('.rv').forEach(e=>io?io.observe(e):e.classList.add('in'));
})();
