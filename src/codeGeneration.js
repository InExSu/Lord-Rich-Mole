"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGeneration_PHP = codeGeneration_PHP;
function codeGeneration_PHP(diagramContent) {
    // Parse states and transitions
    const stateRegex = /(\w+)\s*-->\s*(\w+)\s*:\s*(\w+)/g;
    const states = new Set();
    const transitions = [];
    let match;
    while ((match = stateRegex.exec(diagramContent)) !== null) {
        states.add(match[1]);
        states.add(match[2]);
        transitions.push({
            from: match[1],
            to: match[2],
            fn: match[3]
        });
    }
    // Generate PHP code
    let phpCode = `<?php\n\n// States\n`;
    // Generate state constants
    states.forEach(state => {
        phpCode += `define('STATE_${state.toUpperCase()}', '${state}');\n`;
    });
    // Initial state
    const initialState = Array.from(states)[0];
    phpCode += `\n// Current state\n$currentState = STATE_${initialState.toUpperCase()};\n\n`;
    // Generate transition handler
    phpCode += `function handleTransition(&$state, $event) {\n`;
    phpCode += `    switch ($state) {\n`;
    transitions.forEach(trans => {
        phpCode += `        case STATE_${trans.from.toUpperCase()}:\n`;
        phpCode += `            if ($event === '${trans.fn}') {\n`;
        phpCode += `                ${trans.fn}();\n`;
        phpCode += `                return STATE_${trans.to.toUpperCase()};\n`;
        phpCode += `            }\n`;
        phpCode += `            break;\n\n`;
    });
    phpCode += `    }\n    return $state;\n}\n\n`;
    // Generate parallel execution
    phpCode += `// Parallel execution\n`;
    const uniqueTransitions = [...new Set(transitions.map(t => t.fn))];
    phpCode += `if (function_exists('pcntl_fork')) {\n`;
    uniqueTransitions.forEach((fn, i) => {
        phpCode += `    $pid${i} = pcntl_fork();\n`;
        phpCode += `    if ($pid${i} == 0) {\n`;
        phpCode += `        $currentState = handleTransition($currentState, '${fn}');\n`;
        phpCode += `        exit;\n    }\n\n`;
    });
    phpCode += `    // Wait for child processes\n`;
    uniqueTransitions.forEach((_, i) => {
        phpCode += `    pcntl_waitpid($pid${i}, $status${i});\n`;
    });
    phpCode += `} else {\n`;
    uniqueTransitions.forEach(fn => {
        phpCode += `    $currentState = handleTransition($currentState, '${fn}');\n`;
    });
    phpCode += `}\n\n`;
    phpCode += `echo "Final state: $currentState\\n";\n`;
    phpCode += `?>`;
    return phpCode;
}
//# sourceMappingURL=codeGeneration.js.map