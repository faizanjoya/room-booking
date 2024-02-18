Downloaded example

```
npx try-prisma@latest --template typescript/graphql-nestjs
```

Install

```
make install
```

Run postgressql database and db admin panel

```
make db
```

Run database migrations

```
make migrate
```

If there are errors and want to clear your docker

```
docker compose down -v
```

then run again above

Launch the Server

```
make dev
```

In sepatate terminal window
Seed the databse

```
make seed
```

Query the graphql server
naviagte to url:
queries
