// Message sending functionality lives here

function handleResponse(message) {
    if (message) {
        debug_verbose(`Response from the background script: ${message.response}`);
    }
    else
    {
        debug_verbose("Message is undefined");
    }
}

function handleError(error) {
	debug_error(`Error: ${error}`);
}

function SendClearBoardMessage() {
    var messagePayload = {
        type: MessageType.ClearBoard
    };

    browser.runtime.sendMessage(messagePayload).then(handleResponse, handleError);
}

function SendPieceRemovedMessage(pieceName, square) {
    var messagePayload = {
        type: MessageType.PieceRemoved,
        piece: pieceName,
        square: square
    };

    browser.runtime.sendMessage(messagePayload).then(handleResponse, handleError);
}

function SendPiecePlacedMessage(pieceName, square) {
    var messagePayload = {
        type: MessageType.PiecePlaced,
        piece: pieceName,
        square: square
    };

    browser.runtime.sendMessage(messagePayload).then(handleResponse, handleError);
}

function SendPieceMovedMessage(pieceName, fromSquare, toSquare) {
    var messagePayload = {
        type: MessageType.PieceMoved,
        piece: pieceName,
        fromSquare: fromSquare,
        toSquare: toSquare
    };

    browser.runtime.sendMessage(messagePayload).then(handleResponse, handleError);
}
