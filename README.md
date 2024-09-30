# Developer NOTES

demo link: https://www.loom.com/share/14b3ee24a7174f48afeb8c199f762bd7?sid=a6391d1b-598f-4c97-9c4f-e77369a036ff

## How to run the project:

The project structure didn't change much. running `npm i && npm run dev` on the server folder will start the server on PORT `8080`, and `npm i && npm start` on the UI folder starts the client on PORT `3000`. Please make sure to run the server first before running the client.

For this demo I'm using the LTS node version `v20.17.0` and npm version `10.8.2`

Welcome! In this repo, we're going to try to build a Pokedex!

It's not required to use this starter code, but it is required to pass the tests. So if a different folder structure is going to be used, please make sure the migrate the tests.

The starter code is configured with a `server` and a `ui` folder. Inside of the `ui` folder there is a `common` folder for code that is meant to be shared between both `server` and `ui`.

Because of Create-React-App, `ui` code cannot import from outside of `ui/src`. So to circumvent that, we're just going to put `common` inside of `ui/src`

To import code inside `ui/src/common` into the server, feel free to use `../` paths. In a typical production setting, we'd expect `common` to be it's own module, but to reduce complexity, we're not going to set it up like a proper monorepo.

# Getting started

1. Please clone this Repo to get started.
2. Delete `.git` from the clone
3. Create a private repo and invite the interviewers

# Starting the App

To start the app, follow the steps.

## Starting the Server

```bash
cd server
npm i
npm run dev
```

## Starting the UI

```bash
cd ui
npm i
npm start
```

## Running Tests

```bash
# must be ran on the root-level package json.
npm run test
```

# Implementation

What is provided in this code base is just a suggestion. Types can be changed as you see fit. There's no expectation to keep any of the code here. The only true expectation is that the tests need to pass.

There is no need to hook up to an external database. An in-memory solution is sufficient.

When you're finished, please provide steps on how to run your application.
