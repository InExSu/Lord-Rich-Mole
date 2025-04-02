# содержимое файлов проекта с именами файлов в буфер обмена 
{
  echo "=== package.json ==="
  cat package.json
  echo -e "\n\n=== src/extension.ts ==="
  cat src/extension.ts
  echo -e "\n\n=== src/DiagramPanel.ts ==="
  cat src/DiagramPanel.ts
  echo -e "\n\n=== src/parser.ts ==="
  cat src/parser.ts
  echo -e "\n\n=== .vscode/launch.json ==="
  cat .vscode/launch.json
  echo -e "\n\n=== syntaxes/dsl-diagram.tmLanguage.json ==="
  cat syntaxes/dsl-diagram.tmLanguage.json

} | pbcopy