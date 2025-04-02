#!/bin/bash
[ -z "$1" ] && echo "Использование: $0 \"Сообщение коммита\"" && exit 1

# Переходим в корень git-репозитория
cd "$(git rev-parse --show-toplevel)" || exit 1

# Сохраняем текущие изменения (включая untracked файлы)
git stash push -u -m "Auto-stashed by gh.sh" 2>/dev/null

# Подтягиваем изменения
git pull --rebase || exit 1

# Возвращаем изменения
git stash pop 2>/dev/null

# Добавляем ВСЕ изменения
git add -A . && \
git commit -m "$1" && \
git push