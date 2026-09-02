# Certificados

Carpeta para las imágenes/PDFs de certificados que se muestran en la sección
"Certificados" del portafolio.

## Cómo agregar un certificado nuevo

1. Copia el archivo (`.jpg`, `.png` o `.pdf`) a esta carpeta.
2. Abre `js/scripts.js` y busca el array `certificatesData`.
3. Agrega un objeto con este formato:

```js
{
    title: 'Nombre del curso o certificación',
    issuer: 'Plataforma o institución (ej: Platzi, Coursera, Google)',
    date: 'Ene 2026',
    image: 'assets/certificates/mi-certificado.jpg',
    file: 'assets/certificates/mi-certificado.jpg'
}
```

- `image` es la miniatura que se ve en la tarjeta (usa una imagen; si el
  certificado es un PDF, deja `image` vacío o usa `null` para mostrar un
  ícono en su lugar).
- `file` es lo que se abre al hacer clic en "Ver / Descargar" (puede ser el
  mismo archivo que `image`, o un PDF distinto con más resolución).
4. Guarda y recarga la página: la tarjeta aparece automáticamente en la
   sección Certificados.

## ⚠️ Privacidad: cédula/tarjeta de identidad

Muchos certificados oficiales (SENA, alcaldías, gobierno) imprimen tu número
de documento en el texto del certificado. **Antes de subir uno así, tapa el
número** (con un editor de imágenes o similar) para no exponerlo en un sitio
público indexado por buscadores. Usa siempre una imagen rasterizada (JPG/PNG)
como `file`, nunca el PDF original si contiene el número: un PDF conserva el
texto seleccionable/copiable aunque se vea "tapado" visualmente.

Los 4 certificados actuales (`ds4a-*`, `misiontic2022-*`, `sena-desarrollo-web-php`,
`sena-titulo-tecnico-programacion`) ya fueron procesados así: se convirtieron
a JPG y se cubrió el número de documento donde aparecía.
