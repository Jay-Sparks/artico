# Artico
### A backend service for creating, reading, updating and deleting news & review articles and comments.

[Artico Endpoints](https://artico-dasj.onrender.com/api)

### Summary ###
Built using a javascript stack, the artico back-end service offers a suite of GET, PATCH, POST & DELETE endpoints to access artico application data. The project was built utilizing; TDD, powered by JEST & Supertest, the MVC pattern and Express middleware to create a series of RESTful apis that offer access to a PSQL database via Node-Postgres

---

## Instructions


In order to run the project locally;

Clone the repository from the project respository:
```
https://github.com/Jay-Sparks/nc-news
```
[Project repository](https://github.com/Jay-Sparks/nc-news)


Install dependencies:
```
npm install
```


Seed the local database:
```
npm run seed
```


Run project tests:
```
npm run test
```

### Environment setup


Create the ***.env.test*** and ***.env.development*** environment files in the parent directory


In your .env files, reference your test and development databases:
``` 
PGDATABASE=you_database_name_here
```

---

## Minimum versions

- ***Node:*** v21.4.0

- ***PostgreSQL:*** v8.7.3
