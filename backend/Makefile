.PHONY:

install:
	npm install

up:
	docker compose up -d

migrate:
	npx prisma migrate dev

dev:
	npm run dev

seed: 
	npx prisma db seed

# combines migration to create tables and seed to populate them
initialise:
	npx prisma migrate dev
	npx prisma db seed

# db-change:
# 	npx prisma db push

schema:
	npx prisma generate

down:
	docker compose down

db-reset:
	docker compose down -v
