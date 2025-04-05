<?php

// Состояния автомата
define('STATE_S1', 's1');
define('STATE_S2', 's2');

// Текущее состояние
$currentState = STATE_S1;

// Обработчики функций
function f1() {
    echo "Выполняется функция f1\n";
    // Здесь может быть любая логика
}

function f2() {
    echo "Выполняется функция f2\n";
    // Здесь может быть любая логика
}

// Обработка перехода между состояниями
function handleTransition(&$state, $event) {
    switch ($state) {
        case STATE_S1:
            if ($event === 'f1') {
                f1();
                return STATE_S2;
            }
            if ($event === 'f2') {
                f2();
                return STATE_S2;
            }
            break;
            
        case STATE_S2:
            // Конечное состояние
            break;
    }
    return $state;
}

// Параллельный запуск (эмуляция через fork)
if (function_exists('pcntl_fork')) {
    $pid1 = pcntl_fork();
    if ($pid1 == 0) {
        // Дочерний процесс 1 - f1
        $currentState = handleTransition($currentState, 'f1');
        exit;
    }

    $pid2 = pcntl_fork();
    if ($pid2 == 0) {
        // Дочерний процесс 2 - f2
        $currentState = handleTransition($currentState, 'f2');
        exit;
    }

    // Ждем завершения дочерних процессов
    pcntl_waitpid($pid1, $status1);
    pcntl_waitpid($pid2, $status2);
} else {
    // Если fork не доступен - последовательное выполнение
    $currentState = handleTransition($currentState, 'f1');
    $currentState = handleTransition($currentState, 'f2');
}

echo "Final state: $currentState\n";
