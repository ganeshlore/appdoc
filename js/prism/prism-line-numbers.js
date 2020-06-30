Prism.hooks.add('before-insert', function(env){
	var el = env.element;
	if (!(el.hasAttribute('data-linenumber'))) return;
	var startNumber = parseInt(el.getAttribute('data-linenumber'))||0;
	el.style.counterReset = getComputedStyle(el).counterReset.replace(/-?\d+/, startNumber-1);
	var line = '<span class=line >', endline = '</span>';
	// some highlighting puts newlines inside the span, which messes up the code below. Fix that. Newlines that are actually inside the span will still 
	// cause problems.
	var code = env.highlightedCode.replace(/\n<\/span>/g, '</span>\n');
	env.highlightedCode = line + code.split('\n').join(endline+'\n'+line) + endline;
});