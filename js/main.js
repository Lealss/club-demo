
(function () {
  "use strict";

  const c = window.siteConfig || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    })[char]);

  const ICONS = {
    ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6c3 3 3 10.8 0 12.8M18.4 5.6c-3-3-3 10.8 0 12.8"/>',
    bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.6 0 4.5 1.8 4.5 4.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 20h8"/>'
  };

  const svg = (key) =>
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    (ICONS[key] || ICONS.ball) +
    "</svg>";

  const pending = '<span class="pending">A confirmar</span>';

  // Evita errores si falta algún elemento o dato de configuración.
  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value || "";
  }

  // Completa los textos configurables.
  $$("[data-cfg]").forEach((element) => {
    element.textContent = c[element.dataset.cfg] || "";
  });

  const schedules = $("#schedules");
  if (schedules) {
    schedules.innerHTML = c.schedules ? esc(c.schedules) : pending;
  }

  setText("#clubText", c.clubText);

  const tags = $("#clubTags");
  if (tags) {
    const clubTags = Array.isArray(c.clubTags) ? c.clubTags : [];
    tags.innerHTML = clubTags
      .map((tag) => "<li>" + esc(tag) + "</li>")
      .join("");
  }

  // Carga imágenes y conserva el marcador si alguna no existe.
  function loadImage(element, source) {
    if (!element || !source) {
      if (element) element.remove();
      return;
    }

    element.onload = () => {
      element.parentElement?.classList.add("has-img");
    };

    element.onerror = () => {
      element.remove();
    };

    element.src = source;
  }

  loadImage($("#heroImg"), c.heroImage);
  loadImage($("#clubImg"), c.clubImage);

  const heroBackground = $(".hero-bg");

  if (heroBackground) {
    heroBackground.insertAdjacentHTML(
      "beforeend",
      '<svg class="lines" viewBox="0 0 200 200" fill="none" stroke="#fff" stroke-width="1.5" aria-hidden="true"><circle cx="100" cy="100" r="80"/><circle cx="100" cy="100" r="6"/><path d="M100 20v160M20 100h160"/></svg>'
    );
  }

  // Actividades.
  const activities = $("#activities");
  const activityList = Array.isArray(c.activities) ? c.activities : [];

  if (activities) {
    activities.innerHTML = activityList.map((activity) =>
      '<article class="card rv">' +
        '<div class="ico">' + svg(activity.icon) + "</div>" +
        "<h3>" + esc(activity.name || "Actividad") + "</h3>" +
        "<p>" + esc(activity.text || "Información pendiente de confirmar.") + "</p>" +
        '<a class="more" href="#contacto">Más información</a>' +
      "</article>"
    ).join("");
  }

  // Instalaciones.
  const facilities = $("#facilities");
  const facilityList = Array.isArray(c.facilities) ? c.facilities : [];

  if (facilities) {
    facilities.innerHTML = facilityList.map((facility) =>
      '<article class="card fac rv">' +
        '<figure class="ph" data-label="FOTO">' +
          '<img alt="" loading="lazy">' +
        "</figure>" +
        "<div>" +
          "<h3>" + esc(facility.name || "Instalación") + "</h3>" +
          "<p>" + esc(facility.text || "Descripción pendiente de confirmar.") + "</p>" +
        "</div>" +
      "</article>"
    ).join("");

    $$("#facilities img").forEach((element, index) => {
      loadImage(element, facilityList[index]?.image);
    });
  }

  // Galería.
  const gallery = $("#gallery");
  const galleryList = Array.isArray(c.gallery) ? c.gallery : [];

  if (gallery) {
    gallery.innerHTML = galleryList.map((item, index) => {
      const size = ["big", "wide"].includes(item.size) ? item.size : "";

      return (
        '<button type="button" class="ph rv ' + size + '"' +
          ' data-i="' + index + '"' +
          ' data-label="' + esc(item.label || "Imagen de ejemplo") + '"' +
          ' aria-label="Ampliar imagen ' + (index + 1) + '">' +
          '<img alt="" loading="lazy">' +
        "</button>"
      );
    }).join("");

    $$("#gallery img").forEach((element, index) => {
      loadImage(element, galleryList[index]?.image);
    });
  }

  // Visor de imágenes.
  const lightbox = $("#lb");
  const lightboxImage = $("#lbimg");
  const lightboxFigure = $("#lbph");

  if (gallery && lightbox && lightboxImage && lightboxFigure) {
    gallery.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-i]");
      if (!button) return;

      const item = galleryList[Number(button.dataset.i)];
      if (!item?.image) {
        showToast("Esta imagen todavía no está disponible.");
        return;
      }

      lightboxFigure.dataset.label = item.label || "Imagen de ejemplo";
      lightboxFigure.classList.remove("has-img");

      lightboxImage.onload = () => {
        lightboxFigure.classList.add("has-img");
      };

      lightboxImage.onerror = () => {
        lightboxImage.removeAttribute("src");
        showToast("No se pudo cargar la imagen.");
      };

      lightboxImage.src = item.image;

      if (!lightbox.open) {
        lightbox.showModal();
      }
    });

    $("#lbx")?.addEventListener("click", () => lightbox.close());

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      lightboxFigure.classList.remove("has-img");
    });
  }

  // Mensajes temporales.
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // Enlaces: no inventar teléfono, Instagram ni dirección.
  const phone = String(c.whatsapp || "").replace(/\D/g, "");
  const validPhone = phone.length >= 8 && phone.length <= 15;

  let instagramURL = "";

  try {
    const parsed = new URL(c.instagram || "");

    if (
      parsed.protocol === "https:" &&
      (parsed.hostname === "instagram.com" ||
       parsed.hostname === "www.instagram.com")
    ) {
      instagramURL = parsed.href;
    }
  } catch (_) {
    // El enlace queda desactivado si la URL no es válida.
  }

  const address = [c.address, c.city].filter(Boolean).join(", ");
  const validAddress = Boolean(String(c.address || "").trim());

  const links = {
    whatsapp: validPhone
      ? "https://wa.me/" + phone +
        "?text=" + encodeURIComponent(c.whatsappMsg || "Hola, quisiera más información.")
      : "",
    instagram: instagramURL,
    directions: validAddress
      ? "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(address)
      : ""
  };

  $$("[data-link]").forEach((element) => {
    const type = element.dataset.link;
    const url = links[type] || "";

    if (url) {
      element.href = url;

      if (type === "whatsapp" || type === "instagram") {
        element.target = "_blank";
        element.rel = "noopener noreferrer";
      }

      if (element.dataset.text === "wa") {
        element.textContent = "+" + phone;
      } else if (element.dataset.text === "ig") {
        element.textContent = new URL(url).pathname.replaceAll("/", "") || "Instagram";
      }
    } else if (element.dataset.text) {
      element.outerHTML = pending;
    } else {
      element.href = "#contacto";

      element.addEventListener("click", (event) => {
        event.preventDefault();

        const messages = {
          whatsapp: "WhatsApp todavía no está configurado.",
          instagram: "Instagram todavía no está configurado.",
          directions: "Agregá la dirección del club en js/config.js."
        };

        showToast(messages[type] || "Este enlace todavía no está configurado.");
      });
    }
  });

  // Mostrar mapa únicamente cuando haya una dirección concreta.
  const map = $("#map");
  const mapContainer = map?.closest(".map");

  if (map && mapContainer && validAddress) {
    map.src =
      "https://www.google.com/maps?q=" +
      encodeURIComponent(address) +
      "&output=embed";
  } else if (mapContainer) {
    mapContainer.hidden = true;
  }

  // Navegación y menú móvil.
  const nav = $("#nav");
  const menu = $("#menu");
  const burger = $("#burger");

  function updateNavigation() {
    if (nav) {
      nav.classList.toggle(
        "solid",
        window.scrollY > 40 || Boolean(menu?.classList.contains("open"))
      );
    }
  }

  function toggleMenu(open) {
    if (!menu || !burger) return;

    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute(
      "aria-label",
      open ? "Cerrar menú" : "Abrir menú"
    );

    updateNavigation();
  }

  updateNavigation();
  window.addEventListener("scroll", updateNavigation, { passive: true });

  burger?.addEventListener("click", () => {
    toggleMenu(!menu?.classList.contains("open"));
  });

  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) toggleMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleMenu(false);
  });

  // Animaciones al desplazarse por la página.
  const revealElements = $$(".rv");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("in"));
  }
})();
