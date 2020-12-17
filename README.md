# Sistema de Apuestas basado en Blockchain

_Read this in [English](README.en.md)_

## Introducción

Este repositorio contiene un proyecto desarrollado como prueba de concepto para el seminario de Blockchain y Smart Contracts de la [Maestría en Ingeniería de Sistemas de Información](https://www.frba.utn.edu.ar/posgrado/maestria-en-ingenieria-en-sistemas-de-informacion/) de la [Universidad Tecnológica Nacional](https://www.frba.utn.edu.ar/posgrado/).

Esta prueba de concepto consta de desarrollar un sistema que permita a los usuarios realizar apuestas sobre los resultados de un partido. A tal fin se implementó un conjunto de contratos que cuentan con toda la lógica necesaria para gestionar partidos, colocar apuestas y reclamar los premios de las mismas. Asimismo se implementó una aplicación web para poder utilizar estos contratos de una forma más amigable.

## Tecnologías

### General

- [NodeJS 12.14.1](https://nodejs.org)
- [Yarn 1.16.0](https://yarnpkg.com)
- [Truffle](https://www.trufflesuite.com/truffle)
- [React Box](https://www.trufflesuite.com/boxes/react)
- [Ganache](https://www.trufflesuite.com/ganache)

### Contracts

- [Solidity 0.7.x](https://docs.soliditylang.org/en/v0.7.5/)
- [OpenZepellin Contracts Library](https://github.com/OpenZeppelin/openzeppelin-contracts)

### Web App

- [React](https://reactjs.org)
- [DrizzleJS](https://www.trufflesuite.com/drizzle)

## Instalación

Las siguientes instrucciones explican como realizar una instalación para poder correr el proyecto de forma local. Como pre-requisito es necesario tener instalado Ganache para poder realizar las pruebas necesarias.

En primer lugar clonar el repositorio:

```bash
> git clone https://github.com/surbina/prode.git
```

Luego instalar las dependencias. Para esto debemos instalar las dependencias tanto en la raíz del proyecto como en la carpeta donde se encuentra la web app.

```bash
> yarn install
> cd client
> yarn install
> cd ..
```

Luego debemos compilar los contratos y desplegarlos en la blockchain de prueba (asegurarse de que Ganache este abierto).

```bash
> npx truffle compile
> npx truffle migrate
```

Una vez que los contratos estén desplegados debemos levantar la aplicación web.

```bash
> cd client && yarn start
```

Por último, en un navegador, abrir una pestaña y navegar a `http://localhost:3000`.
