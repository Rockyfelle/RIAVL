main();

function main()
{
    //runcode();
    codeInt = setInterval(runcode, 100);
}

function runcode()
{
    //writelog(document.getElementById("texter")).innerHTML;

    //pos = $("#texter").prop("selectionEnd");

    //writelog(pos);
    
    if (document.activeElement == document.getElementById("texter")) pos = saveSelection(document.getElementById("texter"));
    if (document.activeElement == document.getElementById("texter")) writelog(pos);

    //restore(document.getElementById("texter"), save(document.getElementById("texter")));

    input = $("#texter").html().replace(/<\/?span[^>]*>/g,"").replace(/(<\/div><div>)/g,"</div>\n<div>");
    //input = $("#texter").html().replace(/\s/g, " ");

    //writelog(input);

    input = input.replace(/SET/g, "<span class=\"orange\">SET</span>");
    input = input.replace(/IF/g, "<span class=\"orange\">IF</span>");
    input = input.replace(/JUMP/g, "<span class=\"orange\">JUMP</span>");
    input = input.replace(/FUNCTION/g, "<span class=\"orange\">FUNCTION</span>");
    input = input.replace(/COMPUTE/g, "<span class=\"orange\">COMPUTE</span>");
    input = input.replace(/RETURN/g, "<span class=\"orange\">RETURN</span>");
    input = input.replace(/SKIP/g, "<span class=\"orange\">SKIP</span>");

    input = input.replace(/LABEL/g, "<span class=\"red\">LABEL</span>");
    input = input.replace(/STOP/g, "<span class=\"red\">STOP</span>");

    input = input.replace(/END/g, "<span class=\"orange\">END</span>");

    input = input.replace(/WITH/g, "<span class=\"yellow\">WITH</span>");
    input = input.replace(/AND/g, "<span class=\"yellow\">AND</span>");
    input = input.replace(/INTO/g, "<span class=\"yellow\">INTO</span>");
    input = input.replace(/( TO)/g, " <span class=\"yellow\">TO</span>");

    input = input.replace(/EQUALS/g, "<span class=\"yellow\">EQUALS</span>");
    input = input.replace(/ABOVE/g, "<span class=\"yellow\">ABOVE</span>");
    input = input.replace(/BELOW/g, "<span class=\"yellow\">BELOW</span>");
    input = input.replace(/\+/g, "<span class=\"yellow\">+</span>");
    input = input.replace(/\-/g, "<span class=\"yellow\">-</span>");
    input = input.replace(/\*/g, "<span class=\"yellow\">*</span>");
    input = input.replace(/( \/)/g, "<span class=\"yellow\">/</span>");  //&sol;

    input = input.replace(/( [0-9]+)/g, "<span class=\"pink\">$1</span>");
    input = input.replace(/(&nbsp;[0-9]+)/g, "<span class=\"pink\">$1</span>");

    

    /*nput = input.replace(/=/g, "<span class=\"yellow\">=</span>");
    input = input.replace(/>/g, "<span class=\"yellow\">&gt;</span>");
    input = input.replace(/</g, "<span class=\"yellow\">&lt;</span>");*/

    //input = input.replace("SET", "<span class=\"orange\">SET</span>");

    //writelog(input);
    $("#texter").html(input);

    //$("#texter").focus();

    if (document.activeElement == document.getElementById("texter")) restoreSelection(document.getElementById("texter"), pos);

    //$("#texter").selectionEnd = pos;

}

function writelog(str)
{
	console.log(str);
	//$('.output').append("<p>" + str + "</p>");
}




var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        };
    };

    restoreSelection = function(containerEl, savedSel) {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}