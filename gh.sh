#!/bin/bash

git pull

# Добавляем ВСЕ изменения
git add -A . && \
git commit -m "$1" && \
git push