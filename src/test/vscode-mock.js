"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.ExtensionContext = exports.commands = exports.Uri = exports.workspace = exports.window = void 0;
// Mock implementation of the vscode module for testing
exports.window = {
    showInformationMessage: (p0) => Promise.resolve(),
    showWarningMessage: (p0, string) => Promise.resolve(),
    showErrorMessage: () => Promise.resolve(),
    showQuickPick: (p0, p1) => Promise.resolve('PHP'),
    activeTextEditor: {
        document: {
            getText: () => '',
            fileName: 'test.md'
        }
    }
};
exports.workspace = {
    fs: {
        writeFile: (uri, p0) => Promise.resolve()
    }
};
exports.Uri = {
    file: (path) => ({ path })
};
exports.commands = {
    registerCommand: (p0, p1) => ({ dispose: () => { } })
};
exports.ExtensionContext = {
    subscriptions: []
};
exports.env = {
    machineId: 'test-machine-id'
};
//# sourceMappingURL=vscode-mock.js.map