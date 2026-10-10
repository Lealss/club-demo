
(() => {
  "use strict";

  const c = window.siteConfig || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const icons = {
    ball: '<circle cx="12" cy="12" r="9"/><path d="m8 3 2 5 5 1 3-4M3 10l5-2m4 13-2-6-5-2m10-4 3 5-2 4"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
  };

  function toast(message) {
    const element = $("#toast");
    if (!element) return;

    element.textContent = message;
    element.hidden = false;

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      element.hidden = true;
    }, 3200);
  }

  // Rellena textos desde config.js.
  $$("[data-cfg]").forEach((element) => {
    const key = element.dataset.cfg;
    const value = c[key];

    if (value !== undefined && value !== null && value !== "") {
      element.textContent = String(value);
    } else if (key === "address" || key === "city") {
      element.textContent = "";
    }
  });

  // Evita que las imágenes inexistentes de la demo generen espacios
  // con dimensiones variables. El contenedor conserva su proporción.
  function loadImage(element, source) {
    if (!element) return;

    if (!source) {
      element.remove();
      return;
    }

    element.addEventListener("load", () => {
      element.parentElement?.classList.add("has-img");
    }, { once: true });

    element.addEventListener("error", () => {
      element.remove();
    }, { once: true });

    element.src = source;
  }

  loadImage($("#heroImg"), c.heroImage);
  loadImage($("#clubImg"), c.clubImage);

  // Texto descriptivo del club.
  const clubText = $("#clubText");
  if (clubText) {
    if (c.clubText) {
      clubText.textContent = c.clubText;
    } else {
      clubText.textContent =
        "Información institucional pendiente de confirmar.";
      clubText.classList.add("pending");
    }
  }

  const schedules = $("#schedules");
  if (schedules) {
    schedules.textContent = c.schedules || "Horarios a confirmar";
    if (!c.schedules) schedules.classList.add("pending");
  }

  // Etiquetas del club.
  const clubTags = $("#clubTags");
  if (clubTags && Array.isArray(c.clubTags)) {
    clubTags.innerHTML = c.clubTags
      .filter(Boolean)
      .map((tag) => `<li>${esc(tag)}</li>`)
      .join("");
  }

  // Crea tarjetas de actividades.
  const activities = $("#activities");
  if (activities && Array.isArray(c.activities)) {
    activities.innerHTML = c.activities.map((item) => {
      const icon = icons[item.icon] || icons.ball;

      return `
        <article class="card">
          <div class="ico" aria-hidden="true">
            <svg viewBox="0 0 24 24">${icon}</svg>
          </div>
          <h3>${esc(item.name || "Actividad")}</h3>
          <p>${esc(item.text || "Información pendiente de confirmar.")}</p>
        </article>
      `;
    }).join("");
  }

  // Crea tarjetas de instalaciones.
  const facilities = $("#facilities");
  if (facilities && Array.isArray(c.facilities)) {
    facilities.innerHTML = c.facilities.map((item) => `
      <article class="card fac">
        <div class="ph" data-label="IMAGEN DE EJEMPLO">
          <img alt="" loading="lazy">
        </div>
        <div class="fac-content">
          <h3>${esc(item.name || "Instalación")}</h3>
          <p>${esc(item.text || "Descripción pendiente de confirmar.")}</p>
        </div>
      </article>
    `).join("");

    $$(".fac img", facilities).forEach((img, index) => {
      loadImage(img, c.facilities[index]?.image);
    });
  }

  // Galería: cada imagen válida se puede ampliar.
  const gallery = $("#gallery");
  const lightbox = $("#lb");
  const lightboxImage = $("#lbimg");

  if (gallery && Array.isArray(c.gallery)) {
    gallery.innerHTML = c.gallery.map((item, index) => `
      <button
        class="ph ${item.size === "big" ? "big" : ""} ${item.size === "wide" ? "wide" : ""}"
        type="button"
        data-gallery-index="${index}"
        aria-label="Ampliar ${esc(item.label || "imagen de galería")}"
        data-label="${esc(item.label || "IMAGEN DE EJEMPLO")}">
        <img alt="" loading="lazy">
      </button>
    `).join("");

    $$(".gallery img", gallery).forEach((img, index) => {
      const item = c.gallery[index];

      if (!item?.image) {
        img.closest("button")?.remove();
      } else {
        loadImage(img, item.image);
      }
    });

    // Elimina botones cuando su imagen no pudo cargarse.
    $$(".gallery img", gallery).forEach((img) => {
      img.addEventListener("error", () => {
        img.closest("button")?.remove();
      }, { once: true });
    });

    gallery.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-gallery-index]");
      if (!button || !lightbox || !lightboxImage) return;

      const item = c.gallery[Number(button.dataset.galleryIndex)];
      if (!item?.image) return;

      lightboxImage.src = item.image;
      lightboxImage.alt = item.label || "Imagen de galería";

      lightboxImage.onerror = () => {
        lightbox.close();
        lightboxImage.removeAttribute("src");
        toast("No se pudo cargar esa imagen.");
      };

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      }
    });
  }

  // Cierre de la galería.
  $("#lbx")?.addEventListener("click", () => {
    if (lightbox?.open) lightbox.close();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox?.addEventListener("close", () => {
    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
      lightboxImage.onerror = null;
    }
  });

  // Enlaces de contacto. Si faltan datos, no se inventan destinos.
  const digits = String(c.whatsapp || "").replace(/\D/g, "");
  const validWhatsApp = digits.length >= 8 && digits.length <= 15;
  const whatsappMessage = encodeURIComponent(
    c.whatsappMsg || "Hola, quisiera más información."
  );

  let instagramURL = "";
  if (c.instagram) {
    try {
      const candidate = new URL(c.instagram);
      const host = candidate.hostname.toLowerCase();

      if (
        candidate.protocol === "https:" &&
        (host === "instagram.com" || host === "www.instagram.com")
      ) {
        instagramURL = candidate.href;
      }
    } catch {
      instagramURL = "";
    }
  }

  const address = [c.address, c.city]
    .filter((value) => String(value || "").trim())
    .join(", ");

  const directionsURL = address
    ? "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(address)
    : "";

  const mapBox = $("#mapBox");
  const map = $("#map");

  if (address && mapBox && map) {
    map.src = "https://www.google.com/maps?q=" +
      encodeURIComponent(address) + "&output=embed";
    mapBox.hidden = false;
  }

  $$('[data-link="whatsapp"]').forEach((link) => {
    if (validWhatsApp) {
      link.href = `https://wa.me/${digits}?text=${whatsappMessage}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contacto";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        toast("El WhatsApp todavía no está configurado en esta demo.");
      });
    }
  });

  $$('[data-link="instagram"]').forEach((link) => {
    if (instagramURL) {
      link.href = instagramURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contacto";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        toast("El Instagram todavía no está configurado en esta demo.");
      });
    }
  });

  $$('[data-link="directions"]').forEach((link) => {
    if (directionsURL) {
      link.href = directionsURL;
    } else {
      link.href = "#ubicacion";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        toast("La dirección todavía no está configurada en esta demo.");
      });
    }
  });

  // Menú móvil.
  const burger = $("#burger");
  const menu = $("#menu");

  function closeMenu() {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
    menu.classList.remove("open");
  }

  burger?.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!isOpen));
    burger.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    menu?.classList.toggle("open", !isOpen);
  });

  $$("#menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
