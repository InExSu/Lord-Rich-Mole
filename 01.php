<?php

// States
define('STATE_S1', 's1');
define('STATE_S2', 's2');

// Current state
$currentState = STATE_S1;

function handleTransition(&$state, $event) {
    switch ($state) {
        case STATE_S1:
            if ($event === 'f1') {
                f1();
                return STATE_S2;
            }
            break;

        case STATE_S1:
            if ($event === 'f2') {
                f2();
                return STATE_S2;
            }
            break;

    }
    return $state;
}

// Parallel execution
if (function_exists('pcntl_fork')) {
    $pid0 = pcntl_fork();
    if ($pid0 == 0) {
        $currentState = handleTransition($currentState, 'f1');
        exit;
    }

    $pid1 = pcntl_fork();
    if ($pid1 == 0) {
        $currentState = handleTransition($currentState, 'f2');
        exit;
    }

    // Wait for child processes
    pcntl_waitpid($pid0, $status0);
    pcntl_waitpid($pid1, $status1);
} else {
    $currentState = handleTransition($currentState, 'f1');
    $currentState = handleTransition($currentState, 'f2');
}

echo "Final state: $currentState\n";
?>