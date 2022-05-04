var toolbox;
var workspace
var definedObjectNames;
var definedBehaviourNames;
var definedObjectXmlContent;
var definedBehaviourXmlContent;
var sceneXmlContent;
var freeAreaXmlContent;
var currentTab;
var currentIndex;
var definedObjectsMappingInfo;
var definedBehavioursMappingInfo;


var sceneErrorLog;
var sceneErrorsFound;
var sceneSteps;
var sceneAlertErrors;

var wollokNativeObjects;

var clickEventFunction;

function buildSources(definitions,executions) {
    /*
    const name = 'main.wlk'
    const content = `import wollok.game.*

  program main {
    game.start()
  }
  `
    console.log({ content })
    return [{ name, content }]
    */
    const name = 'main.wlk'
    const content = `
  import wollok.game.*
  program main {
  	game.start()
  	`+executions.join('\n')+`
  }
  `+definitions.join('\n')+`
  `
    console.log({ content })
    return [{ name, content }]
}

function spaceInit(){
	sceneAlertErrors = true;//////////////////////////////
	definedObjectNames = [];
	definedBehaviourNames = [];
	definedObjectXmlContent = [];
	definedBehaviourXmlContent = [];
	sceneXmlContent = [];
	freeAreaXmlContent = [];
	currentTab = 'Scene';
	currentIndex = -1;
	definedObjectsMappingInfo = [];
	definedBehavioursMappingInfo = [];

	wollokNativeObjects = ['console'];

	var toolbox = document.getElementById("toolbox");
	 
	var options = { 
		toolbox : toolbox, 
		collapse : true, 
		comments : true, 
		disable : true, 
		maxBlocks : Infinity, 
		trashcan : true, 
		horizontalLayout : false, 
		toolboxPosition : 'start', 
		css : true, 
		media : 'https://blockly-demo.appspot.com/static/media/', 
		rtl : false, 
		scrollbars : true, 
		sounds : true, 
		oneBasedIndex : true
	};
	 
	// Inject workspace 
	workspace = Blockly.inject('blocklyDiv', options);
	 
	// Load blocks to workspace
	workspaceBlocks = document.getElementById('workspaceBlocks'); 
	Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);

	loadWorkspaceConent(getMainToolboxXmlString());

	workspace.addChangeListener( onWorkspaceChange );
	

/*
	clickEventFunction = Blockly.Events.Click;
	Blockly.registry.unregister("event", "click"); 
	Blockly.registry.register("event", "click",
    function(a,b,c){ 
    	var funk = clickEventFunction.bind(this); 
    	funk(a,b,c); 
    	if(c == 'block' && (a.type == 'objetc_create' || definedObjectNames.includes(a.type) ) ){
    		updateMessagesFor(a);
    	}
    });
*/

/*
	//WOLLOK GAME INIT EXAMPLE
	var main = 'main';
	var images = [];
    var sounds = [];
    var sources = buildSources();
    var project = { main, images, sounds, sources };
    var gameDiv = document.getElementById('sceneDiv'); 
    new Game(project).start(gameDiv);
*/
}

function updateMessagesFor(aBlock){
	var objs = getAllParentlessObjects();
	var iterateAll = true;
	var existingMethods = [];
	
	//find object index
	var found = false;
	var index = 0;
	while(index < objs.length){
		if(objs[index].type == 'action_start' && objs[index].getNextBlock() != null && objs[index].getNextBlock().type == 'objetc_create'){
			if( objs[index].getNextBlock().id == aBlock.id){
				found = true;
				break;
			}
		}else if( objs[index].id == aBlock.id ){
			found = true;
			break;
		}
		index++;
	}

	if(found){
		for(var j = 0; ( (iterateAll && j < objs.length ) || (j < index)); j++){
			if(j != index){
				if(objs[j].type == 'action_start' && objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'method_create'){
					existingMethods.push( Blockly.JavaScript.valueToCode(objs[j].getNextBlock(), 'name', Blockly.JavaScript.ORDER_ATOMIC).replaceAll('\'','') );
				}else if(definedBehaviourNames.includes(objs[j].type)){
					existingMethods.push(objs[j].type);
				}
			}
		}
		var msgs = [];
		if(aBlock.type == 'objetc_create'){
			msgs = Blockly.Blocks['objetc_create'].getMessagesOf(aBlock,existingMethods);
		}else if(definedObjectNames.includes(aBlock.type)){
			var decomposed = aBlock.getDecompose(Blockly.getMainWorkspace());
			msgs = Blockly.Blocks['objetc_create'].getMessagesOf(decomposed.getNextBlock(),existingMethods);
			decomposed.dispose();
		}

		var msgsStr = "MENSAJES:";
		for(var i = 0; i < msgs.length; i++){
			msgsStr += "\n"+msgs[i];
		}
		aBlock.setWarningText(msgsStr);
	}
}

function getJSCodeForCurrentWorkspace(){
	var generator = Blockly.JavaScript;
	var content = document.getElementById('blocklyDiv');
	//content.textContent = '';
	var code = '';
	if (checkAllGeneratorFunctionsDefined(generator)) {
	    code = generator.workspaceToCode(workspace);
	    //content.textContent = code;
	}
	return code;
}

function checkAllGeneratorFunctionsDefined(generator) {
  var blocks = workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) == -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = 'The generator code for the following blocks not specified for ' +
        generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
    Blockly.alert(msg);  // Assuming synchronous. No callback.
  }
  return valid;
}

function getWorkspaceXmlContentAsList(){
	return Blockly.Xml.workspaceToDom(workspace).childNodes;
}

function injectXmlToWorkspace(xmlContentList){
	workspace.clear();
	if(xmlContentList != undefined && xmlContentList != null && xmlContentList.length > 0){
		var xml;
		for(var i = 0; i < xmlContentList.length; i++){
			xml = jQuery.parseXML(xmlContentList[i]);
	    	Blockly.Xml.appendDomToWorkspace(xml,workspace);
		}
	}
}

function loadWorkspaceConent(stringXmlContent){
	document.getElementById('toolbox').innerHTML = stringXmlContent;
	workspace.updateToolbox(document.getElementById('toolbox'));
}

function mappinInfoComplete(aMappingInfo){
	for (var key in aMappingInfo.replacements){
 		if(aMappingInfo.replacements[key] == undefined || aMappingInfo.replacements[key] == null || aMappingInfo.replacements[key].val == undefined || aMappingInfo.replacements[key].val == null || aMappingInfo.replacements[key].val == ''){
 			return false;
 		}
	}
	return (aMappingInfo.icon != undefined && aMappingInfo.icon != null && aMappingInfo.icon != '') && (aMappingInfo.color != undefined && aMappingInfo.color != null && aMappingInfo.color != '');
}

function ObjectsAndBehavioursAsBlocks(){
	//var defaultIcon = 'icons/Circle.png';	
	var paramsMappings;
	//var valueMappings;
	var params;

	for(var i = 0; i < definedObjectXmlContent.length; i++ ){
		//if mapping complete
		if(mappinInfoComplete(definedObjectsMappingInfo[i])){
			paramsMappings = [];
			//valueMappings = [];
			params = [];
			for (var key in definedObjectsMappingInfo[i].replacements) { 
				/*
				if(definedObjectsMappingInfo[i].replacements[key].type == 'value' || definedObjectsMappingInfo[i].replacements[key].type == 'param'){
					params.push(''+key);
					if(definedObjectsMappingInfo[i].replacements[key].type == 'value'){valueMappings.push({k:''+key , v:definedObjectsMappingInfo[i].replacements[key].val });}
					if(definedObjectsMappingInfo[i].replacements[key].type == 'param'){paramsMappings.push({k:''+key , v:definedObjectsMappingInfo[i].replacements[key].val });}

				}
				*/
				params.push(''+key);
				paramsMappings.push({k:''+key , v:definedObjectsMappingInfo[i].replacements[key].val });
			}
			createAliasXML(definedObjectNames[i],definedObjectsMappingInfo[i].icon,definedObjectsMappingInfo[i].color,params,paramsMappings/*,valueMappings*/, definedObjectXmlContent[i].join(' </br> '),document.getElementById('mapping_show_names').checked, 'obj' );
		}else{ alert('La informacion provista es incompleta. Este objeto no se creará');}
	}

	for(var i = 0; i < definedBehaviourXmlContent.length; i++ ){
		//if mapping complete
		if(mappinInfoComplete(definedBehavioursMappingInfo[i])){
			paramsMappings = [];
			//valueMappings = [];
			params = [];
			for (var key in definedBehavioursMappingInfo[i].replacements) { 
				/*
				if(definedBehavioursMappingInfo[i].replacements[key].type == 'value' || definedBehavioursMappingInfo[i].replacements[key].type == 'param'){
					params.push(''+key);
					if(definedBehavioursMappingInfo[i].replacements[key].type == 'value'){valueMappings.push({k:''+key , v:definedBehavioursMappingInfo[i].replacements[key].val });}
					if(definedBehavioursMappingInfo[i].replacements[key].type == 'param'){paramsMappings.push({k:''+key , v:definedBehavioursMappingInfo[i].replacements[key].val });}

				}
				*/
				params.push(''+key);
				paramsMappings.push({k:''+key , v:definedBehavioursMappingInfo[i].replacements[key].val });
			}
			createAliasXML(definedBehaviourNames[i],definedBehavioursMappingInfo[i].icon,document.getElementById('mapping_color_back').value,params,paramsMappings,/*valueMappings,*/ definedBehaviourXmlContent[i].join(' '),document.getElementById('mapping_show_names').checked,'bh' );
		}else{ alert('La informacion provista es incompleta. Este comportamiento no se creará');}
	}

}

function getAllUnasignedValuesFrom(aString){
	regexp = /__(.*?)__(.*?)__/g;
	var match = aString.match(regexp);
	if(aString.match(regexp) != undefined && aString.match(regexp) != null){ 
		return  match.filter(function(item, pos, self) {return self.indexOf(item) == pos;});
	}else{
		return [];
	}
}

function createAliasXML(aliasBlockName, aliasBlockIconURL, backColor, paramsList, paramsReplacements, innerBlockXML, showFieldNames, type){
  
  //REGISTER BLOCK
  var functionString = ''; 
  functionString += 'Blockly.Blocks[\''+aliasBlockName+'\'] = {\n';
  functionString += ' init: function() {\n';
  functionString += '  this.appendDummyInput().appendField("'+aliasBlockName+'");';
  functionString += '  this.appendDummyInput().appendField(new Blockly.FieldImage(\''+aliasBlockIconURL+'\', 50, 50, "*"));\n';
  
  for(var i = 0; i < paramsReplacements.length; i++){
	if(showFieldNames){
  		functionString += '  this.appendValueInput("'+paramsReplacements[i].v+'").setCheck(null).appendField("'+paramsReplacements[i].v+'");\n';
	}else{
  		functionString += '  this.appendValueInput("'+paramsReplacements[i].v+'").setCheck(null);\n';
	}  	
  }

/*
  for(var i = 0; i < paramsList.length; i++){
    functionString += '  this.appendValueInput("'+paramsList[i]+'").setCheck(null);\n';
  }
*/  
  if(type == 'obj'){functionString += '	this.setWarningText(\'MENSAJES:\');';}
  

  functionString += '   this.setTooltip(\'\' );\n';
  //functionString += '   this.setMutator(new Blockly.Mutator(""));\n';
  functionString += '   this.setColour(\''+backColor+'\');';
  functionString += ' },\n';
 /* 
  functionString += ' mutationToDom : function (workspace) {\n';
  functionString += '   var container = document.createElement(\'mutation\');\n';
  functionString += '   return container;\n';
  functionString += ' },\n';

  
  functionString += ' domToMutation : function (xmlElement) {\n';
  functionString += '   this.updateShape_();\n';
  functionString += ' },\n';
*/
  functionString += ' getDecompose : function (workspace) {\n';
  functionString += '   var innerXml = \'<xml> '+innerBlockXML+' </xml>\';\n';
  functionString += '   var newBlockId = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(innerXml), workspace)[0];\n';
  functionString += '   workspace.getBlockById(newBlockId).initSvg();';
  functionString += '   return workspace.getBlockById(newBlockId);';
  functionString += ' },\n';

  //functionString += ' decompose : function (workspace) {\n';
  
  //functionString += '   var containerBlock = workspace.newBlock(\'printer\');\n';////////////////////////////////////////////
  //functionString += '   containerBlock.initSvg();';
  //functionString += '   return containerBlock';
  
//  functionString += '   var innerXml = \'<xml> '+innerBlockXML+' </xml>\';\n';
//  functionString += '   var newBlockId = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(innerXml), workspace)[0];\n';
//  functionString += '   workspace.getBlockById(newBlockId).initSvg();';
//  functionString += '   return workspace.getBlockById(newBlockId);';
  

  //functionString += ' },\n';

/*
  functionString += ' compose : function(containerBlock) {\n';
  functionString += '   this.updateShape_();\n';
  functionString += ' },\n';
*/

  functionString += ' saveConnections : function(containerBlock) {},\n';

  functionString += ' updateShape_ : function() {},\n';

  functionString += ' getMetaInfo:function(self){\n';
  if(type == 'obj'){
  	functionString += '	return {obj:\''+aliasBlockName+'\', method:null};	';
  }else if(type == 'bh'){
	functionString += '	return {method:{name:\''+aliasBlockName+'\' , paramsAmount: '+paramsList.length+'}, obj:null};	';
  }else{
  	functionString += '	return {method:null, obj:null};	';
  }
  functionString += ' }\n';
  functionString += '};';

  eval(functionString);
  //DEFINE JS BEHAVIOUR
  functionString = '';

  functionString += 'Blockly.JavaScript[\''+aliasBlockName+'\'] = function(block) {\n';
  //functionString += '  var decomposed = block.decompose(Blockly.getMainWorkspace());\n';
  functionString += '  var decomposed = block.getDecompose(Blockly.getMainWorkspace());\n';
  functionString += '  var replacements = [';
  /*for(var i = 0; i < constantReplacements.length; i++){
    if(i > 0){functionString += ',';}
    functionString += '{ k:\''+constantReplacements[i].k+'\' , v: '+constantReplacements[i].v+'}';
  }*/
  functionString +='];\n';
  for(var i = 0; i < paramsReplacements.length; i++){
    functionString += '   replacements.push({k:\''+paramsReplacements[i].k+'\' , v: Blockly.JavaScript.valueToCode(block, \''+paramsReplacements[i].v+'\', Blockly.JavaScript.ORDER_ATOMIC) });\n';
  }
  functionString += '  var code = Blockly.JavaScript[decomposed.type](decomposed);\n';
  functionString += '  decomposed.dispose();\n';
  functionString += '  for(var i = 0; i < replacements.length; i++){\n';
  functionString += '    code = code.replace(replacements[i].k , replacements[i].v);\n';
  functionString += '  }\n';
  functionString += '  return code;\n';
  functionString += '};\n';

  eval(functionString);

 
  functionString = 'Blockly.getMainWorkspace().getToolbox().clearSelection();\n';

  eval(functionString);
}

function getAllParentlessObjects(){
	var nodes = getWorkspaceXmlContentAsList();
	var ids = [];for(var i = 0; i < nodes.length; i++){ids.push(nodes[i].id);}

	var blocks = workspace.getAllBlocks();
	var result = [];
	for(var i = 0; i < blocks.length; i++ ){
		if(ids.includes(blocks[i].id)){
			result.push(blocks[i]);
		}
	}
	//TODO ORDER BY block.getRelativeToSurfaceXY().y
	result = result.sort(function(a,b){
		return a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y
	});
	return result;
}

function getSceneExecution(alertErrors){
	var iterateAll = true;
	sceneAlertErrors = alertErrors;

	var objs = getAllParentlessObjects();
	var res;
	var partialMetaInfo;
	var metaInfo;
	var strsToEval = [];
	sceneErrorsFound = false;
	sceneErrorLog = '';
	sceneSteps = [];

	for(var i = 0; i < objs.length && !sceneErrorsFound; i++){
		if(Blockly.JavaScript[ objs[i].type ] != undefined){
			
			if(objs[i].type == 'action_start' && objs[i].getNextBlock() != undefined && objs[i].getNextBlock() != null && objs[i].getNextBlock().type == 'executor'){
					

					//colllect meta info
					partialMetaInfo = {objects:[],methods:{}};
					for(var j = 0; ( (iterateAll && j < objs.length) || (j < i) ); j++){
						if(j != i){
							if(objs[j].type == 'action_start'){
								
								if(objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'method_create'){
									metaInfo = Blockly.Blocks['method_create'].getMetaInfo(objs[j].getNextBlock());
									if(metaInfo.method.name != null && metaInfo.method.paramsAmount != null){
										partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
									}
								}

								if(objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'objetc_create'){ 
									metaInfo = Blockly.Blocks['objetc_create'].getMetaInfo(objs[j].getNextBlock());
									if(metaInfo.obj != null){
										partialMetaInfo.objects.push(metaInfo.obj);
									}
								}
							}else if(definedObjectNames.includes(objs[j].type)){
								metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
								if(metaInfo.obj != null){
									partialMetaInfo.objects.push(metaInfo.obj);
								}

							}else if(definedBehaviourNames.includes(objs[j].type)){
								metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
								if(metaInfo.method.name != null && metaInfo.method.paramsAmount != null){
									partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
								}
							}
						}
					}

					var current = objs[i].getNextBlock();
					while(current != undefined && current != null && current.type == 'executor'){

						res = Blockly.JavaScript['executor'](current,partialMetaInfo);
						//DETECT ERROR
						if(typeof res === 'string'){
							//console.log(res);
							strsToEval.push(res);
						}else{
							break;
							sceneErrorsFound = true;
						}

						current = current.getNextBlock();

					}

			}else{
				res = Blockly.JavaScript[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					strsToEval.push(res);
				}
			}
		}
	}
	sceneSteps = strsToEval;
}

function doPlayScene(alertErrors){
	getSceneExecution(alertErrors);
	if(sceneErrorsFound){
		///
	}else{
		for(var i = 0; i < sceneSteps.length; i++){
			try{
				eval(sceneSteps[i]);
			}catch(e){
				alert(e);
			}
		}
	} 
}

function doPlaySceneWK(alertErrors){
	var sceneText = getSceneCodeAsWKString('\n');
	if(sceneErrorsFound){
		///
	}else{
		var main = 'main';
		var images = [];
		var sounds = [];
		var sources = buildSources(sceneText.definitions,sceneText.executions);
		var project = { main, images, sounds, sources };
		var gameDiv = document.getElementById('gameDiv'); 
		new Game(project).start(gameDiv);
	} 
}

function getSceneCodeAsString(){
	var iterateAll = true;
	result = [];

	var objs = getAllParentlessObjects();
	var partialMetaInfo;
	var metaInfo;
	var strsToEval = [];
	var res;
	sceneErrorsFound = false;
	sceneErrorLog = '';
	sceneSteps = [];

	for(var i = 0; i < objs.length && !sceneErrorsFound; i++){
		if(Blockly.JavaScript[ objs[i].type ] != undefined){
			
			if(objs[i].type == 'action_start' && objs[i].getNextBlock() != undefined && objs[i].getNextBlock() != null && objs[i].getNextBlock().type == 'executor'){
			
				//colllect meta info
				partialMetaInfo = {objects:[],methods:{}};
				for(var j = 0; ( (iterateAll && j < objs.length) || (j < i) ); j++){
					if(j != i){
						if(objs[j].type == 'action_start'){
							
							if(objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'method_create'){
								metaInfo = Blockly.Blocks['method_create'].getMetaInfo(objs[j].getNextBlock());
								if(metaInfo.method.name != null && metaInfo.method.paramsAmount != null){
									partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
								}
							}

							if(objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'objetc_create'){ 
								metaInfo = Blockly.Blocks['objetc_create'].getMetaInfo(objs[j].getNextBlock());
								if(metaInfo.obj != null){
									partialMetaInfo.objects.push(metaInfo.obj);
								}
							}
						}else if(definedObjectNames.includes(objs[j].type)){
							metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
							if(metaInfo.obj != null){
								partialMetaInfo.objects.push(metaInfo.obj);
							}

						}else if(definedBehaviourNames.includes(objs[j].type)){
							metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
							if(metaInfo.method.name != null && metaInfo.method.paramsAmount != null){
								partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
							}
						}
					}

				}
				
				var current = objs[i].getNextBlock();
				while(current != undefined && current != null && current.type == 'executor'){
					
					res = Blockly.JavaScript['executor'](current,partialMetaInfo);
					
					//DETECT ERROR
					if(typeof res === 'string'){
						result.push( res.replaceAll('\n','') );
					}else{
						result.push('<ERROR FOUND>');
					}

					current = current.getNextBlock();
				}

			}else{
				res = Blockly.JavaScript[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					result.push(res.replaceAll('\n',''));
				}
			}
		}
	}
	return result;
}

function getSceneCodeAsWKString(newlineSeparator){
	sceneErrorsFound = false;
	result = {definitions:[],executions:[]};

	var objs = getAllParentlessObjects();
	var partialMetaInfo;
	var metaInfo;
	var strsToEval = [];
	var res;
	sceneErrorsFound = false;
	sceneErrorLog = '';
	sceneSteps = [];

	for(var i = 0; i < objs.length && !sceneErrorsFound; i++){
		if(Blockly.Wollok[ objs[i].type ] != undefined){
			
			if(objs[i].type == 'action_start_wk' && objs[i].getNextBlock() != undefined && objs[i].getNextBlock() != null && objs[i].getNextBlock().type == 'executor_wk'){			
								
				var current = objs[i].getNextBlock();
				var validTypes = ['executor_wk','var_objetc_wk','instruction_wk'];

				while(current != null){
					if(current.type != null && validTypes.includes(current.type)){
						res = Blockly.Wollok[current.type](current);
							
						//DETECT ERROR
						if(typeof res === 'string'){
							result.executions.push( res.replaceAll('\n','') );
						}else{
							sceneErrorsFound = true;
						}
					}
					current = current.getNextBlock();
				}
				

			}else if(objs[i].type == 'action_start_wk' && objs[i].getNextBlock() != undefined && objs[i].getNextBlock() != null && objs[i].getNextBlock().type == 'objetc_create_wk'){
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					result.definitions.push(res.replaceAll('\n',newlineSeparator));
				}else{
					sceneErrorsFound = true;
				}
			}else if(definedObjectNames.includes(objs[i].type)){
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					result.definitions.push(res.replaceAll('\n',newlineSeparator));
				}else{
					sceneErrorsFound = true;
				}
			}
		}
	}
	return result;
}
