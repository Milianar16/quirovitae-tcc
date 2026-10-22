const modal=document.querySelector("#bookingModal");
const openButtons=document.querySelectorAll(".open-booking");
const closeBtn=document.querySelector(".close-modal");
const toast=document.querySelector("#toast");
let step=1, selectedTime="", presetService="";

function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3500)}
function openModal(service=""){
  presetService=service; if(typeof mineEmail!=="undefined"&&mineEmail){const patient=getPatients()[mineEmail];if(patient){document.querySelector("#clientName").value=patient.name;document.querySelector("#clientPhone").value=patient.phone;document.querySelector("#clientEmail").value=patient.email}} modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); step=1; selectedTime=""; renderStep();
  if(service){document.querySelectorAll('input[name="service"]').forEach(i=>{if(i.value.startsWith(service+"|"))i.checked=true})}
}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
openButtons.forEach(b=>b.addEventListener("click",()=>openModal()));
closeBtn.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.querySelectorAll(".choose-service").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.service)));

function renderStep(){
  document.querySelectorAll(".booking-step").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===step));
  document.querySelector("#prevStep").style.visibility=step===1?"hidden":"visible";
  document.querySelector("#nextStep").textContent=step===4?"Confirmar agendamento":"Continuar";
  if(step===3) buildTimes();
  if(step===4) buildSummary();
}
function validateStep(){
  if(step===1)return !!document.querySelector('input[name="service"]:checked');
  if(step===2)return !!document.querySelector('input[name="professional"]:checked');
  if(step===3)return !!document.querySelector("#bookingDate").value && !!selectedTime;
  if(step===4)return ["#clientName","#clientPhone","#clientEmail"].every(id=>document.querySelector(id).checkValidity());
}
document.querySelector("#nextStep").addEventListener("click",()=>{
  if(!validateStep()){showToast(step===3?"Escolha uma data e um horário.":"Preencha os campos para continuar.");return}
  if(step<4){step++;renderStep()}else confirmBooking();
});
document.querySelector("#prevStep").addEventListener("click",()=>{if(step>1){step--;renderStep()}});
function buildTimes(){
  const grid=document.querySelector("#timeGrid"); grid.innerHTML="";
  ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"].forEach(t=>{
    const b=document.createElement("button");b.type="button";b.className="time-btn"+(selectedTime===t?" selected":"");b.textContent=t;
    if(isTaken(document.querySelector("#bookingDate").value,document.querySelector('input[name="professional"]:checked').value,t)){b.disabled=true;b.classList.add("disabled");b.classList.remove("selected");if(selectedTime===t)selectedTime=""}
    b.addEventListener("click",()=>{selectedTime=t;buildTimes()});grid.appendChild(b)
  });
}
function buildSummary(){
  const [service,price]=document.querySelector('input[name="service"]:checked').value.split("|");
  const prof=document.querySelector('input[name="professional"]:checked').value;
  const date=document.querySelector("#bookingDate").value.split("-").reverse().join("/");
  document.querySelector("#bookingSummary").innerHTML=`<strong>Resumo do agendamento</strong><br>${service} · R$ ${price}<br>${prof} · ${date} às ${selectedTime}`;
}
function confirmBooking(){
  const [service,price]=document.querySelector('input[name="service"]:checked').value.split("|");
  const prof=document.querySelector('input[name="professional"]:checked').value;
  const date=document.querySelector("#bookingDate").value;
  const booking={id:Date.now(),service,price,professional:prof,date,time:selectedTime,name:document.querySelector("#clientName").value,phone:document.querySelector("#clientPhone").value,email:document.querySelector("#clientEmail").value,status:"Confirmado",presence:"Aguardando"};
  const bookings=JSON.parse(localStorage.getItem("quiroBookings")||"[]");bookings.push(booking);localStorage.setItem("quiroBookings",JSON.stringify(bookings));
  closeModal();showToast("Consulta agendada com sucesso! Entraremos em contato para confirmar.");
  document.querySelector("#clientName").value="";document.querySelector("#clientPhone").value="";document.querySelector("#clientEmail").value="";
}
const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());document.querySelector("#bookingDate").min=today.toISOString().slice(0,10);
document.querySelector("#contactForm").addEventListener("submit",e=>{e.preventDefault();document.querySelector("#contactFeedback").textContent="Mensagem enviada! A equipe da Quiro Vitae entrará em contato.";e.target.reset()});
document.querySelector(".menu-btn").addEventListener("click",()=>{const n=document.querySelector("#mainNav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.flexDirection="column";n.style.position="absolute";n.style.top="78px";n.style.right="4%";n.style.background="#fff";n.style.padding="18px";n.style.borderRadius="12px";n.style.boxShadow="0 15px 30px #0002"});

/* ===== Presença e remarcação ===== */
const $=s=>document.querySelector(s), TIMES=["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"];
const store={get:()=>JSON.parse(localStorage.getItem("quiroBookings")||"[]"),set:b=>localStorage.setItem("quiroBookings",JSON.stringify(b))};
const fmt=d=>d.split("-").reverse().join("/");
const todayISO=()=>today.toISOString().slice(0,10);
function isTaken(date,prof,time,skip){return store.get().some(b=>b.id!==skip&&b.status!=="Cancelado"&&b.date===date&&b.professional===prof&&b.time===time)}
const presenceOf=b=>b.status==="Cancelado"?"Cancelado":(b.presence||"Aguardando");
const badge=b=>{const p=presenceOf(b);return `<span class="badge b-${p.toLowerCase()}">${p}</span>`};
const openM=m=>{m.classList.add("open");m.setAttribute("aria-hidden","false")};
const closeM=m=>{m.classList.remove("open");m.setAttribute("aria-hidden","true");if(location.hash==="#admin")history.replaceState(null,"",location.pathname+location.search)};
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeM(b.closest(".modal"))));
["#mineModal","#adminModal","#loginModal","#patientRegisterModal"].forEach(s=>{const m=$(s);m.addEventListener("click",e=>{if(e.target===m)closeM(m)})});
$("#bookingDate").addEventListener("change",()=>{if(step===3){selectedTime="";buildTimes()}});
document.querySelectorAll('input[name="professional"]').forEach(i=>i.addEventListener("change",()=>{selectedTime=""}));

/* ===== Área do paciente: cadastro, autenticação e consultas ===== */
let mineEmail="", resch=null;
const getPatients=()=>JSON.parse(localStorage.getItem("quiroPatients")||"{}");
const setPatients=p=>localStorage.setItem("quiroPatients",JSON.stringify(p));
const getPackages=()=>JSON.parse(localStorage.getItem("quiroPackages")||"{}");
const setPackages=p=>localStorage.setItem("quiroPackages",JSON.stringify(p));
const safeText=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
document.querySelectorAll(".open-mine").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();openM($("#mineModal"));$("#patientLoginForm").hidden=!!mineEmail;$("#patientDashboard").hidden=!mineEmail;syncPatientNav();if(mineEmail)renderPatientArea()}));
function syncPatientNav(){
  const link=$("#patientNavLink"); if(!link)return;
  const p=mineEmail?getPatients()[mineEmail]:null;
  if(p){link.classList.add("patient-nav-user");link.innerHTML=`<img class="patient-avatar" src="https://img.icons8.com/ios-filled/50/gender-neutral-user.png" alt="Avatar do paciente"><span class="patient-nav-name">${safeText(p.name)}</span>`;link.setAttribute("aria-label",`Área do paciente: ${p.name}`)}
  else{link.classList.remove("patient-nav-user");link.textContent="Minhas consultas";link.removeAttribute("aria-label")}
}
$("#showPatientRegister").addEventListener("click",()=>{closeM($("#mineModal"));openM($("#patientRegisterModal"))});
$("#patientRegisterForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const email=$("#registerEmail").value.trim().toLowerCase(), pass=$("#registerPass").value, confirmPass=$("#registerPassConfirm").value;
  const err=$("#patientRegisterError");err.textContent="";
  if(pass!==confirmPass){err.textContent="As senhas não coincidem.";return}
  const patients=getPatients();
  if(patients[email]){err.textContent="Já existe uma conta com este e-mail. Faça login.";return}
  patients[email]={name:$("#registerName").value.trim(),phone:$("#registerPhone").value.trim(),email,passwordHash:await sha(pass),createdAt:new Date().toISOString()};
  setPatients(patients);mineEmail=email;e.target.reset();closeM($("#patientRegisterModal"));openM($("#mineModal"));renderPatientArea();syncPatientNav();showToast("Cadastro criado com sucesso!");
});
$("#patientLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();const email=$("#patientLoginEmail").value.trim().toLowerCase(),pass=$("#patientLoginPass").value;
  const p=getPatients()[email];
  if(!p||p.passwordHash!==await sha(pass)){$("#patientLoginError").textContent="E-mail ou senha incorretos.";return}
  mineEmail=email;e.target.reset();$("#patientLoginError").textContent="";renderPatientArea();syncPatientNav();
});
$("#patientLogout").addEventListener("click",()=>{mineEmail="";$("#patientDashboard").hidden=true;$("#patientLoginForm").hidden=false;$("#patientLoginForm").reset();syncPatientNav();showToast("Você saiu da área do paciente.")});
function renderPatientArea(){
  const p=getPatients()[mineEmail];if(!p){mineEmail="";$("#patientDashboard").hidden=true;$("#patientLoginForm").hidden=false;return}
  $("#patientLoginForm").hidden=true;$("#patientDashboard").hidden=false;$("#patientWelcomeName").textContent=`Olá, ${p.name}!`;syncPatientNav();
  const pack=getPackages()[mineEmail], bookings=store.get().filter(b=>(b.email||"").toLowerCase()===mineEmail).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const attended=bookings.filter(b=>presenceOf(b)==="Compareceu").length;
  if(!pack){$("#patientPackage").innerHTML='<p class="empty">Você ainda não possui um pacote cadastrado. Entre em contato com a clínica para consultar as opções.</p>'}
  else{
    const total=Number(pack.sessions)||0, used=Math.min(attended,total), remaining=Math.max(total-used,0), price=Number(pack.price)||0, installments=Math.max(Number(pack.installments)||1,1), paid=Math.min(Number(pack.paidInstallments)||0,installments);
    $("#patientPackage").innerHTML=`<div class="patient-package"><h3>${safeText(pack.name)}</h3><div class="package-metrics"><div><strong>${total}</strong><span>Contratadas</span></div><div><strong>${used}</strong><span>Realizadas</span></div><div><strong>${remaining}</strong><span>Restantes</span></div></div><div class="progress-track"><span style="width:${total?used/total*100:0}%"></span></div><small>${total?Math.round(used/total*100):0}% do pacote concluído</small><hr><div class="package-details"><p><span>Valor total</span><strong>${price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong></p><p><span>Forma de pagamento</span><strong>${safeText(pack.payment)}</strong></p><p><span>Parcelamento</span><strong>${installments} × ${(price/installments).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong></p><p><span>Parcelas pagas</span><strong>${paid} de ${installments}</strong></p><p><span>Saldo pendente</span><strong>${Math.max(price-(price/installments)*paid,0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong></p>${pack.notes?`<p><span>Observações</span><strong>${safeText(pack.notes)}</strong></p>`:""}</div></div>`
  }
  renderMine();
}
function reschPanel(b){
  const slots=TIMES.map(t=>{const off=!resch.date||isTaken(resch.date,b.professional,t,b.id)||(resch.date===todayISO()&&t<=new Date().toTimeString().slice(0,5));return `<button type="button" class="time-btn${resch.time===t?" selected":""}${off?" disabled":""}" data-time="${t}" ${off?"disabled":""}>${t}</button>`}).join("");
  return `<div class="resch"><label>Nova data<input type="date" id="reschDate" min="${todayISO()}" value="${resch.date}"></label><div class="time-grid">${slots}</div><div class="appt-actions"><button type="button" class="btn btn-primary" data-act="save">Confirmar nova data</button><button type="button" class="btn btn-light" data-act="abort">Voltar</button></div></div>`
}
function renderMine(){
  if(!mineEmail)return;
  const list=store.get().filter(b=>(b.email||"").toLowerCase()===mineEmail).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $("#mineList").innerHTML=!list.length?'<p class="empty">Nenhuma consulta vinculada a este cadastro. Se você agendou com outro e-mail, entre em contato com a clínica.</p>':list.map(b=>{
    const p=presenceOf(b), live=p==="Aguardando"||p==="Confirmado"||p==="Confirmada";
    return `<div class="appt" data-id="${b.id}"><div class="appt-top"><div><strong>${safeText(b.service)}</strong><small>${safeText(b.professional)}</small><small>${fmt(b.date)} às ${safeText(b.time)}${b.from?` · remarcada de ${safeText(b.from)}`:""}</small></div>${badge(b)}</div>`+
    (live&&!(resch&&resch.id===b.id)?`<div class="appt-actions"><button class="btn btn-light" data-act="confirm">${p==="Confirmada"?"Desfazer confirmação":"Confirmar presença"}</button><button class="btn btn-light" data-act="resch">Remarcar</button><button class="btn btn-light" data-act="cancel">Cancelar</button></div>`:"")+
    (resch&&resch.id===b.id?reschPanel(b):"")+`</div>`}).join("");
}
function patch(id,fn){const all=store.get();const b=all.find(x=>x.id===id);if(b){fn(b);store.set(all)}}
$("#mineList").addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;const card=t.closest(".appt"),id=Number(card.dataset.id);
  if(t.dataset.time){resch.time=t.dataset.time;return renderMine()}
  switch(t.dataset.act){
    case"confirm":patch(id,b=>b.presence=b.presence==="Confirmada"?"Aguardando":"Confirmada");showToast("Confirmação atualizada.");break;
    case"cancel":if(!confirm("Cancelar esta consulta?"))return;patch(id,b=>b.status="Cancelado");showToast("Consulta cancelada.");break;
    case"resch":resch={id,date:"",time:""};break;
    case"abort":resch=null;break;
    case"save":if(!resch.date||!resch.time)return showToast("Escolha a nova data e o horário.");
      patch(id,b=>{b.from=`${fmt(b.date)} ${b.time}`;b.date=resch.date;b.time=resch.time;b.presence="Aguardando"});resch=null;showToast("Consulta remarcada com sucesso.");break;
    default:return}
  renderMine();
});
$("#mineList").addEventListener("change",e=>{if(e.target.id==="reschDate"){resch.date=e.target.value;resch.time="";renderMine()}});
/* Clínica */
function renderAdmin(){
  const all=store.get().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)), c=k=>all.filter(b=>presenceOf(b)===k).length;
  const done=c("Compareceu")+c("Faltou"), rate=done?Math.round(c("Compareceu")/done*100)+"%":"–";
  $("#adminStats").innerHTML=`<div><strong>${all.length}</strong><span>Agendadas</span></div><div><strong>${c("Compareceu")}</strong><span>Compareceram</span></div><div><strong>${c("Faltou")}</strong><span>Faltas</span></div><div><strong>${rate}</strong><span>Taxa de presença</span></div>`;
  const packages=getPackages();
  $("#adminPackages").innerHTML=Object.keys(packages).length?'<div class="admin-package-list"><h4>Pacotes cadastrados</h4>'+Object.entries(packages).map(([email,p])=>`<div class="admin-package-item"><strong>${safeText(p.name)}</strong><span>${safeText(email)}</span><small>${p.sessions} sessões · ${safeText(p.payment)} · ${p.paidInstallments}/${p.installments} parcelas pagas · ${Number(p.price).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</small><button type="button" class="btn btn-light" data-package-email="${safeText(email)}">Editar pacote</button></div>`).join("")+'</div>':'<p class="empty">Nenhum pacote cadastrado.</p>';
  $("#adminList").innerHTML=!all.length?'<p class="empty">Nenhum agendamento ainda. As consultas marcadas no site aparecem aqui.</p>':
  `<div class="tbl">`+all.map(b=>{const p=presenceOf(b);return `<div class="row" data-id="${b.id}"><div><strong>${b.name}</strong><small>${b.service} · ${b.professional}</small></div><div class="when">${fmt(b.date)}<small>${b.time}</small></div>${badge(b)}<div class="appt-actions">${p==="Cancelado"?"":`<button class="btn btn-light" data-p="Compareceu">Compareceu</button><button class="btn btn-light" data-p="Faltou">Faltou</button>${p==="Compareceu"||p==="Faltou"?'<button class="btn btn-light" data-p="Aguardando">Desfazer</button>':""}`}</div></div>`}).join("")+`</div>`;
}
$("#adminList").addEventListener("click",e=>{if(!isAdmin())return;const t=e.target.closest("button[data-p]");if(!t)return;patch(Number(t.closest(".row").dataset.id),b=>b.presence=t.dataset.p);renderAdmin();if(mineEmail)renderPatientArea()});

/* Cadastro e edição de pacotes — somente na área administrativa */
$("#packageForm").addEventListener("submit",e=>{
  e.preventDefault();if(!isAdmin()){return showToast("Acesso restrito à clínica.")}
  const email=$("#packageEmail").value.trim().toLowerCase(), sessions=Number($("#packageSessions").value), price=Number($("#packagePrice").value), installments=Number($("#packageInstallments").value), paid=Number($("#packagePaidInstallments").value);
  if(!email||sessions<1||price<0||installments<1||paid<0||paid>installments){$("#packageFeedback").textContent="Confira os dados do pacote e das parcelas.";return}
  const packages=getPackages();packages[email]={name:$("#packageName").value.trim(),sessions,price,payment:$("#packagePayment").value,installments,paidInstallments:paid,notes:$("#packageNotes").value.trim(),updatedAt:new Date().toISOString()};setPackages(packages);
  $("#packageFeedback").textContent="Pacote salvo com sucesso.";renderAdmin();if(mineEmail===email)renderPatientArea();
});
$("#adminPackages").addEventListener("click",e=>{
 const b=e.target.closest("button[data-package-email]");if(!b||!isAdmin())return;
 const email=b.dataset.packageEmail,p=getPackages()[email];if(!p)return;
 $("#packageEmail").value=email;$("#packageName").value=p.name;$("#packageSessions").value=p.sessions;$("#packagePrice").value=p.price;$("#packagePayment").value=p.payment;$("#packageInstallments").value=p.installments;$("#packagePaidInstallments").value=p.paidInstallments;$("#packageNotes").value=p.notes||"";
 $("#packageForm").scrollIntoView({behavior:"smooth",block:"center"});
});
/* Acesso restrito (administrador) */
const ADMIN={email:"admin@quirovitae.com.br",hash:"b68c6d7dcdb2076e9154e133bc8acc619e2f8018027c2d89218a3ef9ab227688"};
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,"0")).join("");
const isAdmin=()=>sessionStorage.getItem("quiroAdmin")==="1";
function openAdmin(){if(isAdmin()){renderAdmin();openM($("#adminModal"))}else{$("#loginError").textContent="";openM($("#loginModal"))}}
if(location.hash==="#admin")openAdmin();
window.addEventListener("hashchange",()=>{if(location.hash==="#admin")openAdmin()});
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault();const err=$("#loginError"),lock=Number(localStorage.getItem("quiroLock")||0);
  if(Date.now()<lock){err.textContent="Muitas tentativas. Aguarde 1 minuto para tentar de novo.";return}
  const ok=$("#admEmail").value.trim().toLowerCase()===ADMIN.email&&await sha($("#admPass").value)===ADMIN.hash;
  if(ok){sessionStorage.setItem("quiroAdmin","1");localStorage.removeItem("quiroFails");e.target.reset();closeM($("#loginModal"));renderAdmin();openM($("#adminModal"))}
  else{const n=Number(localStorage.getItem("quiroFails")||0)+1;localStorage.setItem("quiroFails",n);
    if(n>=5){localStorage.setItem("quiroLock",Date.now()+60000);localStorage.setItem("quiroFails",0);err.textContent="Muitas tentativas. Aguarde 1 minuto para tentar de novo."}
    else err.textContent="E-mail ou senha incorretos."}
});
$("#adminLogout").addEventListener("click",()=>{sessionStorage.removeItem("quiroAdmin");closeM($("#adminModal"));showToast("Você saiu da área da clínica.")});

document.querySelectorAll(".open-admin").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();openAdmin()}));
