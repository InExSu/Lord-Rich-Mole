Вот полная структура проекта расширения VS Code для работы с DSL-диаграммами и команды для работы с ним: 

---

### **Структура проекта**
```
dsl-diagram-editor/
├── .vscode/                     # Конфигурация VS Code
│   ├── launch.json              # Настройки запуска
│   └── tasks.json               # Задачи сборки
├── src/                         # Исходный код
│   ├── extension.ts             # Точка входа расширения
│   ├── DiagramPanel.ts          # WebView панель
│   └── parser.ts                # Парсер DSL
├── syntaxes/                    # Подсветка синтаксиса
│   ├── dsl-diagram.tmLanguage.json # Grammar DSL
│   └── language-configuration.json # Конфиг языка
├── package.json                 # Метаданные расширения
├── tsconfig.json                # Настройки TypeScript
├── node_modules/                # Зависимости (автогенерация)
├── out/                         # Скомпилированный код (автогенерация)
└── .gitignore
```

---

### **Команды для работы с проектом**

#### 1. **Инициализация проекта**
```bash
# Установка Yeoman и генератора расширений
npm install -g yo generator-code # TODO

# Создание проекта 
yo code
```
При выборе опций:
- **TypeScript**
- **New Extension**
- Имя: `dsl-diagram-editor`

#### 2. **Установка зависимостей**
```bash
cd dsl-diagram-editor
npm install
```

#### 3. **Разработка**
```bash
# Запуск расширения в Debug-режиме
code . && npm run watch
```
Затем нажмите `F5` для запуска тестового окна VS Code.

#### 4. **Сборка**
```bash
# Компиляция TypeScript
npm run compile

# Создание VSIX-пакета (для публикации)
vsce package
```

#### 5. **Тестирование**
```bash
# Запуск тестов (если настроены)
npm test
```

---

### **Ключевые файлы и их назначение**

#### 1. `package.json`
```json
{
  "name": "dsl-diagram-editor",
  "displayName": "DSL Diagram Editor",
  "main": "./out/extension.js",
  "contributes": {
    "languages": [{
      "id": "dsldiagram",
      "extensions": [".dsld"],
      "configuration": "./syntaxes/language-configuration.json"
    }],
    "grammars": [{
      "language": "dsldiagram",
      "scopeName": "source.dsldiagram",
      "path": "./syntaxes/dsl-diagram.tmLanguage.json"
    }],
    "commands": [{
      "command": "dsldiagram.showDiagram",
      "title": "Show DSL Diagram"
    }]
  },
  "activationEvents": [
    "onLanguage:dsldiagram"
  ]
}
```

#### 2. `src/extension.ts`
```typescript
import * as vscode from 'vscode';
import { DiagramPanel } from './DiagramPanel';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('dsldiagram.showDiagram', () => {
            DiagramPanel.createOrShow(context);
        })
    );
}
```

#### 3. `syntaxes/dsl-diagram.tmLanguage.json`
```json
{
  "scopeName": "source.dsldiagram",
  "patterns": [
    {
      "match": "\\b(diagram|state|transition)\\b",
      "name": "keyword.control.dsldiagram"
    }
  ]
}
```

---

### **Workflow разработки**
1. **Редактируете код** в `src/`
2. **Автоматическая перекомпиляция** при сохранении (запущен `npm run watch`)
3. **Нажимаете F5** для перезапуска тестового окна VS Code
4. **Тестируете функционал**:
   - Создаете файл `.dsld`
   - Вызываете команду `Show DSL Diagram` из палитры команд (Ctrl+Shift+P)

---

### **Полезные команды VS Code**
| Команда | Описание |
|---------|----------|
| `Ctrl+Shift+B` | Запуск сборки |
| `F5` | Запуск Debug-сессии |
| `Ctrl+Shift+P > Reload Window` | Перезагрузка окна |
| `vsce package` | Создание `.vsix` для публикации |

Для сложных проектов добавьте:
- `eslint` для линтинга
- `jest` для тестов
- `webpack` для оптимизации бандла