
var $=function(s){return document.querySelector(s)},$$=function(s){return[].slice.call(document.querySelectorAll(s))};
var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
/* greeting + loader */
var h=new Date().getHours();$("#gr").textContent=h<12?"Good morning!":h<17?"Good afternoon!":"Good evening!";
function start(){document.body.classList.add("go")}
var ld=$("#ld"),n=$("#ldn");if(!ld){start()}else if(rm){ld.remove();start()}else{var t0=performance.now();(function c(t){var p=Math.min(1,(t-t0)/1100);n.textContent=String(Math.round(p*100)).padStart(3,"0");if(p<1)requestAnimationFrame(c);else{ld.classList.add("out");start();setTimeout(function(){ld.remove()},1000)}})(t0)}
setTimeout(start,3200);
/* hero portrait override */
var pi=new Image();pi.onload=function(){var b=$("#hbg");if(b)b.style.backgroundImage="url(/img/portrait.jpg)"};pi.src="/img/portrait.jpg";
var g=$("#gal"),pgi=$("#pgi");if(g){function up(){var m=g.scrollWidth-g.clientWidth;pgi.style.width=(25+(m>0?g.scrollLeft/m:0)*75)+"%"}g.addEventListener("scroll",up,{passive:true});up();
g.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){g.scrollBy({left:g.clientWidth*.6,behavior:"smooth"});e.preventDefault()}if(e.key==="ArrowLeft"){g.scrollBy({left:-g.clientWidth*.6,behavior:"smooth"});e.preventDefault()}});
var dr=null;g.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")return;dr={x:e.clientX,l:g.scrollLeft};g.classList.add("dg")});addEventListener("pointermove",function(e){if(dr)g.scrollLeft=dr.l-(e.clientX-dr.x)});addEventListener("pointerup",function(){if(dr){dr=null;g.classList.remove("dg")}});}
/* statement words */
var st=$("#stm"),ws=[];if(st){st.innerHTML=st.innerHTML.replace(/(<span class="ac">.*?<\/span>)|([^<\s]+)/g,function(m,a,b){return a?a.replace(/>(.*?)</,function(_,w){return'><span class="w">'+w+'</span><'}):'<span class="w">'+b+'</span>'});ws=$$("#stm .w")}
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});$$(".rv").forEach(function(e){io.observe(e)});
/* scroll: hero parallax + words */
var hbg=$("#hbg");/* hero frame sequence */
var SEQ_N=230,SEQ_P="/img/seq/",fr=[],cv=$("#seq"),cx=cv&&cv.getContext("2d"),hero=$("#hero"),lastF=-1,seqOK=false,heroIn=hero&&hero.querySelector(".in");
function drawF(i){while(i>0&&!(fr[i].complete&&fr[i].naturalWidth))i--;var im=fr[i];if(!im||!im.complete||!im.naturalWidth||i===lastF)return;lastF=i;cv.width=im.naturalWidth;cv.height=im.naturalHeight;cx.drawImage(im,0,0)}
if(cv){for(var q=1;q<=SEQ_N;q++){var im0=new Image();im0.src=SEQ_P+String(q).padStart(3,"0")+".jpg";fr.push(im0)}fr[0].onload=function(){seqOK=true;drawF(0)};fr[0].onerror=function(){cv.style.display="none"}}
function seqTick(y,vh){if(!hero)return;var t=Math.min(1,Math.max(0,(y-hero.offsetTop)/(hero.offsetHeight-vh)));if(seqOK)drawF(rm?0:Math.min(SEQ_N-1,Math.round(t*(SEQ_N-1))));if(heroIn&&!rm)heroIn.style.opacity=String(Math.max(0,1-t*1.15))}
function tick(){var y=scrollY,vh=innerHeight;seqTick(y,vh);
if(st){var r=st.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.3))),k=Math.round(p*ws.length);ws.forEach(function(w,i){w.classList.toggle("on",i<k)})}}
addEventListener("scroll",tick,{passive:true});tick();
/* page wipe */
var wp=$("#wp");function jump(sel){var el=document.querySelector(sel);if(!el)return;if(rm){el.scrollIntoView();return}wp.className="in";setTimeout(function(){el.scrollIntoView({behavior:"instant"});history.replaceState(null,"",sel);wp.className="out";setTimeout(function(){wp.className=""},420)},400)}
document.addEventListener("click",function(e){var a=e.target.closest('header a[href^="#"]');if(!a||a.getAttribute("href")==="#top")return;e.preventDefault();jump(a.getAttribute("href"))});
