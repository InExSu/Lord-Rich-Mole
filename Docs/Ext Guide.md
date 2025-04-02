Вот пошаговое руководство по созданию расширения VS Code для работы с вашим DSL-форматом диаграмм: 

### 1. Настройка проекта
Создайте базовую структуру расширения:
```bash
npm install -g yo generator-code
yo code
```
Выберите:
- TypeScript
- New Extension
- Name: "DSL Diagram Editor"
- Identifier: dsl-diagram-editor

### 2. Добавьте поддержку языка DSL
Создайте файл синтаксиса:
`/syntaxes/dsl-diagram.tmLanguage.json`
```json
{
  "scopeName": "source.dsldiagram",
  "fileTypes": [".dsld"],
  "patterns": [
    {
      "name": "keyword.control.dsldiagram",
      "match": "\\b(diagram|state|transition|settings)\\b"
    },
    {
      "name": "string.quoted.double.dsldiagram",
      "match": "\"(.*?)\""
    },
    {
      "name": "meta.coordinates.dsldiagram",
      "match": "@\\((\\d+),\\s*(\\d+)\\)"
    }
  ]
}
```

### 3. Регистрация языка
В `package.json` добавьте:
```json
"contributes": {
  "languages": [{
    "id": "dsldiagram",
    "extensions": [".dsld"],
    "configuration": "./language-configuration.json"
  }],
  "grammars": [{
    "language": "dsldiagram",
    "scopeName": "source.dsldiagram",
    "path": "./syntaxes/dsl-diagram.tmLanguage.json"
  }]
}
```

### 4. Парсер DSL
Создайте `src/parser.ts`:
```typescript
interface DiagramElement {
  id: string;
  type: 'state' | 'transition';
  label: string;
  x?: number;
  y?: number;
  collapsed?: boolean;
  children?: DiagramElement[];
}

export function parseDSL(content: string): DiagramElement[] {
  const elements: DiagramElement[] = [];
  const lines = content.split('\n');
  
  let currentParent: DiagramElement | null = null;
  const stack: DiagramElement[] = [];

  for (const line of lines) {
    const stateMatch = line.match(/state\s+"(.*?)"\s+@\((\d+),\s*(\d+)\)\s+\[(collapsed|expanded)\]/);
    if (stateMatch) {
      const element = {
        id: `state_${elements.length}`,
        type: 'state',
        label: stateMatch[1],
        x: parseInt(stateMatch[2]),
        y: parseInt(stateMatch[3]),
        collapsed: stateMatch[4] === 'collapsed',
        children: []
      };

      if (currentParent) {
        currentParent.children?.push(element);
      } else {
        elements.push(element);
      }
      
      if (line.includes('{')) {
        stack.push(currentParent || {children: elements} as any);
        currentParent = element;
      }
      continue;
    }

    if (line.includes('}')) {
      currentParent = stack.pop() || null;
    }
  }

  return elements;
}
```

### 5. WebView для визуализации
Создайте `src/DiagramPanel.ts`:
```typescript
import * as vscode from 'vscode';
import { parseDSL } from './parser';

export class DiagramPanel {
  public static currentPanel: DiagramPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor?.viewColumn;
    
    if (DiagramPanel.currentPanel) {
      DiagramPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'dslDiagram',
      'DSL Diagram',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    DiagramPanel.currentPanel = new DiagramPanel(panel, context);
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._update();
    
    panel.onDidDispose(() => {
      DiagramPanel.currentPanel = undefined;
    });
  }

  private _update() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const content = editor.document.getText();
    const elements = parseDSL(content);

    this._panel.webview.html = this._getHtmlForWebview(elements);
  }

  private _getHtmlForWebview(elements: DiagramElement[]): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        .state { 
            position: absolute; 
            border: 2px solid #333; 
            padding: 10px; 
            background: #fff;
            cursor: move;
        }
        .collapsed { 
            width: 80px; 
            height: 40px;
            overflow: hidden;
        }
        .arrow {
            position: absolute;
            stroke: #333;
            stroke-width: 2;
            marker-end: url(#arrowhead);
        }
    </style>
</head>
<body>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
            </marker>
        </defs>

        ${elements.map(el => this._renderElement(el)).join('')}
    </svg>

    <script>
        const vscode = acquireVsCodeApi();
        
        // Обработка кликов для свертки/развертки
        document.querySelectorAll('.state').forEach(el => {
            el.addEventListener('dblclick', () => {
                vscode.postMessage({
                    command: 'toggleCollapse',
                    id: el.dataset.id
                });
            });
        });
    </script>
</body>
</html>`;
  }

  private _renderElement(element: DiagramElement): string {
    if (element.type === 'state') {
      return `
        <rect x="${element.x}" y="${element.y}" 
              width="${element.collapsed ? 80 : 200}" 
              height="${element.collapsed ? 40 : 100}"
              class="state ${element.collapsed ? 'collapsed' : ''}"
              data-id="${element.id}"/>
        <text x="${(element.x || 0) + 10}" y="${(element.y || 0) + 20}">
            ${element.label}
        </text>
      `;
    }
    return '';
  }
}
```

### 6. Регистрация команд
В `extension.ts`:
```typescript
import * as vscode from 'vscode';
import { DiagramPanel } from './DiagramPanel';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('dsldiagram.showDiagram', () => {
            DiagramPanel.createOrShow(context);
        })
    );

    // Обновляем диаграмму при изменении документа
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'dsldiagram') {
            DiagramPanel.currentPanel?.update();
        }
    });
}
```

### 7. Добавьте команду в package.json
```json
"contributes": {
  "commands": [{
    "command": "dsldiagram.showDiagram",
    "title": "Show DSL Diagram"
  }],
  "menus": {
    "editor/title": [{
      "command": "dsldiagram.showDiagram",
      "when": "resourceLangId == dsldiagram",
      "group": "navigation"
    }]
  }
}
```

### 8. Запуск и тестирование
1. Нажмите F5 для запуска расширения в Debug режиме
2. Создайте файл с расширением `.dsld`
3. Введите DSL-код:
```rust
diagram "Пример" {
    state "Начало" @(100, 100) [expanded] {
        transition "Шаг 1" -> "Шаг 2" @(150, 150)
    }
    state "Шаг 2" @(300, 100) [collapsed]
}
```
4. Откройте панель диаграммы через команду "Show DSL Diagram"

### Дополнительные улучшения:
1. **Сохранение координат**:
   - Перехватывайте drag-n-drop в WebView
   - Обновляйте DSL-файл через API VS Code

2. **Поддержка переходов**:
   - Добавьте рендеринг стрелок между состояниями

3. **Интеграция с кодом**:
   - Генерация кода из диаграммы
   - Привязка к существующему коду через комментарии

4. **Экспорт/импорт**:
   - Поддержка SVG/PNG экспорта
   - Импорт из Graphviz/D2

Этот каркас дает основу для работы с вашим DSL. Для production-версии потребуется доработка парсера и добавление более сложной визуализации (например, через D3.js).