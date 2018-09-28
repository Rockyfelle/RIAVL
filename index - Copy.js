/*require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});*/

main();

function main()
{
	//$('.update').click(function()
	{
		//Replace these static vars
		relationship 	= 04;
		job				= 1;
		trait			= 7;

		//!!IMPORTANT!! Always use double digits, that means 07 instead of 7.
		var input = "Hi $Myname who works at [01:The factory|2:Gulag|03:Your moms] which is (05:AMAZING|4:INCREDIBLE|007:DANK|10:ok) as a $Jobname, welcome to (10:the pretty $City|10:$City|20:My city known as $City), {0:(5:My name is $Theirname|05:I'm $Theirname)|10:Come touch me baby|60:RAPE ME ALREADY}.";
		//var input = "Hi {0:(5:My name is $Theirname|5:I'm $Theirname)|10+:Come touch me baby}";
		
		//$('.input').append("<p>" + input + "</p>");

		//Search for any instances of {([ and > then parse them
		var deep = 0;
		var fullyparsed = parseBrackets(input, "M", deep);

		writelog("done");
		writelog(fullyparsed);
		
		superparsed = replaceVariables(fullyparsed);
		writelog("super done");
		writelog(superparsed);
	}//);
}



function parseBrackets(brack, type, deep)
{
	writelog("Current deepness: " + deep);

	var doparse = true;
	while (doparse)
	{
		var x1 = brack.indexOf("(");
		var x2 = brack.indexOf("{");
		var x3 = brack.indexOf("[");
		var x4 = brack.indexOf("<");
		if (x1 == -1) x1 = 999999;
		if (x2 == -1) x2 = 999999;
		if (x3 == -1) x3 = 999999;
		if (x4 == -1) x4 = 999999;

		var nextopen = Math.min(x1, x2, x3, x4);
		var nextclose = 0;
		var nextopenchar = brack.charAt(nextopen);
		var nextclosechar = reverseChar(nextopenchar);
		var charcomp = 0;

		//If there are any more openings, otherwise go to next parse step
		if (nextopen != 999999)
		{
			//Make a temporary string where we can remove irrelevant openings and closings for purpose of tracking
			var bracktemp = brack;

			//Find next bracket starting with previous char, then check if its ahead of the next close
			//If it is, ignore both next open and close
			//Repeat until relevant close is found, then send context into another parseBrackets()
			while (true)
			{
				var nextopen2 = bracktemp.slice(nextopen + 1).indexOf(nextopenchar)
				if (nextopen2 == -1) nextopen2 = 99999;
				nextopen2 += nextopen;
				
				//No "if" following this, cause if there isnt a close char your input is fucking improperly formatted so kys
				nextclose = bracktemp.indexOf(nextclosechar);
				writelog("Current start pos: " + nextopen + " & Next close pos: " + nextclose);

				//If next close is before next open we're good, otherwise ignore next open and close and repeat
				//In this case the false is written first
				if (nextclose > nextopen2)
				{
					//Remove start and end paranthesis
					bracktemp = bracktemp.slice(0, nextopen2 + 1) + bracktemp.slice(nextopen2 + 2);
					writelog(bracktemp);
					bracktemp = bracktemp.slice(0, nextclose - 1) + bracktemp.slice(nextclose + 1);
					writelog(bracktemp);
					charcomp += 2;
					writelog(charcomp + "paranthesis removed in current iteration");
				}
				else break;
			}

			//Send this substring into another parser after removing it from main string
			writelog("Sending the following substring to be parsed");
			var toparse = brack.substr(nextopen + 1, nextclose - nextopen + charcomp - 1);
			writelog(toparse);
			writelog("test");
			var currentparsed = parseBrackets(toparse, nextopenchar, deep + 1);
			//Find length difference and try to compansate
			var lengthdiff = currentparsed.length - toparse.length;


			writelog("Back to deepness: " + deep);
			writelog(currentparsed);

			//This is a dirty ass solution that is probably only good to solve the current exact sentence
			//if (type != "M")
			{
				var brack = brack.slice(0, nextopen) + currentparsed + brack.slice(nextclose + 1); //+ 1, brack.length - nextclose + 1);
			}
			/*else
			{
				var brack = brack.slice(0, nextopen) + currentparsed;
			}
			writelog("Parsing of child done");*/
		}
		else
		{
			

			
			doparse = false;
		}
	}

	//No more brackets inside current parse, init parse step 2
	//pls write code here
	



	//Ignore this ok thx is for debugging bby
	if (type == "M")
	{
		//returnvalue = "*0*" + brack;
		returnvalue = brack;
	}
	if (type == "(")
	{
		writelog("Parsing ( chance");
		var bracktemp = brack;
		var percentages = new Array();
		var word = new Array();

		

		while (true)
		{
			var x1 = bracktemp.indexOf("|");
			percentages.push(bracktemp.slice(0, bracktemp.indexOf(":")));
			word.push(bracktemp.slice(bracktemp.indexOf(":") + 1, x1));
			bracktemp = bracktemp.slice(x1 + 1);
			if (bracktemp.indexOf("|") == -1) break;
		}
		percentages.push(bracktemp.slice(0, bracktemp.indexOf(":")));
		word.push(bracktemp.slice(bracktemp.indexOf(":") + 1));

		var finalvalue = weightedRandom(percentages, word);

		//returnvalue = "*1*" + finalvalue;
		returnvalue = finalvalue;

		//var returnvalue = "*1*" + brack;
	}
	if (type == "{")
	{
		writelog("Parsing { relationship");
		var bracktemp = brack;
		var highestvalue = 0;
		var word = "";

		while (true)
		{
			var x1 = bracktemp.indexOf("|");
			var tempvalue = parseInt(bracktemp.slice(0, bracktemp.indexOf(":")));

			if ((tempvalue <= relationship) && ( tempvalue >= highestvalue))
			{
				highestvalue = tempvalue;
				word = bracktemp.slice(bracktemp.indexOf(":") + 1, x1);
			}

			bracktemp = bracktemp.slice(x1 + 1);
			if (bracktemp.indexOf("|") == -1) break;
		}

		var tempvalue = parseInt(bracktemp.slice(0, bracktemp.indexOf(":")));
		if ((tempvalue <= relationship) && ( tempvalue >= highestvalue))
		{
			highestvalue = tempvalue;
			word = bracktemp.slice(bracktemp.indexOf(":") + 1);
		}




		//var returnvalue = "*2*" + brack;
		var returnvalue = word;
	}

	if (type == "[")
	{
		writelog("Parsing [ jobs");
		var bracktemp = brack;
		var word = "";

		while (true)
		{
			var x1 = bracktemp.indexOf("|");
			var tempvalue = parseInt(bracktemp.slice(0, bracktemp.indexOf(":")));

			if (tempvalue == job) word = bracktemp.slice(bracktemp.indexOf(":") + 1, x1);

			bracktemp = bracktemp.slice(x1 + 1);
			if (bracktemp.indexOf("|") == -1) break;
		}

		var tempvalue = parseInt(bracktemp.slice(0, bracktemp.indexOf(":")));
		if (tempvalue == job) word = bracktemp.slice(bracktemp.indexOf(":") + 1);

		//var returnvalue = "*3*" + brack;
		var returnvalue = word;
	}

	if (type == "<")
	{
		writelog("Parsing < traits");
		var bracktemp = brack;
		var word = "";

		while (true)
		{
			var x1 = bracktemp.indexOf("|");
			var tempvalue = bracktemp.slice(0, bracktemp.indexOf(":"));

			if (tempvalue == trait) word = bracktemp.slice(bracktemp.indexOf(":") + 1, x1);

			bracktemp = bracktemp.slice(x1 + 1);
			if (bracktemp.indexOf("|") == -1) break;
		}

		var tempvalue = bracktemp.slice(0, bracktemp.indexOf(":"));
		if (tempvalue == trait) word = bracktemp.slice(bracktemp.indexOf(":") + 1);

		//var returnvalue = "*4*" + brack;
		var returnvalue = word;
	}


	return returnvalue;
}

function replaceVariables(oldvars)
{
	//Connect your own list here
	var arrayvars = [
		["Street", "Swagstreet"],
		["City", "New Yok Shitty"],
		["Theirname", "Albertstein"],
		["Myname", "Floppy Mc Dildo"],
		["Subjective", "most likely"],
		["Objective", "definitely"],
		["Possessive", "it's mine bitch"],
		["Jobname", "Toilet Cleaner Supervisor"],
		["Jobloc", "Swagstreet 44"]
	  ];

	tempvars = oldvars;

	writelog("Length: " + arrayvars.length);

	var currentword = "";
	var currentname = "";
	
	while (tempvars.indexOf("$") != -1)
	{
		writelog("$ position: " + tempvars.indexOf("$"));

		var tempvars = tempvars.slice(tempvars.indexOf("$") + 1);
		var x1 = tempvars.indexOf(" ");
		var x2 = tempvars.indexOf(",");
		if (x2 == -1) var x3 = x1; else var x3 = x2;

		currentname = tempvars.slice(0, Math.min(x1, x2)).trim();

		for (i = 0; i<arrayvars.length; i+=1)
		{
			if (currentname === arrayvars[i][0]) currentword = arrayvars[i][1];
			writelog("Current check: (" + currentname + ") Current array word: " + arrayvars[i][1] + " [" + i + "] (" + arrayvars[i][0] + ")");
		}

		//oldvars = currentword + " " + oldvars;
		oldvars = oldvars.replace("$" + currentname, currentword);
		writelog("Replacing $" + currentname + " with " + currentword);
	}

	return oldvars;
}

function reverseChar(ch)
{
	switch (ch)
	{
		case "(":
			return ")";

		case ")":
			return "(";

		case "{":
			return "}";

		case "}":
			return "{";

		case "[":
			return "]";

		case "]":
			return "[";

		case "<":
			return ">";

		case ">":
			return "<";
	}
}

function writelog(str)
{
	console.log(str);
	//$('.output').append("<p>" + str + "</p>");
}

function add(a, b) { return parseInt(a) + parseInt(b); } // helper function

function weightedRandom(weights, elems)
{
	var totalWeight = weights.reduce(add, 0);

	var weighedElems = [];
	var currentElem = 0;
	while (currentElem < elems.length) {
	for (i = 0; i < weights[currentElem]; i++)
		weighedElems[weighedElems.length] = elems[currentElem];
	currentElem++;
	}

	var rnd = Math.floor(Math.random() * totalWeight);
	return weighedElems[rnd];
}








//$(document).ready(main)
