# MEGA CLUB EL TRÉBOL — Demo conceptual (no oficial)

Sitio estático (HTML + CSS + JS). Sin dependencias ni build.

## Ejecutar localmente
    cd mega-club-demo
    python3 -m http.server 8080      # abrir http://localhost:8080
(también funciona abriendo `index.html` directamente).

## Publicar
No hay build: se publica la carpeta tal cual.
- **GitHub Pages:** subir a un repo, `Settings > Pages > Source: GitHub Actions`; el workflow `.github/workflows/pages.yml` despliega en cada push a `main`.
- **Alternativa:** Netlify / Cloudflare Pages arrastrando la carpeta.

## Editar contenido
Todo en `js/config.js` (nombre, dirección, WhatsApp, Instagram, horarios, actividades, instalaciones, galería).
Colores y tipografía: variables al inicio de `css/styles.css`.
Fotos: copiar a `images/` con los nombres del config (`hero.webp`, `club-01.webp`, `facility-01.webp`, `activity-01.webp`, `gallery-01.webp`…). Si el archivo no existe se muestra un placeholder.
