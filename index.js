gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   HERO — Eclipse animation
══════════════════════════════════════ */
const tlHero = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "+=1200",
    scrub: 2
  }
});

tlHero.to(".eclipsehero", {
  rotation: 30,
  y: "40vw",
  ease: "power1.inOut"
}, 0);

tlHero.to(".eclipsehero", {
  opacity: 1,
  ease: "power1.inOut"
}, 0);

if (window.innerWidth <= 1024) {
  gsap.to(".eclipsehero", {
    rotation: 90,
    y: "150vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 2,
    }
  });
}


/* ══════════════════════════════════════
   SERVICES — Cards + ScrollTrigger
══════════════════════════════════════ */
(function initServices() {

  const data = [
    {
      title: "Conception de site performant",
      text:  "Je conçois des sites internet rapides, modernes et soignés, pensés pour donner une vraie présence en ligne à votre activité. Chaque site est créé sur mesure, avec attention aux détails, pour refléter votre image et séduire vos visiteurs dès le premier regard.",
      cta: false,
    },
    {
      title: "Refonte de site existant",
      text:  "Votre site web ne vous représente plus ou manque de modernité ? Je lui redonne vie avec un design rafraîchi, une meilleure expérience utilisateur et des performances optimisées pour que votre image en ligne soit enfin à la hauteur de votre travail.",
      cta: false,
    },
    {
      title: "Stratégie web",
      text:  "Un beau site, c'est bien. Un site qui atteint vos objectifs, c'est mieux. Je vous accompagne dans la réflexion de votre présence en ligne choix des contenus, structure, image de marque pour que chaque décision soit pensée pour vous et vos clients.",
      cta: false,
    },
    {
      title: "",
      text:  "",
      cta: true,
    },
  ];

  const section  = document.querySelector(".services");
  const encre    = document.querySelector(".card-encre");
  const cardPrev = document.querySelector(".card-prev");
  const cardNext = document.querySelector(".card-next");
  const dots     = document.querySelectorAll(".dot");
  const total    = data.length;
  let current    = 0;

  // ── Rendu du contenu dans la grande card ──
  function renderEncre(index) {
    const inner = document.querySelector(".card-inner");

    if (data[index].cta) {
      inner.innerHTML = `
        <div class="card-cta-inner">
          <div class="big-label">CONSCIENT</div>
          <div class="big-label">RAPIDE</div>
         <a href="mailto:jeremyhelin93@gmail.com" class="btn">
        Me contacter
        <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7""")/>></svg>
      </a>
        </div>
      `;
      encre.classList.add("is-cta");

      gsap.fromTo(encre,
        { x: 0 },
        {
          x: 8,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 10,
          onComplete() { gsap.set(encre, { x: 0 }); }
        }
      );

    } else {
      inner.innerHTML = `
        <h3 class="card-title"></h3>
        <p class="card-text"></p>
      `;
      document.querySelector(".card-title").textContent = data[index].title;
      document.querySelector(".card-text").textContent  = data[index].text;
      encre.classList.remove("is-cta");
    }
  }

  // ── Mise à jour des cards latérales ──
  function renderSides(index) {
    const prev = (index - 1 + total) % total;
    const next = (index + 1) % total;

    gsap.to([cardPrev, cardNext], {
      opacity: 0,
      duration: 0.2,
      onComplete() {
        cardPrev.querySelector("h3").textContent = data[prev].cta ? "Me contacter" : data[prev].title;
        cardPrev.querySelector("p").textContent  = data[prev].cta ? "Parlons de votre projet." : data[prev].text;
        cardNext.querySelector("h3").textContent = data[next].cta ? "Me contacter" : data[next].title;
        cardNext.querySelector("p").textContent  = data[next].cta ? "Parlons de votre projet." : data[next].text;
        gsap.to([cardPrev, cardNext], { opacity: 1, duration: 1 });
      }
    });
  }

  // ── Animation de transition ──
  function updateCards(index, direction) {
    const outX = direction > 0 ? "-40px" : "40px";
    const inX  = direction > 0 ?  "40px" : "-40px";

    gsap.to(".card-inner", {
      x: outX,
      opacity: 0,
      duration: 0.50,
      ease: "power2.in",
      onComplete() {
        renderEncre(index);
        gsap.fromTo(".card-inner",
          { x: inX, opacity: 0 },
          { x: 0,   opacity: 1, duration: 1, ease: "power2.out" }
        );
      }
    });

    renderSides(index);
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function goTo(index) {
    if (index === current) return;
    const dir = index > current ? 1 : -1;
    updateCards(index, dir);
    current = index;
  }

  // ── Init ──
  renderEncre(0);
  renderSides(0);

  // ── ScrollTrigger avec pin — un seul, pas de doublon ──
  ScrollTrigger.create({
    trigger: section,
    start:   "top top",
    end:     `+=${(total - 1) * 500}vh`,
    pin:     true,
    scrub:   true,
    snap: {
      snapTo:   1 / (total - 1),
      duration: { min: 2, max: 3 },
      ease:     "power1.inOut",
    },
    onUpdate(self) {
      const index = Math.round(self.progress * (total - 1));
      goTo(index);
    }
  });

  // ── Swipe mobile ──
  let touchStartX = 0;
  section.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  section.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0
        ? Math.min(current + 1, total - 1)
        : Math.max(current - 1, 0)
      );
    }
  }, { passive: true });

})();


const pages = [
  [
    { title: "Intégration & Développement web", desc: "Openclassrooms — 02/2023 – 02/2024. Formation complète en intégration web, développement front-end et React." },
    { title: "Coaching personnel et professionnel", desc: "Fédération Formation PNL – CMA — 09/2021 – 12/2021. Programmation neuro-linguistique appliquée au développement personnel." },
    { title: "Manager d'unité marchande", desc: "AFPA — 04/2021 – 07/2021. Gestion d'équipe, pilotage des ventes et développement commercial." }
  ],
  [
    { title: "CAP Agent Cynophile", desc: "Formation Franck LE MEUR – Pézenas — 2012. Dressage canin et utilisation du chien en sécurité." },
    { title: "CAP APS – Agent de Prévention et de Sécurité", desc: "GRETA Narbonne — 2012. HB0, SST, Palpation de sécurité." },
    { title: "CAP Vente Option Alimentaire", desc: "2010. Techniques de vente, relation client et gestion des produits alimentaires." }
  ],
  [
    { title: "Vendeur en prêt-à-porter de luxe", desc: "ERNEST & ANTHONY – Québec, Canada — 2018 – 2020. Conseil clientèle haut de gamme et fidélisation." },
    { title: "Agent de Sécurité Cynophile", desc: "Forces Méditerranée de Sécurité — 2012 – 2016. Surveillance, contrôle d'accès et intervention avec chien." },
    { title: "Assistant gérant", desc: "Encadrement d'équipe, gestion des stocks et développement des ventes." }
  ]
];

let currentPage = 0; 

function render() {
  document.getElementById('cards-container').innerHTML = pages[currentPage].map(item => `
    <div class="exp-card">
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    </div>
  `).join('');
}

document.getElementById('prev-btn').addEventListener('click', () => {
  currentPage = currentPage > 0 ? currentPage - 1 : pages.length - 1;
  render();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentPage = currentPage < pages.length - 1 ? currentPage + 1 : 0;
  render();
});

render();