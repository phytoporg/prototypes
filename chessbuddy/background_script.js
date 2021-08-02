// Put all the javascript code here, that you want to execute in background.

function onNextTacticRequest(req) {
    debug_log("Getting new tactics puzzle: " + req.url);
}

browser.webRequest.onBeforeRequest.addListener(
    onNextTacticRequest,
    {urls: ["*://*.chess.com/callback/tactics/learning/next"]}
);

function onSubmitMovesRequest(req) {
    debug_log("Submitting moves for tactics puzzle: " + req.url);
}

browser.webRequest.onBeforeRequest.addListener(
    onSubmitMovesRequest,
    {urls: ["*://*.chess.com/callback/tactics/themeTraining/submitMoves"]}
);
