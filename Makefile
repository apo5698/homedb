VERSION := $(shell cat VERSION)
IMAGE_NAME = apo5698/homedb

build:
	docker build -t $(IMAGE_NAME):$(VERSION) .

push:
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):$(VERSION)

push-latest:
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest
	docker push $(IMAGE_NAME):latest