# Blockchain base gambling system

_Lee esto en [Español](README.md)_

## Introduction

This repository includes a proof of concept (PoC) of a gambling system implemented using Smart Contracts as part of the course on Blockchain and Smart Contracts in the context of the [MSc in Computer Engineering](https://www.frba.utn.edu.ar/posgrado/maestria-en-ingenieria-en-sistemas-de-informacion/) I'm attending at the [Universidad Tecnológica Nacional](https://www.frba.utn.edu.ar/posgrado/).

The main goal of this PoC was to design and implement a system that would allow users to place bets about the upcoming results of soccer matches. In order to achieve that we implemented a set of contracts which include all the logic to manage these matches. We also implemented a web app that allows us to use this contracts in an easy way.

## Technologies

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

## Installation

Follow these instructions to set up the repository for local development. As a pre-requisite Ganache must be installed in order to run the project.

First, start by cloning the repo:

```bash
> git clone https://github.com/surbina/prode.git
```

Then you'll need to install the dependencies. This means you'll need to install them in the root of the project as well as in the client folder.

```bash
> yarn install
> cd client
> yarn install
> cd ..
```

After this you will have to compile the contracts and deploy them in test blockchain (be sure Ganache is open and running).

```bash
> npx truffle compile
> npx truffle migrate
```

Once contracts have been deployed we need to start the web app.

```bash
> cd client && yarn start
```

Finally, open a browser and go to `http://localhost:3000`.
