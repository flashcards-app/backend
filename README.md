# anki-backend

## Getting started

    git clone git@github.com:refaelbenzvi24/anki-backend.git
    cd anki-backend
    npm install
    cp .env.example .env

## Scripts

- ```npm run dev```: Run the server in development mode
- ```npm run build```: Build the server for production:
- ```npm run start```: Start the server in production mode:
- ```npm run test```: Run Tests:
- ```npm run docs```: Create API documentation:
- ```npm run docker:prod```: Build and run the docker image for production.
- ```npm run docker:dev```: Build and run the docker image for development - required for development, to have a MongoDB
  server.

> Note: No solution was built for writing data into the DB, the data must be inserted manually!
