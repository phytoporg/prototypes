// Let's just see if this works
document.body.style.border = "5px solid blue";

// Select the node that will be observed for mutations
const targetNode = document.getElementById("board-board");
for (const childNode of targetNode.children) {
    debug_log("Initial board state: " + childNode.className);
}

// Options for the observer (which mutations to observe)
const config = { 
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true,
    attributes: true,
    childList: true,
    subtree: true 
};

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
			for (const addedNode of mutation.addedNodes)
			{
				debug_log("Added node: " + addedNode.className);
			}

			for (const removedNode of mutation.removedNodes)
			{
				debug_log("Removed node: " + removedNodes.className);
			}
        } else if (mutation.type === 'attributes') {
            debug_log("Attribute change: " + mutation.attributeName +
			" - " +  mutation.oldValue +
            " => " + mutation.target.attributes[mutation.attributeName].value);
        } else {
            debug_log("Untracked mutation type: " + mutation.type);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
