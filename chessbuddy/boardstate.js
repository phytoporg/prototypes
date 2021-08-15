class BoardState {
    constructor() {
        // Piece-oriented representation for easy conversion to FEN
        this.board = new Array(64).fill("");
    }

    removePiece(squareString) {
        var file = parseInt(squareString[0]) - 1;
        var rank = parseInt(squareString[1]) - 1;

        var index = rank * 8 + file;
        this.board[index] = "";
        debug_verbose(this.debugString());
    }

    setPiece(squareString, pieceType) {
        var file = parseInt(squareString[0]) - 1;
        var rank = parseInt(squareString[1]) - 1;

        var index = rank * 8 + file;
        this.board[index] = 
            (pieceType[0] === 'w' ? pieceType[1].toUpperCase() : pieceType[1]);
        debug_verbose(this.debugString());
    }

    movePiece(squareStringFrom, squareStringTo) {
        if (squareStringTo === squareStringFrom) {
            return;
        }

        var fromFile = parseInt(squareStringFrom[0]) - 1;
        var fromRank = parseInt(squareStringFrom[1]) - 1;
        var fromIndex = fromRank * 8 + fromFile;

        var toFile = parseInt(squareStringTo[0]) - 1;
        var toRank = parseInt(squareStringTo[1]) - 1;
        var toIndex = toRank * 8 + toFile;

        this.board[toIndex] = this.board[fromIndex]
        this.board[fromIndex] = "";

        debug_verbose(this.debugString());
    }

    debugString() {
        var stringBuilder = "";
        for (let i = 7; i >= 0; --i)
        {
            stringBuilder += "\n[ ";
            for (let j = 0; j < 8; ++j) {
                var thisSquare = this.board[i * 8 + j];
                if (thisSquare === "") {
                    stringBuilder += "- ";
                }
                else {
                    stringBuilder += thisSquare + " ";
                }
            }
            stringBuilder += "]";
        }

        return stringBuilder;
    }
}
