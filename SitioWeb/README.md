# Sitio web de la investigación

Sitio estático (solo HTML, CSS y JavaScript, sin backend) que resume la investigación:
*Análisis comparativo de herramientas y prácticas de enseñanza de economía en universidades internacionales frente al curso de Economía de la Escuela de Ingeniería en Ciencias y Sistemas, USAC.*

## Pestañas
Inicio (problemática y objetivos) · Universidades · Herramientas · Fuentes de datos · Análisis · Propuesta · Ejemplos

## Cómo verlo
- Abrir `index.html` con doble clic en el navegador, o
- Servirlo localmente: `python -m http.server 8080` dentro de esta carpeta y abrir http://localhost:8080

Las fuentes tipográficas se cargan de Google Fonts; sin internet se usan fuentes del sistema.

## Estructura
```
SitioWeb/
├── index.html      # contenido de todas las pestañas
├── css/styles.css  # tonos cálidos y efecto liquid glass
└── js/main.js      # pestañas, animaciones, filtros y contadores
```
