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

function handleMessage(request, sender, sendResponse) {
    var type = MessageTypeToString.get(request.type);
    var piece = request.piece;
    debug_log("Message from the content script:");
    debug_log(`\ttype = ${type}`);
    debug_log(`\tpiece = ${piece}`);

    if (request.type == MessageType.PieceMoved)
    {
        var fromSquare = request.fromSquare;
        var toSquare = request.toSquare;
        debug_log(`\tfromSquare = ${fromSquare}`);
        debug_log(`\ttoSquare = ${toSquare}`);
    }
}

browser.runtime.onMessage.addListener(handleMessage);
