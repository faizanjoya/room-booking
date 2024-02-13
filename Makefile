.PHONY:

db:
	docker compose up -d

initialise:
	npx prisma db push

# migrate:
# 	npx prisma migrate dev
	
generate:
	npx prisma generate

seed: 
	npx prisma db seed

dev:
	npm run dev

db-stop:
	docker compose down
