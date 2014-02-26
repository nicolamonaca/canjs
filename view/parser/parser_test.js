steal("can/view/parser", function(parser){
	
	
	module("can/view/parser")
	
	
	var makeChecks = function(tests){
		var count = 0;
		var makeCheck = function(name){
			
			return function(){
				console.log(name, arguments)
				if(count >= tests.length) {
					ok(false, "called "+name+" with "+arguments[0])
				} else {
					var test = tests[count],
						args = test[1]
					equal(name, test[0], "test "+count+" called "+name)
					for(var i = 0 ; i < args.length; i++) {
						equal(arguments[i], args[i], (i+1)+" argument is right");
					}
					count++;
				}
				
				
			}
		};
		
		
		return {
			start: makeCheck("start"),
			end: makeCheck("end"),
			close: makeCheck("close"),
			attrStart: makeCheck("attrStart"),
			attrEnd: makeCheck("attrEnd"),
			attrValue: makeCheck("attrValue"),
			chars: makeCheck("chars"),
			comment: makeCheck("comment"),
			special: makeCheck("special"),
			done: makeCheck("done")
		}
	}
	
	
	test("html to html", function(){
		
		
		
		var tests = [
			["start", ["h1", false]],
			["attrStart", ["id"]],
			["attrValue", ["foo"]],
			["attrEnd", ["id"]],
			["special", ["#if"]],
			["special", ["."]],			//5
			["special", ["/if"]],
			["attrStart", ["class"]],
			["attrValue", ["a"]],
			["special", ["foo"]],
			["attrEnd", ["class"]],		//10
			["end", ["h1", false]],
			["chars", ["Hello "]],
			["special", ["message"]],
			["chars", ["!"]],
			["close",["h1"]],
			["done",[]]
		]
		
		
		
		parser("<h1 id='foo' {{#if}}{{.}}{{/if}} class='a{{foo}}'>Hello {{message}}!</h1>",makeChecks(tests));
		
	});
	
	test("special in an attribute in an in-tag section", function(){
		
		parser("<div {{#truthy}}foo='{{baz}}'{{/truthy}}></div>",makeChecks([
			["start", ["div", false]],
			["special", ["#truthy"]],
			["attrStart", ["foo"]],
			["special", ["baz"]],
			["attrEnd", ["foo"]],		//10
			["special",["/truthy"]],
			["end", ["div", false]],
			["close",["div"]],
			["done",[]]
		]))
		
	})
	

	
})