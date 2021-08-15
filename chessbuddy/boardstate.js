class BoardState {
    constructor() {
        // Piece-oriented representation for easy conversion to FEN
        this.board = new Array(64).fill("");
    }

    removePiece(squareString) {
        var file = parseInt(squareString[0]);
        var rank = parseInt(squareString[1]);

        var index = rank * 8 + file;
        this.board[index] = "";
    }

    setPiece(squareString, pieceType) {
        var file = parseInt(squareString[0]);
        var rank = parseInt(squareString[1]);

        var index = rank * 8 + file;
        this.board[index] = 
            (pieceType[0] === 'w' ? pieceType[1].toUpperCase() : pieceType[1]);
    }

    movePiece(squareStringFrom, squareStringTo) {
        var fromFile = parseInt(squareStringFrom[0]);
        var fromRank = parseInt(squareStringFrom[1]);
        var fromIndex = fromRank * 8 + fromFile;

        var toFile = parseInt(squareStringTo[0]);
        var toRank = parseInt(squareStringTo[1]);
        var toIndex = toRank * 8 + toFile;

        this.board[toIndex] = this.board[fromIndex]
        this.board[fromIndex] = "";
    }

    toString() {
        var stringBuilder = "";
        for (let i = 0; i < 8; ++i)
        {
            stringBuilder += "[ ";
            for (let j = 0; j < 8; ++j) {
                var thisSquare = this.board[j * 8 + i];
                if (thisSquare === "") {
                    stringBuilder += "  ";
                }
                else {
                    stringBuilder += pieceString + " ";
                }
            }
            stringBuilder += "]";
        }

        return stringBuilder;
    }
}
