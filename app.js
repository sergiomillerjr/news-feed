const CAT={eua:{n:'EUA',e:'🇺🇸 ',c:'#1D4ED8',g:'linear-gradient(135deg,#1D4ED8,#60A5FA)'},mundo:{n:'Mundo',e:'🌐 ',c:'#16A34A',g:'linear-gradient(135deg,#15803D,#4ADE80)'},weston:{n:'Weston',e:'',c:'#065F46',g:'linear-gradient(135deg,#064E3B,#10B981)'},miami:{n:'Miami',e:'🌴 ',c:'#F97316',g:'linear-gradient(135deg,#F97316,#EC4899)'}};
const DEF={n:'Notícia',e:'',c:'#6B7280',g:'linear-gradient(135deg,#374151,#9CA3AF)'};
const IC={home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',eua:'<path d="M5 21V4m0 0h11l-2 4 2 4H5"/>',mundo:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',weston:'<path d="M4 20h16M6 20V10l6-5 6 5v10M10 20v-5h4v5"/>',miami:'<path d="M12 21V10M12 10c-2-4-6-4-8-2M12 10c2-4 6-4 8-2M12 10c-1-3-4-5-6-5M12 10c1-3 4-5 6-5"/>'};
const svg=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const TZ='America/New_York';let D=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cat=k=>CAT[k]||DEF;
const pill=k=>{const c=cat(k);return `<span class="pill" style="background:${c.c}">${c.e}${c.n}</span>`};
const bg=it=>it.image_url?`background-image:url('${esc(it.image_url)}'),${cat(it.category).g}`:`background-image:${cat(it.category).g}`;
function ago(iso){if(!iso)return '';const t=Date.parse(iso);if(isNaN(t))return '';const m=Math.max(0,(Date.now()-t)/6e4);if(m<60)return `Há ${Math.max(1,Math.round(m))} min`;const h=Math.round(m/60);return h<24?`Há ${h}h`:`Há ${Math.round(h/24)}d`}
const meta=it=>[esc(it.source),ago(it.published_at)].filter(Boolean).join(' • ');
function tabs(cur){document.getElementById('tabs').innerHTML=[['home','#/','Home'],...Object.keys(CAT).map(k=>[k,'#/'+k,CAT[k].n])].map(([k,h,n])=>`<a href="${h}" class="${cur===k?'on':''}">${svg(IC[k])}<span>${n}</span></a>`).join('')}
const card=it=>`<div class="card" onclick="go('${esc(it.id)}')">${pill(it.category)}<div class="t">${esc(it.title)}</div><div class="s">${esc(it.summary)}</div><div class="meta">${meta(it)}</div></div>`;
const row=it=>`<div class="card row" onclick="go('${esc(it.id)}')"><div class="tx">${pill(it.category)}<div class="t">${esc(it.title)}</div><div class="s">${esc(it.summary)}</div><div class="meta">${meta(it)}</div></div><div class="thumb" style="${bg(it)}"></div></div>`;
window.go=id=>location.hash='#/news/'+encodeURIComponent(id);
function home(){const it=D.items,h=+new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:TZ}).format(new Date());
const g=h>=5&&h<12?'Bom dia':h>=12&&h<18?'Boa tarde':'Boa noite';
let dt=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:TZ}).format(new Date());dt=dt.charAt(0).toUpperCase()+dt.slice(1);
const top=it.find(x=>x.image_url)||it[0];const words=it.reduce((a,x)=>a+((x.summary||'')+' '+(x.highlights||[]).join(' ')).split(/\s+/).length,0);const min=Math.max(1,Math.round(words/200));
let up='';if(D.generated_at){const t=new Date(D.generated_at);if(!isNaN(t))up=`Atualizado às ${new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:TZ}).format(t)}`}
return `<div class="head"><div><h1>Hoje</h1><div class="greet">${g}, Sergio,</div><div class="date">${dt}</div></div><div class="avatar">S</div></div>
${top?`<div class="hero" style="${bg(top)}" onclick="go('${esc(top.id)}')"><div class="in"><div class="kick">PRINCIPAL</div><h2>Resumo do dia</h2><p>As principais notícias do momento, explicadas em minutos.</p><div class="min">${min} min de leitura</div></div></div>`:''}
<h3 class="sec">Destaques</h3>${it.length?`<div class="grid">${it.map(card).join('')}</div>`:'<div class="empty">Nenhuma notícia no momento.</div>'}<div class="foot">${up}</div>`}
function list(k){const it=D.items.filter(x=>x.category===k);return `<div class="head"><div><h1>${cat(k).e}${cat(k).n}</h1><div class="date">${it.length} notícia${it.length===1?'':'s'}</div></div></div>${it.length?it.map(row).join(''):'<div class="empty">Nenhuma notícia nesta categoria.</div>'}`}
function detail(id){const it=D.items.find(x=>String(x.id)===id);if(!it)return '<div class="empty" style="padding-top:80px">Notícia não encontrada. <a href="#/">Voltar</a></div>';
const hl=Array.isArray(it.highlights)&&it.highlights.length?`<ul>${it.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>`:`<p>${esc(it.summary)}</p>`;
const body=(it.body||'').split(/\n\s*\n/).filter(s=>s.trim()).map(p=>`<p>${esc(p)}</p>`).join('');
return `<div class="dhero" style="${bg(it)}"><div class="btns"><button onclick="back()" aria-label="Voltar">${svg('<path d="M15 18l-6-6 6-6"/>')}</button><button onclick="share()" aria-label="Compartilhar">${svg('<path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6"/>')}</button></div><div class="in">${pill(it.category)}<h1>${esc(it.title)}</h1></div></div>
<div class="sheet"><div class="dmeta">${meta(it)}</div><div class="sum"><b>Em resumo</b>${hl}</div><div class="body">${body}</div>${it.source?`<div class="src">Fonte: ${esc(it.source)}</div>`:''}${it.url?`<a class="orig" href="${esc(it.url)}" target="_blank" rel="noopener">Ler original ↗</a>`:''}</div>`}
window.back=()=>history.length>1?history.back():location.hash='#/';
window.share=()=>{const it=D.items.find(x=>'#/news/'+encodeURIComponent(x.id)===location.hash);const d={title:it?.title,text:it?.summary,url:it?.url||location.href};navigator.share?navigator.share(d).catch(()=>{}):navigator.clipboard?.writeText(d.url)};
function render(){const h=location.hash||'#/',a=document.getElementById('app');let m;
if(!D){a.innerHTML='<div class="empty">Carregando…</div>';return}
if(m=h.match(/^#\/news\/(.+)$/)){document.body.classList.add('detail');a.innerHTML=detail(decodeURIComponent(m[1]));scrollTo(0,0);return}
document.body.classList.remove('detail');const k=h.slice(2);if(CAT[k]){tabs(k);a.innerHTML=list(k)}else{tabs('home');a.innerHTML=home()}scrollTo(0,0)}
async function load(){try{const r=await fetch('./news.json?t='+Date.now(),{cache:'no-store'});const j=await r.json();j.items=Array.isArray(j.items)?j.items:[];D=j}catch(e){if(!D){document.getElementById('app').innerHTML='<div class="empty">Não foi possível carregar as notícias.</div>';return}}render()}
addEventListener('hashchange',render);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
tabs('home');render();load();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
