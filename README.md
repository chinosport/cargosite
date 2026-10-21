# Mi sitio — genero

Sitio estático preparado a partir del código compartido. No requiere instalación ni compilación. No se subió a GitHub ni se publicó.

## Abrirlo

Descomprimí el ZIP y abrí `mi-sitio/index.html` con tu navegador.

## Archivos

- `index.html`: estructura, texto de About me, correo y enlaces del footer.
- `style.css`: diseño, tamaños y estilos.
- `script.js`: fotos, proyectos, revista, ventanas y posiciones.
- `assets/`: logo, videos e imágenes.

## Multimedia incluida

Ya se incluyeron el logo y los dos videos proporcionados, con las rutas que utiliza la página:

- `assets/logo.png`: tu logo.
- `assets/fondo.mp4`: video originalmente llamado `MOV042_ddv3_1.mp4`.
- `assets/photobooth.mp4`: video originalmente llamado `MOV042_ddv3_3.mp4`.
- `assets/fotos/`: imágenes para la revista.
- `assets/trabajos/`: imágenes de tus proyectos.
- `assets/experimentos/`: imágenes de experimentos.

El logo y ambos videos ya están incorporados. Queda agregar las fotos de proyectos, experimentos y revista; esas secciones muestran los recuadros de relleno previstos en el código.

## Completar el contenido

Al principio de `script.js`, editá:

- `FOTOS`: una ruta por página, por ejemplo `"assets/fotos/1.jpg"`.
- `PROYECTOS`: títulos, fechas, descripciones y rutas en `fotos` de cada proyecto.
- `EXPERIMENTO`: textos y rutas en `fotos`.

En `index.html`, reemplazá los textos de ejemplo, el nombre Sam, el correo `sam@cargo.site`, el enlace de Instagram y “Cargo® Demonstration Site No. 230041” por tus datos. Se conservaron como estaban en el original.

## Acomodar los íconos

Abrí `index.html?mover` agregando `?mover` al final de la dirección en el navegador. Arrastrá los íconos, pulsá “Copiar posiciones” y reemplazá el bloque `var POS` de `script.js` con lo copiado. En el modo normal se usan las posiciones guardadas en el código.

## Cuando decidas subirlo a GitHub

Subí el contenido de `mi-sitio/` a la raíz del repositorio, con `index.html` en la raíz y conservando las carpetas de `assets/`. La publicación queda a tu cargo; este paquete no hizo ninguna subida.

## Ajuste aplicado

Se corrigió un error del código original: al cerrar una ventana con Escape, el manejador ahora termina antes de consultar la ventana que acaba de cerrarse.
