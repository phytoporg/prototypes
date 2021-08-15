// All message-related functionality for the extension lives here

const MessageType = 
{
    // Clear the whole damn thing
    ClearBoard   : 0,

    // A piece was removed from a specific square
    PieceRemoved : 1,

    // A piece was placed on a specific square
    PiecePlaced  : 2,
    
    // A piece was moved from one square to another
    PieceMoved   : 3
};

const MessageTypeToString = new Map([
    [MessageType.ClearBoard,   "ClearBoard"],
    [MessageType.PieceRemoved, "PieceRemoved"],
    [MessageType.PiecePlaced,  "PiecePlaced"],
    [MessageType.PieceMoved,   "PieceMoved"]
]);
