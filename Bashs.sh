# Разные скрипты для работы с проектом

# дать права на запуск
find . -name "*.sh" -exec chmod +x {} +

# Назначить владельца папке
sudo chown -R michaelpopov: staff /Users/michaelpopov/Documents/GitHub/TypeScript/VS-CODE-DRAKON-InExSu/Docs/

# вывести дерево прооекта без node_modules
find . -name node_modules -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g'