up:
	docker-compose up -d

start:
	docker-compose start

restart:
	docker-compose restart

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down: 
	docker-compose down

build:
	docker-compose build

create-pod:
	kubectl create -f k8s/pod.yml

delete-pod:
	kubectl delete pod authentication