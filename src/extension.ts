// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { codeGeneration_PHP } from './codeGeneration';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "lord-rich-mole" is now active!');

	const codeGeneration_PHPCommand = vscode.commands.registerCommand(
		'lord-rich-mole.codeGeneration_PHP', 
		handleCodeGenerationCommand
	);

	context.subscriptions.push(codeGeneration_PHPCommand);
}

async function handleCodeGenerationCommand(): Promise<void> {
	try {
		const editor = getActiveEditor();
		const document = editor.document;
		const baseName = getBaseFileName(document);
		const phpCode = generatePHPCode(document);
		savePHPFile(baseName, phpCode);
		showSuccessMessage(baseName);
	} catch (error) {
		if (error instanceof Error) {
			vscode.window.showErrorMessage(`Ошибка: ${error.message}`);
		}
	}
}

function getActiveEditor(): vscode.TextEditor {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('Нет активного редактора!');
	}
	return editor;
}

function getBaseFileName(document: vscode.TextDocument): string {
	const baseName = document.fileName.replace(/\.\w+$/, '');
	vscode.window.showInformationMessage(`${baseName}.php`);
	return baseName;
}

function generatePHPCode(document: vscode.TextDocument): string {
	const text = document.getText();
	return codeGeneration_PHP(text);
}

function savePHPFile(baseName: string, phpCode: string): void {
	const uri = vscode.Uri.file(`${baseName}.php`);
	vscode.workspace.fs.writeFile(uri, Buffer.from(phpCode));
}

function showSuccessMessage(baseName: string): void {
	vscode.window.showInformationMessage(
		`PHP код успешно сгенерирован в файл ${baseName}.php`
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
