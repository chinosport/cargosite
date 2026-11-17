# GSAND

Versión estática de https://728329.cargo.site, lista para GitHub Pages.

## Publicar

1. Crear un repositorio en GitHub y subir el contenido de esta carpeta (con `index.html` en la raíz).
2. En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
3. A los minutos queda en `https://<usuario>.github.io/<repo>/`.

## Estructura

- `index.html` y una página `.html` por sección (`revista`, `carino`, `selected-work`, `experiments`, …).
- `assets/` fotos en WebP, videos comprimidos (H.264, máx. 1280 px), fuentes y CSS.
- Todo funciona sin Cargo: un script chico al final de cada página maneja íconos, el botón × / Esc y el reloj.

Nota: el formulario de `contact-form.html` dependía del servidor de Cargo y no envía mensajes; el link de email sí funciona.
