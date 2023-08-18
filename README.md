# Short-Links
This is a web-app for saving and hashing your favourite links, so you can easily use them in the future.
## How to setup and run project
Clone this project and enter the following commands: 
```
npm i
npm run start
```
## Settings
Environmental variables:
  1. DATABASE_URL - contains a path to the database file
  2. PORT - contains the port number that you want to start this app on

If PORT=3000, in the console you will see this: `Application listening on port 3000!`
### Example of setting variable POST
```
POST=5000 npm run start
```
## Technology Stack
In this project I used:
  + Express.js for backend
  + Prisma as ORM system
  + SQLite as DBMS
  + Commitlint for linting commits
