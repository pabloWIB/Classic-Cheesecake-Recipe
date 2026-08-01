# Registro de cambios

Reorganización completa del proyecto, por fases. Todo el trabajo es local:
no se ejecutó ningún comando de git y no se publicó nada.

Punto de partida y estado final medidos con Chrome headless sobre un servidor
estático local, en 360 / 768 / 1024 / 1440 px.

| Medida | Antes | Después |
|---|---|---|
| Peso de la primera carga (móvil) | 2501 KB | 38 KB |
| Peso de la primera carga (escritorio) | 1277 KB | 63 KB |
| Peticiones externas | 3 (jQuery + 2 `@import` de fuentes) | 2 (fuentes, con `preconnect`) |
| Tamaño real del `<h1>` | Times New Roman 32 px | Playfair Display 48 px |
| Áreas táctiles por debajo de 44 px | 10 | 0 |
| Errores de consola | 0 | 0 |
| Scroll horizontal | ninguno | ninguno |

---

## Fase 1 — Auditoría

- Inventario completo en [`auditoria.md`](auditoria.md): 1 HTML, 3 CSS, 1 JS y 13 imágenes.
- Detectados 4 problemas críticos, 8 altos y 21 medios, cada uno con su evidencia.
- Confirmado que no hay credenciales, ni enlaces rotos, ni imágenes rotas, ni archivos basura.

## Fase 2 — Estructura

- `CSS/`, `IMG/` y `JS/` (en mayúsculas) reemplazadas por `assets/css/`, `assets/img/` y `assets/js/`.
- `assets/img/` dividida en `content/` e `icons/`.
- Nombres de archivo pasados a minúsculas y semánticos: `photo1.png` → `cheesecake-slice.webp`.
- Creados `404.html`, `robots.txt`, `sitemap.xml`, `.gitignore` y `docs/`.
- Actualizadas todas las rutas en HTML, CSS y JS. Verificado por script: las 13 referencias locales resuelven a un archivo real en disco.
- No se creó `assets/js/modules/` ni `assets/css/pages/`: con ~140 líneas de JS y tres hojas de estilo, serían carpetas vacías o casi vacías. Ver la nota sobre ES modules en la fase 9.

## Fase 3 — Higiene

Eliminados, con la razón de cada uno:

| Archivo | Motivo |
|---|---|
| `IMG/icon.png` | Favicon de 1024×1024 y 1.2 MB, generado con IA y con la marca de agua de DALL·E visible en la esquina. Sustituido por un SVG propio |
| `IMG/dark-mode-black.svg` | Huérfano: 0 referencias en todo el proyecto |
| `IMG/light-mode-black.svg` | Huérfano: 0 referencias |
| `IMG/light-mode-white.svg` | Huérfano: 0 referencias |
| `IMG/mail.svg` | Huérfano: 0 referencias |
| `IMG/mail-open.svg` | Huérfano: 0 referencias |
| `IMG/mail-forward.svg` | Huérfano: 0 referencias |
| `IMG/photo1.png` | Sustituido por su versión WebP, 30× más ligera |
| `CSS/normalize.css` | 357 líneas de correcciones para navegadores que ya no se soportan. Sustituido por un reset moderno de 40 líneas dentro de `base.css` |
| `CSS/Fonts.css` | Solo contenía dos `@import` a Google Fonts, uno superconjunto del otro. Las fuentes ahora se cargan desde el `<head>` con `preconnect` |
| `IMG/light-ball.svg`, `IMG/light-ball-on.svg` | Su contenido pasó a SVG inline dentro del botón de tema, para que el icono herede el color del tema |
| `IMG/6dots.svg`, `IMG/restaurant.svg`, `IMG/time.svg` | Igual: inlineados para que hereden `currentColor` |

- Antes de borrar cada imagen se comprobó con `grep` sobre `*.html`, `*.css` y `*.js` que nadie la referenciaba.
- `.gitignore` creado para un proyecto estático sin build: sistema operativo, editores, logs, `node_modules/`, `.env` y `.vercel/`.
- **No se encontró ninguna credencial, token ni API key.** Nada que extraer.
- Formato normalizado: indentación de 2 espacios, comillas dobles en HTML, punto y coma en JS, salto de línea final en todos los archivos.

## Fase 4 — Imágenes

- `photo1.png` (1938×940, **1258 KB**) → `cheesecake-slice.webp` (1920×931, **42 KB**) y `cheesecake-slice-960.webp` (960×466, **17 KB**). Reducción del 97 %.
- Servidas con `srcset` y `sizes`, de modo que un móvil descarga 17 KB y no 42.
- Sin fallback PNG declarado: al no declararlo, conservar el original sería peso muerto en el repositorio.
- `width` y `height` añadidos al `<img>` para reservar el espacio y evitar el desplazamiento del layout.
- Sin `loading="lazy"`: la única imagen del sitio está por encima del pliegue, y ahí `lazy` retrasa el render.
- `alt` reescrito describiendo lo que se ve, no el nombre del archivo.
- Los iconos ahora son SVG inline y decorativos, marcados con `aria-hidden="true"`.
- Favicon nuevo: `assets/img/icons/favicon.svg`, dibujado a mano, 333 bytes, nítido a cualquier tamaño.

## Fase 5 — HTML, SEO y accesibilidad

- Estructura semántica real: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
- Un solo `<h1>`; jerarquía `h1 → h2 → h3` sin saltos. El párrafo de introducción era un `<h2>`; ahora es un `<p>`.
- Las listas de ingredientes son `<ul>`; las instrucciones, un `<ol>` numerado con contadores CSS en lugar de siete reglas `nth-child`.
- `<title>` de 57 caracteres y `<meta name="description">` de 152, únicos por página.
- Añadidos Open Graph (`og:title`, `og:description`, `og:url`, `og:type`) y `<link rel="canonical">`.
- **Sin `og:image`**: no existe ningún archivo pensado para eso y no se inventa una ruta.
- Eliminados los 31 `<span class="Invicible">` llenos de puntos que simulaban sangrías y que los lectores de pantalla leían en voz alta.
- Eliminado el texto `Tim` que quedaba oculto con `opacity: 0` dentro del encabezado `YIELDS`.
- Eliminadas las referencias colgantes «(see note)» y «(recipe in notes)»: esas notas no existen en la página.
- Eliminados los dos `<form action="" method="get">` que no enviaban a ningún sitio. Los checkboxes no necesitan formulario.
- Añadido un enlace «Skip to the ingredients» para saltar al contenido con el teclado.
- Contraste corregido. El naranja de marca `#F2994A` da 2.2:1 sobre blanco y no llega al mínimo de 4.5:1, así que se separó en dos papeles: `#F2994A` para rellenos e iconos, y `#9C5511` (5.6:1) para texto. En tema oscuro el naranja original sí cumple (6.9:1) y se usa tal cual.
- Los números de paso pasaron de texto blanco sobre naranja (2.2:1) a texto `#252525` sobre naranja (6.9:1).
- `robots.txt` y `sitemap.xml` generados con la URL real del sitio.

## Fase 6 — CSS y sistema de diseño

- Tres hojas en orden de cascada: `base.css` (variables, reset, tipografía) → `layout.css` (contenedor, cabecera, rejilla, pie) → `components.css`.
- Paleta derivada de los colores que el sitio ya usaba; no se inventó ninguna identidad nueva.
- Escala de espaciado 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 en variables. Eliminados `margin-top: -140px`, `margin-left: -43px`, `margin-bottom: 150px`, `12.5px` y `2.5px`.
- Escala tipográfica coherente; el `<h1>` usa `clamp()` para escalar con el ancho. Dos familias, como antes.
- Corregido el error de sintaxis `section-time}` suelto dentro de `.article h2`.
- Corregido `font-style: bold` (no es un valor válido) en sus tres apariciones.
- Eliminado el bloque `.header` completo, que apuntaba a una clase inexistente y por el que el `<h1>` nunca recibía sus estilos.
- Las cuatro clases `.section-img` … `.section4-img`, idénticas salvo un margen, sustituidas por una sola.
- Eliminado `line-height: 1px` sobre texto real.
- Sin `!important` salvo en el bloque `prefers-reduced-motion`, donde es la práctica habitual. Sin estilos inline. Ningún selector supera los 3 niveles.
- Verificado con el navegador: las tres hojas se analizan sin errores y, entre `index.html` y `404.html`, no queda ninguna regla muerta.

## Fase 7 — Responsive

- Invertido a mobile-first: todas las media queries usan `min-width`.
- Breakpoints en 480 / 768 / 1024 / 1440 px (`30em` / `48em` / `64em` / `90em`), sustituyendo a los antiguos 500 / 610 / 820 / 980.
- **Corregido el peor fallo móvil:** la tarjeta de tiempos bajaba a `font-size: 8px` en los encabezados y `5px` en los valores. Ahora es una rejilla 2×2 legible en móvil y una columna fija de 260 px en escritorio.
- La tarjeta de tiempos queda `sticky` en escritorio: los tiempos siguen a la vista mientras se leen las instrucciones.
- En móvil, la tarjeta va antes de los ingredientes, respetando el `order: 1` que el CSS original ya intentaba.
- Áreas táctiles: los diez checkboxes pasaron de 19×21 px a etiquetas de 44 px de alto. Verificado a los cuatro anchos: cero objetivos por debajo del mínimo.
- Verificado `document.documentElement.scrollWidth > window.innerWidth` en 360, 768, 1024 y 1440: sin scroll horizontal en ninguno.

## Fase 8 — UX / UI

- Jerarquía clara: título, qué es, foto, tiempos, ingredientes, método.
- Estados completos en todo elemento interactivo: `hover`, `focus-visible`, `active` y `disabled`, con transiciones de 180 ms.
- Foco visible con un contorno de 3 px y 2 px de separación.
- Los ingredientes marcados se tachan y se atenúan, para ver de un vistazo lo que falta.
- **Los checkboxes ahora recuerdan su estado** entre recargas mediante `localStorage`. Es la razón de ser de la página: se cocina con el móvil en la mano y la pantalla se apaga sola.
- Añadido un botón «Reset list», deshabilitado mientras no haya nada marcado, para empezar una tanda nueva.
- Medida de línea limitada a 68 caracteres, dentro del rango de 60–75.
- Sin gradientes, sin sombras exageradas, sin animaciones gratuitas.
- No había ningún formulario real que conectar: los dos `<form>` existentes solo envolvían checkboxes y se eliminaron.

## Fase 9 — JavaScript

- **jQuery 3.0.0-beta1 eliminado.** Era una beta de 2016 cargada desde un CDN para cinco líneas de código.
- `$("*").toggleClass("open")`, que aplicaba una clase a todos los elementos del documento en cada clic, sustituido por un único atributo `data-theme` en `<html>`.
- Un solo punto de entrada, `assets/js/main.js`, en un IIFE: sin variables globales, sin `var` fuera de él, sin dependencias.
- Un listener delegado para los diez checkboxes en lugar de diez listeners.
- Toda operación comprueba que el elemento existe antes de tocarlo; cada acceso a `localStorage` va dentro de `try/catch`.
- **No se usaron ES modules a propósito.** La estructura propuesta sugiere `js/modules/`, pero los navegadores bloquean los imports de módulos sobre `file://` por CORS, y la fase 13 exige que la página funcione abriendo `index.html` directamente. Con ~140 líneas de JS, un solo script clásico con `defer` cumple ambas cosas; las dos responsabilidades quedan separadas en `initTheme()` e `initChecklist()`.
- El tema se aplica con un script inline en el `<head>` antes del primer pintado, para que la página no parpadee al cargar en modo oscuro.
- Verificado: cero errores y cero avisos de consola en ambas páginas y en los cuatro anchos.

## Fase 10 — Rendimiento

- Peso total de la primera carga: **63 KB en escritorio, 38 KB en móvil**, frente a los 2501 KB iniciales. El objetivo era menos de 1 MB.
- Fuentes con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`, y `display=swap`. Antes eran dos `@import` anidados dentro de un CSS, que bloquean el render y se descubren tarde.
- Petición de fuentes reducida a los pesos que se usan de verdad: Montserrat 400/600/700 y Playfair Display 700 en redonda y cursiva.
- El script principal va con `defer`.
- Los nueve iconos SVG son inline: nueve peticiones menos, y heredan el color del tema.
- Ninguna librería cargada para usar una sola función.

## Fase 11 — QA

Recorrido completo, en `index.html` y `404.html`, a 360 / 768 / 1024 / 1440 px:

- [x] Todos los enlaces llevan a un destino que existe
- [x] Las 13 referencias locales corresponden a un archivo real en disco (verificado por script)
- [x] Todos los `<link>` y `<script>` apuntan a un archivo existente
- [x] Cero errores de consola en ambas páginas y en los cuatro anchos
- [x] Sin scroll horizontal en 360, 768, 1024 ni 1440
- [x] Tema claro/oscuro: funciona con clic, con Enter y con Espacio; persiste al recargar
- [x] Navegación completa con teclado; orden de tabulación lógico; foco siempre visible
- [x] Los checkboxes se marcan con Espacio y sobreviven a una recarga
- [x] «Reset list» limpia la lista y vuelve a deshabilitarse
- [x] Sin «Lorem ipsum», «TODO» ni texto heredado de plantilla
- [x] Ninguna imagen rota
- [x] `title` y `description` únicos en cada página
- [x] `404.html` existe y enlaza de vuelta al inicio
- [x] Sin credenciales en el código

No se usó menú móvil: el sitio tiene una sola página y ninguna navegación que plegar.

## Fase 12 — Documentación

- `docs/auditoria.md`: inventario y diagnóstico del estado inicial.
- `docs/cambios.md`: este documento.
- `README.md` actualizado. La reorganización cambió todas las rutas, así que se rehicieron el árbol del proyecto y la tabla de stack, se eliminó jQuery de las dependencias y se sustituyó el bloque «Usage» —que proponía código para persistir los checkboxes— por la descripción de la persistencia ya implementada.

## Fase 13 — Deploy

- Verificado abriendo `index.html` directamente desde disco (`file://`): CSS aplicado, JS ejecutado, imagen cargada, tema funcionando, cero errores.
- Verificado con servidor local en las dos páginas.
- Sin rutas absolutas de ninguna máquina: comprobado por `grep`.
- Todas las rutas internas relativas y en minúsculas.
- No se creó configuración de hosting (`vercel.json`, `_redirects`, `.htaccess`): no se indicó destino. El sitio es estático puro y no la necesita.
- **No se hizo deploy y no se ejecutó ningún comando de git.**
