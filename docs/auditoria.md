# Auditoría inicial — Classic Cheesecake Recipe

Estado del proyecto **antes** de la reorganización. Documento de trabajo interno.
Medido con Chrome headless sobre un servidor estático local, en 360 / 768 / 1024 / 1440 px.

---

## 1. Inventario de archivos

### 1.1 HTML

| Archivo | `<title>` | `<h1>` | Propósito real | Estado |
|---|---|---|---|---|
| `index.html` | `Recipes` | `Classic Cheesecake Recipe` | Página única con la receta completa: intro, foto, tiempos, ingredientes e instrucciones | Funciona, pero con `</div>` huérfano y estructura de `div` sin semántica |

No existe `404.html`. No hay más páginas.

### 1.2 CSS

| Archivo | Líneas | ¿Se carga? | Observaciones |
|---|---|---|---|
| `CSS/normalize.css` | 357 | Sí | normalize.css v8.0.1 íntegro y sin modificar |
| `CSS/styles.css` | 482 | Sí | Todos los estilos del proyecto. Contiene un error de sintaxis y un bloque muerto |
| `CSS/Fonts.css` | 6 | Sí | Solo dos `@import` a Google Fonts; el segundo es superconjunto del primero |

### 1.3 JavaScript

| Archivo | Líneas | ¿Se carga? | Observaciones |
|---|---|---|---|
| `JS/script.js` | 14 (5 útiles) | Sí | Alterna el modo oscuro. Depende de jQuery. Cargado en `<head>` sin `defer` |

### 1.4 Imágenes

| Archivo | Formato | Dimensiones | Peso | ¿Referenciada? | Dónde |
|---|---|---|---|---|---|
| `IMG/photo1.png` | PNG | 1938×940 | **1258 KB** | Sí | Foto principal |
| `IMG/icon.png` | PNG | 1024×1024 | **1200 KB** | Sí | Favicon |
| `IMG/6dots.svg` | SVG | 13×8 | 417 B | Sí | Adorno junto a la intro |
| `IMG/restaurant.svg` | SVG | 48×48 | 325 B | Sí | Icono de raciones |
| `IMG/time.svg` | SVG | 48×48 | 472 B | Sí (×3) | Icono de tiempos |
| `IMG/light-ball.svg` | SVG | 48×48 | 514 B | Sí | Botón de tema (apagado) |
| `IMG/light-ball-on.svg` | SVG | 48×48 | 529 B | Sí | Botón de tema (encendido) |
| `IMG/dark-mode-black.svg` | SVG | 48×48 | 473 B | **No** | Huérfana |
| `IMG/light-mode-black.svg` | SVG | 48×48 | 1631 B | **No** | Huérfana |
| `IMG/light-mode-white.svg` | SVG | 48×48 | 1646 B | **No** | Huérfana |
| `IMG/mail.svg` | SVG | 48×48 | 299 B | **No** | Huérfana |
| `IMG/mail-open.svg` | SVG | 48×48 | 327 B | **No** | Huérfana |
| `IMG/mail-forward.svg` | SVG | 48×48 | 346 B | **No** | Huérfana |

Verificado con `grep` sobre `*.html`, `*.css` y `*.js`: las seis marcadas como huérfanas tienen **0 referencias**.

### 1.5 Dependencias externas

| Dependencia | Origen | Uso real |
|---|---|---|
| jQuery 3.0.0-beta1 slim | `cdnjs.cloudflare.com` | 5 líneas: un `click` y dos `toggleClass` |
| Montserrat + Playfair Display | `fonts.googleapis.com` vía `@import` | Tipografía del sitio |

### 1.6 Archivos basura

Ninguno. No hay `.bak`, `node_modules`, `.DS_Store`, `Thumbs.db` ni versiones duplicadas.

---

## 2. Problemas detectados

### 2.1 Crítico

| # | Problema | Ubicación | Evidencia |
|---|---|---|---|
| C1 | **El `<h1>` nunca recibe sus estilos.** El CSS los cuelga de `.header`, clase que no existe en el HTML. El título se pinta con la fuente por defecto del navegador | `styles.css:27-70` vs `index.html:26-28` | Medido en runtime: `font-family: "Times New Roman"`, `32px`. El CSS pedía Playfair Display 48px |
| C2 | **2.5 MB en la primera carga**, 2,5× por encima del objetivo de 1 MB | `IMG/photo1.png`, `IMG/icon.png` | `performance.getEntriesByType('resource')` a 360 px: 2501 KB |
| C3 | **Favicon de 1.2 MB y 1024×1024 px** para pintarse a 16 px | `index.html:9` | 1200 KB descargados por un icono de pestaña |
| C4 | **Texto ilegible en móvil.** La tarjeta de tiempos baja a `font-size: 8px` en los `h3` y `5px` en los `p` | `styles.css:198-204` | Visible a 360 px: "12 servings" es una mancha |

### 2.2 Alto

| # | Problema | Ubicación | Evidencia |
|---|---|---|---|
| A1 | **31 `<span class="Invicible">` con puntos literales** (`..........`) usados para simular sangrías. Son contenido real del DOM y los lee un lector de pantalla | `index.html:121-127` | `document.querySelectorAll('.Invicible').length === 31` |
| A2 | **Error de sintaxis en CSS**: `section-time}` suelto dentro del bloque `.article h2` | `styles.css:301-307` | La regla se cierra mal y `font-style: italic` es la última declaración válida |
| A3 | **Dos `<form action="" method="get">` que no envían a ningún sitio.** Envolver checkboxes en un formulario muerto; pulsar Enter recarga la página | `index.html:41`, `index.html:94` | `document.forms.length === 2` |
| A4 | **jQuery 3.0.0-beta1 (una beta de 2016) desde CDN** para cinco líneas de código | `index.html:10` | Versión confirmada en runtime. Es una petición externa bloqueante por un `toggleClass` |
| A5 | **`$("*").toggleClass("open")`** aplica una clase a *todos* los elementos del documento en cada clic | `JS/script.js:5` | Recorre el DOM completo; el modo oscuro depende de un selector `*.open` |
| A6 | **El modo oscuro deja texto negro sobre fondo oscuro.** `span{color:black}` gana sobre `*.open{color:white}` por especificidad | `styles.css:1-4` vs `styles.css:155-159` | Los ingredientes destacados desaparecen al activar el tema oscuro |
| A7 | **El botón de tema no es accesible por teclado.** Es un `<div>` con un `click` de jQuery: sin `tabindex`, sin rol, sin nombre accesible | `index.html:17`, `JS/script.js:2` | No aparece en el orden de tabulación |
| A8 | **`<h3>YIELDS<span>Tim</span></h3>`** — resto del template original, ocultado con `opacity: 0` en vez de borrarlo | `index.html:59`, `styles.css:268-271` | Texto "Tim" presente en el DOM y expuesto a lectores de pantalla |

### 2.3 Medio

| # | Problema | Ubicación |
|---|---|---|
| M1 | `</div>` de cierre sin apertura correspondiente | `index.html:15` |
| M2 | Cero semántica: ni `<header>`, ni `<main>`, ni `<footer>`, ni `<ul>`. Todo son `<div>` | `index.html` completo |
| M3 | Jerarquía de encabezados incorrecta: el párrafo de introducción es un `<h2>`; hay cuatro `<h3>` (tiempos) antes del `<h2>` de "Cheesecake" | `index.html:31, 59-87, 93` |
| M4 | `<title>Recipes</title>` — genérico, 7 caracteres, no describe la página | `index.html:12` |
| M5 | Sin `<meta name="description">`, sin Open Graph, sin `<link rel="canonical">` | `index.html:3-13` |
| M6 | Ningún `<img>` declara `width`/`height` → desplazamiento de layout al cargar | `index.html`, 8 imágenes |
| M7 | Ningún `loading="lazy"`, ni siquiera en imágenes bajo el pliegue | `index.html` |
| M8 | `alt` sin valor informativo: `alt="Mode"`, `alt="Dots"`, `alt="Cheesecake Recipe"` | `index.html:19, 22, 30, 34` |
| M9 | Áreas táctiles de 19×21 px en los 10 checkboxes (mínimo exigido: 44×44) | `styles.css:141-147, 324-330` |
| M10 | `<script>` en `<head>` sin `defer` | `index.html:11` |
| M11 | Fuentes por `@import` anidado (bloquea el render) y sin `preconnect` | `CSS/Fonts.css:1-5` |
| M12 | `@import` duplicado: la línea 5 ya incluye todo lo de la línea 1 | `CSS/Fonts.css` |
| M13 | `font-style: bold` — no es un valor válido de `font-style` | `styles.css:39, 157, 353` |
| M14 | `<br><br>` como mecanismo de separación (5 apariciones) | `index.html:14, 25, 128, 129` |
| M15 | Media queries en `max-width` (desktop-first) y con breakpoints arbitrarios: 980, 820, 610, 500 | `styles.css` |
| M16 | Números mágicos: `margin-top:-140px`, `margin-left:-43px`, `margin-bottom:150px`, `12.5px`, `2.5px` | `styles.css:298, 425, 113, 85, 138` |
| M17 | Cuatro clases (`.section-img` … `.section4-img`) idénticas salvo un margen, para el mismo componente repetido | `styles.css:224-266` |
| M18 | `line-height: 1px` en textos reales | `styles.css:274, 281` |
| M19 | Sin variables CSS: `#F2994A` repetido, `'Montserrat'` escrito 9 veces, `'Playfair Display'` 5 veces | `styles.css` |
| M20 | Faltan `.gitignore`, `robots.txt`, `sitemap.xml` y `404.html` | raíz |
| M21 | Carpetas y archivo en mayúsculas: `CSS/`, `IMG/`, `JS/`, `Fonts.css` | raíz |

### 2.4 Comprobaciones que sí pasan

- **Enlaces rotos:** ninguno. El único `<a>` apunta a `sallysbakingaddiction.com` y resuelve.
- **Imágenes rotas:** ninguna. Las 8 rutas referenciadas existen en disco.
- **CSS/JS referenciado inexistente:** ninguno. Los 4 recursos locales existen.
- **Errores de consola:** cero, en los cuatro anchos.
- **Scroll horizontal:** ausente en 360, 768, 1024 y 1440 px.
- **Credenciales:** ninguna. `grep` de `api_key|secret|token|password|bearer|AKIA|sk-|ghp_` sin resultados.
- **Contenido de relleno:** no hay "Lorem ipsum". El texto de la receta es real y está acreditado.

---

## 3. Resumen en cinco líneas

1. Es una página única y estática que presenta una receta de tarta de queso acreditada a Sally's Baking Addiction, con los ingredientes como checkboxes marcables y un conmutador de tema claro/oscuro.
2. El contenido es real y completo —no hay relleno de plantilla ni enlaces rotos— y el diseño en escritorio se sostiene; el problema no es lo que dice, es cómo está construido.
3. Lo más grave: **el `<h1>` nunca recibe sus estilos** porque el CSS los cuelga de una clase `.header` que no existe en el HTML, así que el título de la página se pinta en Times New Roman a 32 px en lugar de Playfair Display a 48 px, y nadie lo había notado.
4. Le sigue el peso: **2,5 MB en la primera carga**, de los cuales 1,2 MB son un favicon de 1024×1024 px que el navegador pinta a 16.
5. En móvil la tarjeta de tiempos se comprime hasta `font-size: 5px`, y el modo oscuro deja el texto destacado en negro sobre fondo negro: las dos únicas funcionalidades interactivas del sitio están rotas en el caso real de uso, que es cocinar con el móvil en la mano.
