VERSION := $(shell cat VERSION)
IMAGE_NAME = apo5698/homedb

default:
	@echo "Specify a target"
	@exit 1

.PHONY: build build-push-registry build-push-latest-registry

builder-create:
	docker buildx create --name container-builder --driver docker-container --use --bootstrap

build:
	docker build -t $(IMAGE_NAME):$(VERSION) .

build-push-registry:
	docker buildx build --platform linux/amd64,linux/arm64 -t $(IMAGE_NAME):$(VERSION) --push .

build-push-latest-registry:
	docker buildx build --platform linux/amd64,linux/arm64 -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest --push .