const EMAIL = "prenom.nom@exemple.com";

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const toastEl = $("#toast");
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("is-on");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=> toastEl.classList.remove("is-on"), 1600);
}

function copyEmail(){
  navigator.clipboard?.writeText(EMAIL)
    .then(()=> toast("Email copié ✅"))
    .catch(()=> toast("Copie impossible (navigateur)"));
}

function setYear(){
  $("#year").textContent = new Date().getFullYear();
}

function initTheme(){
  const saved = localStorage.getItem("theme");
  if(saved === "light") document.body.classList.add("light");

  const btn = $("#themeBtn");
  const icon = btn.querySelector(".icon");

  const syncIcon = () => {
    const isLight = document.body.classList.contains("light");
    icon.textContent = isLight ? "☀" : "☾";
  };
  syncIcon();

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    syncIcon();
    toast("Thème changé ✨");
  });
}

function initDrawer(){
  const drawer = $("#drawer");
  const openBtn = $("#burgerBtn");
  const closeBtn = $("#closeDrawerBtn");
  const backdrop = $("#drawerBackdrop");

  const open = () => {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);

  $$(".drawer__link").forEach(a => a.addEventListener("click", close));
}

function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting) e.target.classList.add("is-visible");
    }
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => io.observe(el));
}

function initShineAndTilt(){
  const card = $("#tiltCard");
  if(!card) return;

  const maxTilt = 8;

  function onMove(e){
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    card.style.setProperty("--mx", `${Math.round(x*100)}%`);
    card.style.setProperty("--my", `${Math.round(y*100)}%`);

    const rx = (y - 0.5) * -maxTilt;
    const ry = (x - 0.5) *  maxTilt;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }

  function reset(){
    card.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0)`;
  }

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", reset);
}

function renderProjects(){
  const projects = [
    {
      title: "Dashboard KPI (Power BI)",
      desc: "Tableau de bord pilotage : marge, OPEX, performance commerciale, drill-down par BU.",
      tags: ["Power BI", "KPI", "DAX"],
      live: "#",
      repo: "#"
    },
    {
      title: "Budget & Rolling Forecast",
      desc: "Modèle budget/forecast : hypothèses, scénarios, suivi écarts et analyse des drivers.",
      tags: ["FP&A", "Excel", "Scénarios"],
      live: "#",
      repo: "#"
    },
    {
      title: "Optimisation Clôture Mensuelle",
      desc: "Standardisation & contrôles : fiabilisation, réduction des retards et meilleure traçabilité.",
      tags: ["Process", "Contrôles", "M-1"],
      live: "#",
      repo: "#"
    }
  ];

  const grid = $("#projectsGrid");
  grid.innerHTML = projects.map(p => `
    <article class="card reveal">
      <div class="card__media" aria-hidden="true"></div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__meta">
          <div class="tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div class="card__actions">
            <a class="btn btn--ghost" href="${p.repo}" target="_blank" rel="noreferrer">
              <span class="icon">⌁</span><span class="hide-sm">Détails</span>
            </a>
            <a class="btn btn--primary" href="${p.live}" target="_blank" rel="noreferrer">
              <span class="icon">↗</span><span class="hide-sm">Aperçu</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  initReveal();
}

function initCopyButtons(){
  $("#emailText").textContent = EMAIL;
  $("#copyEmailBtn").addEventListener("click", copyEmail);
  $("#copyEmailBtn2").addEventListener("click", copyEmail);
}

setYear();
initTheme();
initDrawer();
initReveal();
initShineAndTilt();
renderProjects();
initCopyButtons();
