// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lord-rich-mole" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloWorldCommand = vscode.commands.registerCommand('lord-rich-mole.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Lord Rich Mole!');
	});

	// Команда для отображения текущего времени
	const showTimeCommand = vscode.commands.registerCommand('lord-rich-mole.showTime', () => {
		const currentTime = new Date().toLocaleTimeString();
		vscode.window.showInformationMessage(`Текущее время: ${currentTime}`);
	});


	// Добавляем все команды в подписки контекста
	context.subscriptions.push(helloWorldCommand);
	context.subscriptions.push(showTimeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
