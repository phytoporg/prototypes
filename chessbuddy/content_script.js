// A quick visual indicator that things are working
document.body.style.border = "5px solid blue";

// Select the node that will be observed for mutations
const boardNode = document.getElementById("board-board");
for (const childNode of boardNode.children) {
    debug_log("Initial board state: " + childNode.className);
}

// TODO: probably don't need to enable all of these
const config = { 
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true,
    attributes: true,
    childList: true,
    subtree: true 
};

function IsPiece(className) {
    var tokens = className.split(' ');
    if (tokens.length != 3 || (tokens.length > 0 && tokens[0] !== 'piece'))
    {
        return false;
    }

    return true;
}

function IsHighlight(className) {
    var tokens = className.split(' ');
    for (const token of tokens)
    {
        if (token === 'highlight') { return true; }
    }

    return false;
}

// Assumes that this is already known to be a valid piece!
function GetPiece(className) {
    var tokens = className.split(' ');
    for(const token of tokens) {
        if (token !== 'piece' && !token.startsWith('square-'))
        {
            return token;
        }
    }

    debug_verbose("GetPiece() - no token found in " + className);
    return null;
}

function GetSquare(className) {
    var tokens = className.split(' ');
    for(const token of tokens) {
        if (token.startsWith('square-'))
        {
            return token.substr(-2);
        }
    }

    debug_verbose("GetSquare() - no token found in " + className);
    return null;
}

// Track the last highlighted node
var lastHighlightSquare = "";

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
			for (const addedNode of mutation.addedNodes)
			{
                if (IsHighlight(addedNode.className))
                {
                    lastHighlightSquare = GetSquare(addedNode.className);
                    debug_log("New highlight square: " + lastHighlightSquare);
                }
                else
                {
                    debug_verbose("Added node: " + addedNode.className);
                }
			}

			for (const removedNode of mutation.removedNodes)
			{
                debug_verbose("Removed node: " + removedNode.className);
			}
        } else if (mutation.type === 'attributes') {
            var attributeName = mutation.attributeName;
            if (attributeName === 'class') {
                 debug_superverbose("Class change: " +
                     mutation.oldValue +
                     " => " + 
                     mutation.target.attributes[mutation.attributeName].value);

                // Let's start by figuring out the destination piece, then
                // we'll figure out the source square, eh?
                var newClassName = mutation.target.attributes[attributeName].value;
                var oldClassName = mutation.oldValue;
                
                if (IsPiece(oldClassName) && IsPiece(newClassName))
                {
                    var newPiece = GetPiece(newClassName);

                    var oldSquare = GetSquare(oldClassName);
                    if (oldSquare == null)
                    {
                        // The player is dropping a piece from clicking and
                        // dragging, so the old piece class is unassigned.
                        // 
                        // For now, assume that the last highlighted square
                        // is the correct source square.
                        if (lastHighlightSquare !== "")
                        {
                            oldSquare = lastHighlightSquare;
                        }
                    }

                    var newSquare = GetSquare(newClassName);
                    debug_log(
                        newPiece + " on square " + newSquare + 
                        " from " + oldSquare);
                    SendPieceMovedMessage(newPiece, oldSquare, newSqure);
                }
                else if (!IsPiece(oldClassName) && IsPiece(newClassName))
                {
                    var piece = GetPiece(newClassName);
                    var newSquare = GetSquare(newClassName);
                    debug_log(piece + " on square " + newSquare);
                    SendPiecePlacedMessage(piece, newSqure);
                }
                else if (IsPiece(oldClassName) && !IsPiece(newClassName) &&
                         !newClassName.includes('dragging') &&
                         !newClassName.includes('hover'))
                {
                    var piece = GetPiece(oldClassName);
                    var oldSquare = GetSquare(oldClassName);
                    debug_log(piece + " removed from square " + oldSquare);
                    SendPieceRemovedMessage(piece, oldSquare);
                }
            }
            else
            {
                debug_superverbose("Attribute change: " + 
                    mutation.attributeName +
                    " - " +  
                    mutation.oldValue +
                    " => " + 
                    mutation.target.attributes[mutation.attributeName].value);
            }
        } else {
            debug_verbose("Untracked mutation type: " + mutation.type);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(boardNode, config);
