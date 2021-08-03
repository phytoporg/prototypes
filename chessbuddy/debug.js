// Debug utility functionality lives here.

const ENABLE_DEBUG = true;

function debug_log(...args) {
    if (ENABLE_DEBUG) {
        console.log("[ChessBuddy]", ...args);
    }
};

function debug_error(...args) {
    if (ENABLE_DEBUG) {
        console.error("[!][ChessBuddy]", ...args);
    }
};
