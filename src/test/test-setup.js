// This file sets up the test environment
const path = require('path');

// Mock the vscode module
const mockVscode = require('./vscode-mock');
require.cache[require.resolve('vscode')] = {
  id: require.resolve('vscode'),
  filename: require.resolve('vscode'),
  loaded: true,
  exports: mockVscode
};