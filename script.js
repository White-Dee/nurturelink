const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
let lang='si';
const toggle=$('#langToggle');
function setLanguage(next){
  lang=next; document.documentElement.lang=lang;
  $$('[data-si][data-en]').forEach(el=>{el.innerHTML=el.dataset[lang]});
  $$('.lang-toggle span').forEach((el,i)=>el.classList.toggle('active',(lang==='si'&&i===0)||(lang==='en'&&i===1)));
  localStorage.setItem('nurturelink-lang',lang);
}
toggle.addEventListener('click',()=>setLanguage(lang==='si'?'en':'si'));
setLanguage(localStorage.getItem('nurturelink-lang')||'si');

const menu=$('#nav'), menuBtn=$('#menuToggle');
menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

const serviceData={
 speech:{si:['කථන චිකිත්සාව','දරුවාට පැහැදිලිව අදහස් ප්‍රකාශ කිරීමට සහ අන් අය තේරුම් ගැනීමට අවශ්‍ය කුසලතා වර්ධනය කරමු.',['ශබ්ද හා වචන උච්චාරණය','වචන මාලාව හා වාක්‍ය ගොඩනැගීම','සමාජ සන්නිවේදනය හා විශ්වාසය']],en:['Speech Therapy','We develop the skills children need to express ideas clearly and understand others.',['Sounds and word pronunciation','Vocabulary and sentence building','Social communication and confidence']]},
 occupational:{si:['වෘත්තීය චිකිත්සාව','දෛනික කාර්යයන්හි ස්වාධීන වීමට අවශ්‍ය චාලක හා සංවේදී කුසලතා ක්‍රීඩාමය ලෙස ගොඩනගමු.',['සියුම් හා දළ චාලක කුසලතා','සංවේදී සැකසුම හා ස්වයං පාලනය','ඇඳුම් ඇඳීම, ලිවීම හා දෛනික කාර්යයන්']],en:['Occupational Therapy','We playfully build motor and sensory skills needed for independence in everyday activities.',['Fine and gross motor skills','Sensory processing and self-regulation','Dressing, writing and everyday tasks']]},
 education:{si:['අධ්‍යාපනික චිකිත්සාව','දරුවාගේ ඉගෙනීමේ ආකාරයට ගැලපෙන උපක්‍රම මගින් මූලික අධ්‍යාපනික කුසලතා ශක්තිමත් කරමු.',['කියවීම හා අවබෝධය','ලිවීම හා ගණිත මූලධර්ම','අවධානය, මතකය හා අධ්‍යයන පුරුදු']],en:['Educational Therapy','We strengthen foundational academic skills with strategies suited to each child’s way of learning.',['Reading and comprehension','Writing and maths foundations','Attention, memory and study habits']]},
 behaviour:{si:['චර්යාත්මක චිකිත්සාව','හැසිරීම පිටුපස ඇති අවශ්‍යතාව තේරුම් ගෙන ධනාත්මක, ප්‍රායෝගික කුසලතා ගොඩනගමු.',['හැඟීම් හඳුනාගැනීම හා ප්‍රකාශ කිරීම','දිනචර්යාවන් හා ධනාත්මක හැසිරීම්','දෙමාපියන් සඳහා ක්‍රියාකාරී මඟපෙන්වීම']],en:['Behavioural Therapy','We understand the need behind behaviour and build positive, practical skills.',['Recognising and expressing emotions','Routines and positive behaviour','Practical guidance for parents']]}
};
const dialog=$('#serviceDialog');
$$('.service-more').forEach(btn=>btn.addEventListener('click',()=>{const d=serviceData[btn.dataset.service][lang];$('#dialogTitle').textContent=d[0];$('#dialogText').textContent=d[1];$('#dialogList').innerHTML=d[2].map(x=>`<li>${x}</li>`).join('');dialog.showModal()}));
$('.dialog-close').addEventListener('click',()=>dialog.close());
$('#dialogBook').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

const quotes={si:[['“අපේ දරුවා දැන් තම අවශ්‍යතා වචන වලින් කියන්න පටන් අරන්. අපටත් ඔහුව තේරුම් ගන්න මඟ පෙන්වූ ආකාරයට බොහොම ස්තූතියි.”'],['“ඉතාමත් ඉවසීමෙන් සහ ආදරයෙන් දරුවා සමඟ වැඩ කළා. ඔහුගේ පුංචි ප්‍රගතීන් අපේ පවුලට විශාල සතුටක්.”'],['“සෑම පියවරක්ම අපට පැහැදිලි කර දුන්නා. දැන් නිවසේදීත් දරුවාට සහාය වන්නේ කොහොමද කියලා අපට විශ්වාසයි.”']],en:[['“Our child has started expressing his needs in words. We are deeply grateful for the way you also guided us to understand him.”'],['“She worked with our child with great patience and care. His small steps forward have brought our family so much joy.”'],['“Every step was explained clearly. We now feel confident supporting our child at home too.”']]};
$$('.dots button').forEach((b,i)=>b.addEventListener('click',()=>{$$('.dots button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#quote').textContent=quotes[lang][i][0]}));

$('#appointment').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const service=f.get('service');const msg=lang==='si'?`ආයුබෝවන් Nurturelink, හමුවීමක් වෙන්කර ගැනීමට කැමතියි.%0A%0Aනම: ${f.get('name')}%0Aදුරකථන: ${f.get('phone')}%0Aසේවාව: ${service}%0Aපණිවිඩය: ${f.get('message')||'-'}`:`Hello Nurturelink, I would like to request an appointment.%0A%0AName: ${f.get('name')}%0APhone: ${f.get('phone')}%0AService: ${service}%0AMessage: ${f.get('message')||'-'}`;window.open(`https://wa.me/94762885352?text=${encodeURI(msg)}`,'_blank')});
