// Debug utility functionality lives here.

const ENABLE_DEBUG = true;

const DebugLevels = 
{
    Error        : 0,
    Warning      : 1,
    Log          : 2,
    Verbose      : 3,
    SuperVerbose : 4
};
const CurrentLogLevel = DebugLevels.Log;

function debug_superverbose(...args) {
    if (ENABLE_DEBUG && CurrentLogLevel >= DebugLevels.SuperVerbose) {
        console.log("[SuperVerbose][ChessBuddy]", ...args);
    }
};

function debug_verbose(...args) {
    if (ENABLE_DEBUG && CurrentLogLevel >= DebugLevels.Verbose) {
        console.log("[Verbose][ChessBuddy]", ...args);
    }
};

function debug_log(...args) {
    if (ENABLE_DEBUG && CurrentLogLevel >= DebugLevels.Log) {
        console.log("[Log][ChessBuddy]", ...args);
    }
};

function debug_error(...args) {
    if (ENABLE_DEBUG) {
        console.error("[!][ChessBuddy]", ...args);
    }
};
