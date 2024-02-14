.PHONY:

install:
	npm install

db:
	docker compose up -d

migrate:
	npx prisma migrate dev
	
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

dev:
	npm run dev

db-stop:
	docker compose down
