"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const codeGeneration_1 = require("./codeGeneration");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log('Congratulations, your extension "lord-rich-mole" is now active!');
    const codeGeneration_PHPCommand = vscode.commands.registerCommand('lord-rich-mole.codeGeneration_PHP', handleCodeGenerationCommand);
    context.subscriptions.push(codeGeneration_PHPCommand);
}
async function handleCodeGenerationCommand() {
    try {
        const editor = getActiveEditor();
        const document = editor.document;
        const baseName = getBaseFileName(document);
        const phpCode = generatePHPCode(document);
        savePHPFile(baseName, phpCode);
        showSuccessMessage(baseName);
    }
    catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Ошибка: ${error.message}`);
        }
    }
}
function getActiveEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('Нет активного редактора!');
    }
    return editor;
}
function getBaseFileName(document) {
    const baseName = document.fileName.replace(/\.\w+$/, '');
    vscode.window.showInformationMessage(`${baseName}.php`);
    return baseName;
}
function generatePHPCode(document) {
    const text = document.getText();
    return (0, codeGeneration_1.codeGeneration_PHP)(text);
}
function savePHPFile(baseName, phpCode) {
    const uri = vscode.Uri.file(`${baseName}.php`);
    vscode.workspace.fs.writeFile(uri, Buffer.from(phpCode));
}
function showSuccessMessage(baseName) {
    vscode.window.showInformationMessage(`PHP код успешно сгенерирован в файл ${baseName}.php`);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map