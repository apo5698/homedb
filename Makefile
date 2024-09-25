VERSION := $(shell cat VERSION)
IMAGE_NAME = apo5698/homedb:$(VERSION)

build:
	docker build -t $(IMAGE_NAME) .

push:
	docker tag $(IMAGE_NAME) $(IMAGE_NAME)
	docker push $(IMAGE_NAME)