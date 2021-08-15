// All message-related functionality for the extension lives here

const MessageType = 
{
    // A piece was removed from a specific square
    PieceRemoved : 0,

    // A piece was placed on a specific square
    PiecePlaced  : 1,
    
    // A piece was moved from one square to another
    PieceMoved   : 2
};

const MessageTypeToString = new Map([
    [MessageType.PieceRemoved, "PieceRemoved"],
    [MessageType.PiecePlaced, "PiecePlaced"],
    [MessageType.PieceMoved, "PieceMoved"]
]);
