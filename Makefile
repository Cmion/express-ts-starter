up-dev:
	docker-compose -f docker/docker-compose.yml up -d

start:
	docker-compose start

restart:
	docker-compose restart

up-prod:
	docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d

down: 
	docker-compose down

build:
	docker-compose build

deploy:
	kubectl create -f k8s/deployment.yml

service:
	kubectl create -f k8s/service.yml