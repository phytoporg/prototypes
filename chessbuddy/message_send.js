// Message sending functionality lives here

function handleResponse(message) {
	debug_verbose(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
	debug_error(`Error: ${error}`);
}

function SendPieceRemovedMessage(pieceName, square) {
    var messagePayload = {
        type: MessageType.PieceRemoved,
        piece: pieceName,
        square: square
    };

    browser.runtime.send(messagePayload).then(handleResponse, handleError);
}

function SendPiecePlacedMessage(pieceName, square) {
    var messagePayload = {
        type: MessageType.PiecePlaced,
        piece: pieceName,
        square: square
    };

    browser.runtime.send(messagePayload).then(handleResponse, handleError);
}

function SendPieceMovedMessage(pieceName, fromSquare, toSquare) {
    var messagePayload = {
        type: MessageType.PieceMoved,
        piece: pieceName,
        fromSquare: fromSquare,
        toSquare: toSquare
    };

    browser.runtime.send(messagePayload).then(handleResponse, handleError);
}
