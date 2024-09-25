VERSION := $(shell cat VERSION)
IMAGE_NAME = apo5698/homedb:$(VERSION)

build:
	docker build -t $(IMAGE_NAME) .

push:
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):$(VERSION)