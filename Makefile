up:
	docker-compose up -d

start:
	docker-compose start

restart:
	docker-compose restart

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

down: 
	docker-compose down

build:
	docker-compose build