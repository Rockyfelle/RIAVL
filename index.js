/*require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});*/

$('document').ready(main);


function main()
{
	initCode();

	doRun = true;
	codeInt = null;

	$('#runCode').click(function(event){
		//alert($('#texter').html())
		initCode();
		lineCurrent = 0;

		$('.output').html(codeArr);

		doRun = true;
		codeInt = setInterval(runcode, 500);

		//alert($('#texter').html())
	});

	$('#loadFibonacci').click(function(event){
		$('#texter').html("\n<div>SET x TO 1</div><div>SET y TO 1</div><div>LABEL loop</div><div>SET z TO x + y</div><div>PRINT z</div><div>SET y TO x</div><div>SET x TO z</div><div>IF x BELOW 100000</div><div>JUMP loop</div><div>END</div><div></div>");
	});

	writelog(codeArr);

	writelog();
	
	writelog("Parsing Starting");

	lineCurrent = 0;

	writelog(codeArr[0][0])

	$('#console').html("RUNNING CODE!");

	//codeInt = setInterval(runcode, 500);

	codeInt2 = setInterval(runcode2, 100);

}

function initCode()
{
	varArr = new Array();

	labArr = new Array();

	functArr = new Array();

	stopArr = new Array();

	doRun = false;

	stackArgs = new Array(10);
	for (var i = 0; i < 10; i++)
	{
		stackArgs[i] = new Array();
	}

	stackReturn = new Array();

	stackReturnInto = new Array();

	functArrReturn = new Array();

	//alert($('#texter').html());
	//var codeAll = "SET var1 TO 69 + 3 - 1 * 10\nSET var2 TO 42\nSET var1 TO 999\nSET var2 TO 1 + 2 + 3\nSET var1 TO 10 * 60\nSET var2 TO var1 * 2\nEND".toUpperCase();
	//var codeAll = "SET v TO 0\nLABEL start\nSET v TO v + 1\nIF v EQUALS 3\nJUMP win\nJUMP start\nLABEL win\nEND".toUpperCase();
	codeAll = "SET v TO 3\nLABEL start\nFUNCTION sqr\nRETURN ARG0 * ARG0\nSTOP sqr\nIF v ABOVE 8\nSKIP\nLABEL compstuff\nCOMPUTE sqr WITH v INTO v\nJUMP start\nSTOP compstuff\nEND".toUpperCase();
	//alert((document.documentElement).innerHTML);
	codeAll = $('#texter').html().replace(/<\/?span[^>]*>/g,"").replace(/(<\/div><div>)/g,"</div>\n<div>");
	codeAll = codeAll.replace(/\<div\>/g, "");
	codeAll = codeAll.replace(/\&nbsp;/g, " ");
	codeAll = codeAll.replace(/\<br\>/g, "");
	codeAll = codeAll.replace(/<\/?font[^>]*>/, "");
	codeAll = codeAll.replace(/\<\/font\>/, "");
	codeAll = codeAll.replace(/\<\/div\>\n/g, "\n");
	codeAll = codeAll.replace(/\<\/div\>/g, "");
	//alert(codeAll);
	codeAll = codeAll.substr(1, codeAll.length - 2).toUpperCase();
	





	codeArr = new Array();

	codeArr = codeAll.split("\n");

	for (var i=0; i<codeArr.length; i++)
	{
		codeArr[i] = codeArr[i].split(" ");
		if (codeArr[i][0] == "LABEL") labArr[codeArr[i][1]] = i + 1;
		if (codeArr[i][0] == "STOP") stopArr[codeArr[i][1]] = i + 1;
		if (codeArr[i][0] == "FUNCTION") functArr[codeArr[i][1]] = i + 1;
	}
}

function runcode()
{
	//alert(lineCurrent);
	if (doRun) lineCurrent = parseline(lineCurrent); //else clearInterval(codeInt);
}

function parseline(line)
{
	if (stackReturnInto.length != 0)
	{
		varArr["ARG0"] = stackArgs[0][stackArgs[0].length - 1];
		varArr["ARG1"] = stackArgs[1][stackArgs[1].length - 1];
		varArr["ARG2"] = stackArgs[2][stackArgs[2].length - 1];
		varArr["ARG3"] = stackArgs[3][stackArgs[3].length - 1];
		varArr["ARG4"] = stackArgs[4][stackArgs[4].length - 1];
		varArr["ARG5"] = stackArgs[5][stackArgs[5].length - 1];
		varArr["ARG6"] = stackArgs[6][stackArgs[6].length - 1];
		varArr["ARG7"] = stackArgs[7][stackArgs[7].length - 1];
		varArr["ARG8"] = stackArgs[8][stackArgs[8].length - 1];
		varArr["ARG9"] = stackArgs[9][stackArgs[9].length - 1];

		//writelog("WWWWWWWWWWWWWWWWWWWWWW: " + varArr["ARG0"]);
	}

	writelog(line + 1 + ".");
	switch (codeArr[line][0])
	{
		case "INPUT":
			break;

		case "PRINT":

			if (codeArr[line][1].charAt(0).match(/[a-z]/i)) var number = Number(varArr[codeArr[line][1]]); else var number = Number(codeArr[line][1]);
			for (var i=2; i<codeArr[line].length; i++)
			{
				var re = /[\+\-\*\/]/;
				if (re.test(codeArr[line][i]) == false)
				{	
					if (codeArr[line][i].charAt(0).match(/[a-z]/i)) var tmpnum = Number(varArr[codeArr[line][i]]); else var tmpnum = Number(codeArr[line][i]);

					switch (codeArr[line][i-1])
					{
						case "+":
							number = number + tmpnum;
							break;
						case "-":
							number = number - tmpnum;
							break;
						case "*":
							number = number * tmpnum;
							break;
						case "/":
							number = number / tmpnum;
							break;
						default:
							writelog("PRINT::  Invalid math format at position [" + line  + "][" + i + "]");
							doRun = false;
							return "";
					}
				}
			}

			writelog("\nPRINT::" + number);
			$('#console').append("\n" + number);

			return line + 1;

		case "FUNCTION":
			writelog("SKIP::  Skipping over uncalled function \"" + codeArr[line][1] + "\" and jumping to stop line " + stopArr[codeArr[line][1]]);
			return stopArr[codeArr[line][1]];

		case "SKIP":
			writelog("SKIP::  Skip label \"" + codeArr[line + 1][1] + "\" and jump to line " + stopArr[codeArr[line + 1][1]]);
			return stopArr[codeArr[line + 1][1]];

		case "END":
			writelog("Script done");
			doRun = false;
			return line + 1;

		case "LABEL":
			writelog("LABEL::  Skip line");
			return line + 1;

		case "SET":
			
			if (codeArr[line][3].charAt(0).match(/[a-z]/i)) var number = Number(varArr[codeArr[line][3]]); else var number = Number(codeArr[line][3]);

			writelog("SET::  Parse step 1: " + number);

			for (var i=4; i<codeArr[line].length; i++)
			{
				/*DEBUG*/ //writelog(codeArr[line][i]);
				var re = /[\+\-\*\/]/;
				if (re.test(codeArr[line][i]) == false)
				{/*DEBUG*/ //writelog("WE PASS");
					
					if (codeArr[line][i].charAt(0).match(/[a-z]/i)) var tmpnum = Number(varArr[codeArr[line][i]]); else var tmpnum = Number(codeArr[line][i]);

					switch (codeArr[line][i-1])
					{
						case "+":
							number = number + tmpnum;
							break;
						case "-":
							number = number - tmpnum;
							break;
						case "*":
							number = number * tmpnum;
							break;
						case "/":
							number = number / tmpnum;
							break;
						default:
							writelog("SET::  Invalid math format at position [" + line  + "][" + i + "]");
							doRun = false;
							return "";
					}
				}
			}
			
			writelog("SET::  Final number is: " + number);
			varArr[codeArr[line][1]] = number;
			return line + 1;

		case "IF":

			if (codeArr[line][3].charAt(0).match(/[a-z]/i)) var number = Number(varArr[codeArr[line][3]]); else var number = Number(codeArr[line][3]);

			writelog("IF::  Parse step 1: " + number);

			for (var i=4; i<codeArr[line].length; i++)
			{
				var re = /[\+\-\*\/]/;
				if (re.test(codeArr[line][i]) == false)
				{/*DEBUG*/ //writelog("WE PASS");
					
					if (codeArr[line][i].charAt(0).match(/[a-z]/i)) var tmpnum = Number(varArr[codeArr[line][i]]); else var tmpnum = Number(codeArr[line][i]);

					switch (codeArr[line][i-1])
					{
						case "+":
							number = number + tmpnum;
							break;
						case "-":
							number = number - tmpnum;
							break;
						case "*":
							number = number * tmpnum;
							break;
						case "/":
							number = number / tmpnum;
							break;
						default:
							writelog("IF::  Invalid math format at position [" + line + "][" + i + "]");
							doRun = false;
							return "";
					}
				}
			}
			
			if (codeArr[line][1].charAt(0).match(/[a-z]/i)) var numtmp = Number(varArr[codeArr[line][1]]); else var numtmp = Number(codeArr[line][1]);

			switch (codeArr[line][2])
			{
				case "=":
				case "EQUALS":
					writelog("IF::  Comparing " + numtmp + " EQUALS " + number);
					if (numtmp == number) return line + 1; else return line + 2;
				case ">":
				case "ABOVE":
					writelog("IF::  Comparing " + numtmp + " ABOVE " + number);
					if (numtmp > number) return line + 1; else return line + 2;
				case "<":
				case "BELOW":
					writelog("IF::  Comparing " + numtmp + " BELOW " + number);
					if (numtmp < number) return line + 1; else return line + 2;
				default:
					writelog("IF::  Invalid compare format at position [" + line + "][1]");
					doRun = false;
					return "";
			}
			
			
		case "JUMP":
			writelog("JUMP::  Jump to label \"" + codeArr[line][1] + "\" @ line " + labArr[codeArr[line][1]]);
			return labArr[codeArr[line][1]];

		case "COMPUTE":
			var argsCount = 0;
			if (codeArr[line][3].charAt(0).match(/[a-z]/i)) var number = Number(varArr[codeArr[line][3]]); else var number = Number(codeArr[line][3]);
			//for (var i=4; i<codeArr[line].length; i++)
			for (var i=4; i<codeArr[line].indexOf("INTO") + 1; i++)
			{
				//writelog("COMPUTE::  AAAAAAAAAAAAAAA: " + codeArr[line][i]);
				if (codeArr[line][i] == "AND")
				{
					writelog("COMPUTE::  COMMAND AND");
					stackArgs[argsCount].push(number);
					argsCount++;
					number = 0;
				}
				else
				{
					if (codeArr[line][i] == "INTO")
					{
						writelog("COMPUTE::  COMMAND INTO");
						stackArgs[argsCount].push(number);
						argsCount++;
						number = 0;
						break;
					}
					else
					{
						var re = /[\+\-\*\/]/;
						if (re.test(codeArr[line][i]) == false)
						{/*DEBUG*/ writelog("COMPUTE::  WE PASS");

							if (codeArr[line][i].charAt(0).match(/[a-z]/i)) var tmpnum = Number(varArr[codeArr[line][i]]); else var tmpnum = Number(codeArr[line][i]);

							switch (codeArr[line][i-1])
							{
								case "+":
									number = number + tmpnum;
									break;
								case "-":
									number = number - tmpnum;
									break;
								case "*":
									number = number * tmpnum;
									break;
								case "/":
									number = number / tmpnum;
									break;
								default:
									writelog("COMPUTE::  Invalid math format at position [" + line + "][" + i + "]");
									doRun = false;
									return "";
							}
						}
					}
				}
			}

			if (codeArr[line].indexOf("INTO") != -1)
			{
				writelog("COMPUTE::  Stacking ReturnInto variable " + codeArr[line][codeArr[line].length - 1]);
				stackReturnInto.push(codeArr[line][codeArr[line].length - 1]);
			}
			else
			{
				writelog("COMPUTE::  Stacking ReturnInto variable NULL");
				stackReturnInto.push("NULL");
			}

			functArrReturn.push(line + 1);

			return functArr[codeArr[line][1]];

		case "RETURN":

		if (codeArr[line][1].charAt(0).match(/[a-z]/i)) var number = Number(varArr[codeArr[line][1]]); else var number = Number(codeArr[line][1]);

			writelog("RETURN::  Parse step 1: " + number);

			for (var i=2; i<codeArr[line].length; i++)
			{
				/*DEBUG*/ //writelog(codeArr[line][i]);
				var re = /[\+\-\*\/]/;
				if (re.test(codeArr[line][i]) == false)
				{/*DEBUG*/ //writelog("WE PASS");
					
					if (codeArr[line][i].charAt(0).match(/[a-z]/i)) var tmpnum = Number(varArr[codeArr[line][i]]); else var tmpnum = Number(codeArr[line][i]);

					switch (codeArr[line][i-1])
					{
						case "+":
							number = number + tmpnum;
							break;
						case "-":
							number = number - tmpnum;
							break;
						case "*":
							number = number * tmpnum;
							break;
						case "/":
							number = number / tmpnum;
							break;
						default:
							writelog("RETURN::  Invalid math format at position [" + line  + "][" + i + "]");
							doRun = false;
							return "";
					}
				}
			}
			
			writelog("RETURN::  Final number is: " + number);
			varArr[stackReturnInto[stackReturnInto.length - 1]] = number;
			var returnLine = functArrReturn[functArrReturn.length - 1];
			stackReturnInto.pop();
			functArrReturn.pop();
			return returnLine;
			
	}
}

function writelog(str)
{
	console.log(str);
	$('.output').append("<p>" + str + "</p>");
}

//$(document).ready(main)























function runcode2()
{
    //writelog(document.getElementById("texter")).innerHTML;

    //pos = $("#texter").prop("selectionEnd");

    //writelog(pos);
    
    if (document.activeElement == document.getElementById("texter")) pos = saveSelection(document.getElementById("texter"));
    //if (document.activeElement == document.getElementById("texter")) writelog(pos);

    //restore(document.getElementById("texter"), save(document.getElementById("texter")));
	//alert($("#texter").html());
	input = $("#texter").html().replace(/<\/?span[^>]*>/g,"").replace(/(<\/div><div>)/g,"</div>\n<div>");
	//alert(input);
    //input = $("#texter").html().replace(/\s/g, " ");

    //writelog(input);

    input = input.replace(/SET/g, "<span class=\"orange\">SET</span>");
    input = input.replace(/IF/g, "<span class=\"orange\">IF</span>");
    input = input.replace(/JUMP/g, "<span class=\"orange\">JUMP</span>");
    input = input.replace(/FUNCTION/g, "<span class=\"orange\">FUNCTION</span>");
    input = input.replace(/COMPUTE/g, "<span class=\"orange\">COMPUTE</span>");
    input = input.replace(/RETURN/g, "<span class=\"orange\">RETURN</span>");
	input = input.replace(/SKIP/g, "<span class=\"orange\">SKIP</span>");
	input = input.replace(/PRINT/g, "<span class=\"orange\">PRINT</span>");
	input = input.replace(/INPUT/g, "<span class=\"orange\">INPUT</span>");

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