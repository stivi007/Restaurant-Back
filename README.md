<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Configuracion de prisma
## Antes de iniciar cree el archivo .env y ejecutar el comando:

```bash
$ npx prisma init
```
Este comando se encarga de inicializar prisma y te dara una url de la base de datos en el archivo .env como este "postgresql://DATABASE_USER:DATABASE_PASSWORD@localhost:5432/DATABASE_NAME?schema=public" si no es como este entonces cambielo por esta url y coloque los datos de su base de datos donde se encuentran las letras mayusculas

## Seguidamente hecho el prisma init le aparecera una carpeta "prisma" que contiene el schema ahi es donde se haran los modelos de base de datos y una ves hecho el modelo para hacer la migracion ejecular los comandos:

```bash
$ npx prisma generate
```

```bash
$ npx prisma migrate dev --name nombre_de_la_migracion
```
aclaracion, cada ves que modifique el archivo de schema.prisma debe ejecutar el comando: ``` npx prisma migrate dev --name nombre_de_la_migracion ``` para que se pueda ejecutar la migracion con los cambios realizados

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```