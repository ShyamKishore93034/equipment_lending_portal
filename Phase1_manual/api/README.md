# Equipment Lending Portal – API (Node.js + Express + SQLite)

This folder contains the backend (API) for the School Equipment Lending Portal — built for the BITS Pilani WILP Full Stack Application Development (SE ZG503) assignment (2024–2025).
### `npm install`
this will install all dependencies

Create .env file inside api folder using .env.example file as example beacuse we usually dont push these files.

Install SQlite in your local:
go to https://www.sqlite.org/download.html

after opening terminal api folder: Run below to create seed data
sqlite3 ../db/sqlite.db < src/db/seed.sql

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
API url is [http://localhost:5000](http://localhost:5000).

The api will reload when you make changes.\