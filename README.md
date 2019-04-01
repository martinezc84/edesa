## Aplicación de cambios de items vendidos

Esta web app utiliza Gatsby, Netlify Functions, y APIs de backend para mover turnos.

### 1. Instalar dependencias (para localhost)

Si usas npm

```bash
$ npm install
```

Si usas yarn

```bash
$ yarn install
```

### 2. Actualiza las variables de entorno en el netlify.toml

Viene vacío el toml pero utilizar una versión no subida a github

## Deployment en Netlify

1. Conectar github con Netlify, y publicar
2. Habilitar dominio
3. Habilitar HTTPS
4. Agregar estas 4 variables de entorno y sus valores
    * GATSBY_NFUNC_URL_PREFIX
    * GATSBY_ZAURU_PREFIX
    * GATSBY_EMAIL
    * GATSBY_TOKEN
5. Habilitar Netlify Identity y configurarlo para que sea invite only
6. Invitar a alguien

## Cambiar de staging a producción y viceversa
1. Cambiar la variable GATSBY_ZAURU_PREFIX
2. Volver a hacer deploy en Netlify para que lo agarre

Licencia MIT