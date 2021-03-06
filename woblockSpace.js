var toolbox;
var workspace
var definedObjectNames;
var definedObjectXmlContent;
var sceneXmlContent;
var freeAreaXmlContent;
var currentTab;
var currentIndex;
var definedObjectsMappingInfo;
var positionsMapping;

var sceneErrorLog;
var sceneErrorsFound;
var sceneSteps;
var sceneAlertErrors;

var clickEventFunction;

var wkImages;

function buildSources(definitions,executions) {
    
  const name = 'main.wlk'
  var content = `
  import wollok.game.*
  program main { `;

  if(document.getElementById('gameWidthComp') !== null && document.getElementById('gameWidthComp').value !== undefined && document.getElementById('gameWidthComp').value !== null && document.getElementById('gameWidthComp').value !== ''){
  	content += `
  	game.width(`+document.getElementById('gameWidthComp').value+')';
  }
    if(document.getElementById('gameHeightComp') !== null && document.getElementById('gameHeightComp').value !== undefined && document.getElementById('gameHeightComp').value !== null && document.getElementById('gameHeightComp').value !== ''){
  	content += `
  	game.height(`+document.getElementById('gameHeightComp').value+')';
  }
  content += `
  game.start()
  `+executions.join('\n')+`
  }
  `+definitions.join('\n')+`
  `
    console.log({ content })
    return [{ name, content }]
}

//<<<<
function spaceInit(){
	sceneAlertErrors = false;//////////////////////////////
	definedObjectNames = [];
	definedObjectXmlContent = [];
	sceneXmlContent = [];
	freeAreaXmlContent = [];
	currentTab = 'Scene';
	currentIndex = -1;
	definedObjectsMappingInfo = [];
	wkImages = [];

	var toolbox = document.getElementById("toolbox");//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	 
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
	workspaceBlocks = document.getElementById('workspaceBlocks');//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
	Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);

	loadWorkspaceConent(getMainToolboxXmlString());//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	
	clickEventFunction = Blockly.Events.Click;
	Blockly.registry.unregister("event", "click"); 
	Blockly.registry.register("event", "click",
    function(a,b,c){ 
    	var funk = clickEventFunction.bind(this); 
    	funk(a,b,c); 
    	if(c === 'block' && (a.type === 'objetc_create_wk' || definedObjectNames.includes(a.type) ) ){
    		updateMessagesFor(a);
    	}
    });

	TryLoadSavedSCene();//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	LoadDefaultImages();//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


	$('#code_generate').click();
}

function updateMessagesFor(aBlock){

	var x = null;
	if(aBlock.type === 'objetc_create_wk'){
		x = aBlock;
	}else if( definedObjectNames.includes(aBlock.type) ){
		x = aBlock.getDecompose(Blockly.mainWorkspace).getNextBlock();
	}
	if(x !== null){

		var msgs = [];
		var current = getBlockOfInputNamed(x,'properties');
		while(current !== null && current !== undefined){
			if(current.type === 'method_create_wk' ){
				msgs.push(current.getFieldValue('name'));
			}
			current = current.getNextBlock();
		}

		var msgsStr = "MENSAJES:";
		for(var i = 0; i < msgs.length; i++){
			msgsStr += "\n"+msgs[i];
		}
		aBlock.setWarningText(msgsStr);

		if( definedObjectNames.includes(aBlock.type) ){
			x.getParent().dispose();
		}
	}
}

//<<<<
function getWKCodeForCurrentWorkspace(){
	var generator = Blockly.Wollok;
	var content = document.getElementById('blocklyDiv');

	var code = '';
	if (checkAllGeneratorFunctionsDefined(generator)) {
	    code = generator.workspaceToCode(workspace);
	}
	return code;
}

function checkAllGeneratorFunctionsDefined(generator) {
  var blocks = workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) === -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length === 0;
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
	if(xmlContentList !== undefined && xmlContentList !== null && xmlContentList.length > 0){
		var xml;
		for(var i = 0; i < xmlContentList.length; i++){
			xml = jQuery.parseXML(xmlContentList[i]);
	    	Blockly.Xml.appendDomToWorkspace(xml,workspace);
		}
	}
}

//<<<<
function loadWorkspaceConent(stringXmlContent){
	document.getElementById('toolbox').innerHTML = stringXmlContent;
	workspace.updateToolbox(document.getElementById('toolbox'));
}

function mappinInfoComplete(aMappingInfo){
	for (var key in aMappingInfo.replacements){
 		if(aMappingInfo.replacements[key] === undefined || aMappingInfo.replacements[key] === null || aMappingInfo.replacements[key].val === undefined || aMappingInfo.replacements[key].val === null || aMappingInfo.replacements[key].val === ''){
 			return false;
 		}
	}
	return (aMappingInfo.icon !== undefined && aMappingInfo.icon !== null && aMappingInfo.icon !== '');
}

function ObjectsAndBehavioursAsBlocks(){
	var paramsMappings;
	var params;

	for(var i = 0; i < definedObjectXmlContent.length; i++ ){
		createAliasXML(definedObjectNames[i],definedObjectsMappingInfo[i].icon,definedObjectXmlContent[i].join(' </br> '));
	}

}

function getAllUnasignedValuesFrom(aString){
	regexp = /__(.*?)__(.*?)__/g;
	var match = aString.match(regexp);
	if(aString.match(regexp) !== undefined && aString.match(regexp) !== null){ 
		return  match.filter(function(item, pos, self) {return self.indexOf(item) === pos;});
	}else{
		return [];
	}
}

function createAliasXML(aliasBlockName, aliasBlockIconURL, innerBlockXML){

  //REGISTER BLOCK
  var functionString = ''; 
  functionString += 'Blockly.Blocks[\''+aliasBlockName+'\'] = {\n';
  functionString += ' init: function() {\n';
  functionString += '  this.appendDummyInput().appendField(new Blockly.FieldImage(\''+aliasBlockIconURL+'\', 25, 25, "*"));\n';
  functionString += '  this.setTooltip("'+aliasBlockName+'");';

  functionString += '  this.setOutput(true);\n';

  functionString += '	this.setWarningText(\'MENSAJES:\');';
  
  functionString += '   this.setColour(\''+colorPallette['created_objects_wk']+'\');';
  functionString += ' },\n';
  
  functionString += ' getDecompose : function (workspace) {\n';
  functionString += '   var innerXml = \'<xml> '+innerBlockXML+' </xml>\';\n';
  functionString += '   var newBlockId = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(innerXml), workspace)[0];\n';
  functionString += '   workspace.getBlockById(newBlockId).initSvg();';
  functionString += '   return workspace.getBlockById(newBlockId);';
  functionString += ' },\n';

  functionString += ' saveConnections : function(containerBlock) {},\n';

  functionString += ' updateShape_ : function() {},\n';

  functionString += ' getMetaInfo:function(self){\n';
  functionString += '	return {obj:\''+aliasBlockName+'\', method:null};	';
  functionString += ' }\n';
  functionString += '};';

  eval(functionString);
  

  //DEFINE WK BEHAVIOUR
  functionString = '';

  functionString += 'Blockly.JavaScript[\''+aliasBlockName+'\'] = function(block) {\n';
  functionString += '  return \''+aliasBlockName+'\';';
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
		if(Blockly.JavaScript[ objs[i].type ] !== undefined){
			
			if(objs[i].type === 'action_start' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && objs[i].getNextBlock().type === 'executor'){
					

					//colllect meta info
					partialMetaInfo = {objects:[],methods:{}};
					for(var j = 0; ( (iterateAll && j < objs.length) || (j < i) ); j++){
						if(j !== i){
							if(objs[j].type === 'action_start'){
								
								if(objs[j].getNextBlock() !== null && objs[j].getNextBlock().type === 'method_create'){
									metaInfo = Blockly.Blocks['method_create'].getMetaInfo(objs[j].getNextBlock());
									if(metaInfo.method.name !== null && metaInfo.method.paramsAmount !== null){
										partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
									}
								}

								if(objs[j].getNextBlock() !== null && objs[j].getNextBlock().type === 'objetc_create'){ 
									metaInfo = Blockly.Blocks['objetc_create'].getMetaInfo(objs[j].getNextBlock());
									if(metaInfo.obj !== null){
										partialMetaInfo.objects.push(metaInfo.obj);
									}
								}
							}else if(definedObjectNames.includes(objs[j].type)){
								metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
								if(metaInfo.obj !== null){
									partialMetaInfo.objects.push(metaInfo.obj);
								}

							}
						}
					}

					var current = objs[i].getNextBlock();
					while(current !== undefined && current !== null && current.type === 'executor'){

						res = Blockly.Wollok['executor'](current,partialMetaInfo);
						//DETECT ERROR
						if(typeof res === 'string'){
							strsToEval.push(res);
						}else{
							break;
							sceneErrorsFound = true;
						}

						current = current.getNextBlock();

					}

			}else{
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					strsToEval.push(res);
				}
			}
		}
	}
	sceneSteps = strsToEval;
}

//<<<<
function doPlaySceneWK(alertErrors){
	if(wkImages === undefined || wkImages === null){wkImages = [];}
	if( wkImages.length === 0){
		if( !window.confirm("No se han cargdo imagenes.??Esta seguro que quiere ejecutar la escena?")) {
  			return;
		}
	}

	fillCodeSection();

	var sceneText = getSceneCodeAsWKString('\n');
	if(sceneErrorsFound){
		
	}else{
		document.getElementById('playScenebutton').style.display = 'none';
		document.getElementById('resetScenebutton').style.display = 'block';
		var main = 'main';
		var images = wkImages;
		var sounds = [];
		var sources = buildSources(sceneText.definitions,sceneText.executions);
		var project = { main, images, sounds, sources };
		var gameDiv = document.getElementById('gameDiv'); 
		window.wkGame = new Game(project);
		window.wkGame.start(gameDiv);
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
		if(Blockly.JavaScript[ objs[i].type ] !== undefined){
			
			if(objs[i].type === 'action_start' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && objs[i].getNextBlock().type === 'executor'){
			
				//colllect meta info
				partialMetaInfo = {objects:[],methods:{}};
				for(var j = 0; ( (iterateAll && j < objs.length) || (j < i) ); j++){
					if(j !== i){
						if(objs[j].type === 'action_start'){
							
							if(objs[j].getNextBlock() !== null && objs[j].getNextBlock().type === 'method_create'){
								metaInfo = Blockly.Blocks['method_create'].getMetaInfo(objs[j].getNextBlock());
								if(metaInfo.method.name !== null && metaInfo.method.paramsAmount !== null){
									partialMetaInfo.methods[metaInfo.method.name] = metaInfo.method.paramsAmount;
								}
							}

							if(objs[j].getNextBlock() !== null && objs[j].getNextBlock().type === 'objetc_create'){ 
								metaInfo = Blockly.Blocks['objetc_create'].getMetaInfo(objs[j].getNextBlock());
								if(metaInfo.obj !== null){
									partialMetaInfo.objects.push(metaInfo.obj);
								}
							}
						}else if(definedObjectNames.includes(objs[j].type)){
							metaInfo = Blockly.Blocks[objs[j].type].getMetaInfo(objs[j]);
							if(metaInfo.obj !== null){
								partialMetaInfo.objects.push(metaInfo.obj);
							}

						}
					}

				}
				
				var current = objs[i].getNextBlock();
				while(current !== undefined && current !== null && current.type === 'executor'){
					
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
	var validExecutionTypes = ['executor_wk','var_objetc_wk','instruction_wk','keyboard_event_wk','tick_event_wk','collission_wk','condition_wk'];

	for(var i = 0; i < objs.length && !sceneErrorsFound; i++){
		if(Blockly.Wollok[ objs[i].type ] !== undefined){
			
			if(objs[i].type === 'action_start_wk' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && validExecutionTypes.includes(objs[i].getNextBlock().type)){			
								
				var current = objs[i].getNextBlock();

				while(current !== null){
					if(current.type !== null && validExecutionTypes.includes(current.type)){
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
				

			}else if(objs[i].type === 'action_start_wk' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && objs[i].getNextBlock().type === 'objetc_create_wk'){
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					result.definitions.push(res.replaceAll('\n',newlineSeparator));
				}else{
					sceneErrorsFound = true;
				}
			}/*else if(definedObjectNames.includes(objs[i].type)){
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				if(typeof res === 'string'){
					//console.log(res);
					result.definitions.push(res.replaceAll('\n',newlineSeparator));
				}else{
					sceneErrorsFound = true;
				}
			}*/
		}
	}

	if(currentTab === 'Scene'){
		var tempBlock;
		for(var i = 0; i < definedObjectNames.length; i++){
			tempBlock = Blockly.Blocks[definedObjectNames[i]].getDecompose(Blockly.getMainWorkspace());
			res = Blockly.Wollok['action_start_wk'](tempBlock);
			if(typeof res === 'string'){
				result.definitions.push(res.replaceAll('\n',newlineSeparator));
			}
			tempBlock.dispose();
		}
	}

	return result;
}

function saveCurrentXMLScene(){
	saveCurrentContent();	
	for(var i = 0; i < sceneXmlContent.length; i++ ){
		sceneXmlContent[i] = sceneXmlContent[i];
	}
	for(var i = 0; i < definedObjectXmlContent.length; i++ ){
		for(var j = 0; j < definedObjectXmlContent[i].length; j++ ){
			definedObjectXmlContent[i][j] = definedObjectXmlContent[i][j];
		}
	}
	var positionsMap = getPositionsMap();

	window.localStorage.setItem("sceneXmlContent", JSON.stringify(sceneXmlContent));
	window.localStorage.setItem("definedObjectNames", JSON.stringify(definedObjectNames));
	window.localStorage.setItem("definedObjectXmlContent", JSON.stringify(definedObjectXmlContent));
	window.localStorage.setItem("definedObjectsMappingInfo", JSON.stringify(definedObjectsMappingInfo));
	window.localStorage.setItem("definedWidth", document.getElementById('gameWidthComp').value);
	window.localStorage.setItem("definedHeight", document.getElementById('gameHeightComp').value);
	window.localStorage.setItem("positions",  JSON.stringify(positionsMap) );
	window.localStorage.setItem("woblocksSavePeformed", true);
}


function getPositionsMap(){//must be in scene tab!!!
	var positionsMap = {};
	var mainObjs = getAllParentlessObjects();
	var positions;
	for(var i = 0; i < mainObjs.length; i++){
		positions = mainObjs[i].getSvgRoot().getAttribute('transform').replace('translate(','').replace(')','').split(',').map(function(a){return parseInt(a)})
		positionsMap[ mainObjs[i].id ] = {x:positions[0],y:positions[1]}; 
	}
	return positionsMap;
}

function positionScenObjectsWith(aPositionsMap){//must be in scene tab!!!
	var mainObjs = getAllParentlessObjects();
	for(var i = 0; i < mainObjs.length; i++){
		mainObjs[i].moveTo(aPositionsMap[mainObjs[i].id]);
	}
}

function getSceneAsJSON(){
	saveCurrentContent();	
	for(var i = 0; i < sceneXmlContent.length; i++ ){
		sceneXmlContent[i] = sceneXmlContent[i];
	}
	for(var i = 0; i < definedObjectXmlContent.length; i++ ){
		for(var j = 0; j < definedObjectXmlContent[i].length; j++ ){
			definedObjectXmlContent[i][j] = definedObjectXmlContent[i][j];
		}
	}
	var positionsMap = {};
	var mainObjs = getAllParentlessObjects();
	var positions;
	for(var i = 0; i < mainObjs.length; i++){
		positions = mainObjs[i].getSvgRoot().getAttribute('transform').replace('translate(','').replace(')','').split(',').map(function(a){return parseInt(a)})
		positionsMap[ mainObjs[i].id ] = {x:positions[0],y:positions[1]}; 
	}

	var obj = {};
	obj.sceneXmlContent =  JSON.stringify(sceneXmlContent);
	obj.definedObjectNames =  JSON.stringify(definedObjectNames);
	obj.definedObjectXmlContent =  JSON.stringify(definedObjectXmlContent);
	obj.definedObjectsMappingInfo =  JSON.stringify(definedObjectsMappingInfo);
	obj.definedWidth =  document.getElementById('gameWidthComp').value;
	obj.definedHeight =  document.getElementById('gameHeightComp').value;
	obj.positions = JSON.stringify(positionsMap);

	return JSON.stringify(obj);
}

function saveJSONScenToLocalStorage(aJSON){
	var obj = JSON.parse(aJSON);
	window.localStorage.setItem("sceneXmlContent", obj.sceneXmlContent);
	window.localStorage.setItem("definedObjectNames", obj.definedObjectNames);
	window.localStorage.setItem("definedObjectXmlContent", obj.definedObjectXmlContent);
	window.localStorage.setItem("definedObjectsMappingInfo", obj.definedObjectsMappingInfo);
	window.localStorage.setItem("definedWidth", obj.definedWidth);
	window.localStorage.setItem("definedHeight", obj.definedHeight);
	window.localStorage.setItem("positions",  obj.positions);
}

//<<<<
function loadXMLScene(removeData){
	if(window.localStorage.getItem("woblocksSavePeformed") === 'true'){
		sceneXmlContent = JSON.parse(window.localStorage.getItem("sceneXmlContent"));
		definedObjectNames = JSON.parse(window.localStorage.getItem("definedObjectNames"));
		definedObjectXmlContent = JSON.parse(window.localStorage.getItem("definedObjectXmlContent"));
		definedObjectsMappingInfo = JSON.parse(window.localStorage.getItem("definedObjectsMappingInfo"));
		document.getElementById('gameWidthComp').value = window.localStorage.getItem("definedWidth", );
		document.getElementById('gameHeightComp').value = window.localStorage.getItem("definedHeight");
		if(removeData){
			clearSavedLocalStorageInfo();			
		}
		return true;
	}else{
		return false;
	}
}

function clearSavedLocalStorageInfo(){
	window.localStorage.removeItem("sceneXmlContent");
	window.localStorage.removeItem("definedObjectNames");
	window.localStorage.removeItem("definedObjectXmlContent");
	window.localStorage.removeItem("definedObjectsMappingInfo");
	window.localStorage.removeItem("woblocksSavePeformed");
	window.localStorage.removeItem("definedWidth");
	window.localStorage.removeItem("definedHeight");
	window.localStorage.setItem("woblocksSavePeformed", false);
}

function Reset(){
	saveCurrentXMLScene();
	window.location.reload();
}

//<<<<
function TryLoadSavedSCene(){

	var loadSuccesful = loadXMLScene(false);

	if(loadSuccesful){
		ObjectsAndBehavioursAsBlocks();
		loadWorkspaceConent( getMainToolboxXmlString() );
		workspace.clear();
		document.getElementById('sceneDiv').style.display = 'none';
		var newContent = sceneXmlContent;
		//document.getElementById('mappingSection').style.display = 'none';
		document.getElementById('sceneDiv').style.display = 'block';
		
		if(newContent !== null && newContent !== undefined && newContent.length > 0){
			injectXmlToWorkspace(newContent);
		}

		positionScenObjectsWith(JSON.parse(window.localStorage.getItem("positions")));

		redrawTabs();
	}
}

function doFormat(aString, newLIneStr){
	var lines = aString.split('\n');
	var level = 0;
	var line;
	var tabStr = '    ';
	
	var result = '';

	for(var i = 0; i < lines.length; i++){
		line = lines[i].trim();
		if( appearencesOf('}',line) === 1 ){
			level --;
		}
		result += timesStr(line,tabStr,level)+newLIneStr;
		if( appearencesOf('{',line) === 1 ){
			level ++;
		}
	}

	return '<pre>'+result+'</pre>';
}

function timesStr(aStr, aFiller, anAmount){
	var result = '';
	for(var i = 0; i < anAmount; i++){
		result += aFiller;
	}
	result += aStr;
	return result;
}

function appearencesOf(aSubsting, aString){
	return aString.split(aSubsting).length - 1;
}

//<<<<
async function LoadDefaultImages(){
	var imgsToLoad = getDefaultImages();
	var basePath = 'imgs/';
	wkImages = [];
	for(var i = 0; i < imgsToLoad.length; i++){
	  const response = await fetch(basePath+imgsToLoad[i])
	  const imageBlob = await response.blob()
	  imageBlob.name = imgsToLoad[i];
	  wkImages.push(buildImage(imageBlob));
	  wkImages[wkImages.length - 1].path = basePath+imgsToLoad[i]; 
      document.getElementById('loadedImages').innerHTML = wkImages.map(function(anElem){{return '<img src="'+anElem.path+'" style="width:30px;height:30px;">'+anElem.possiblePaths[0];}}).join('<br/>');
	}
}

//////////////
function getImageMethodFromWorkspace(){
	var result = workspace.getBlocksByType('method_create_wk').filter(function(elem){return elem.getFieldValue('name') == 'image'});
	if(result.length > 0){
		return result[0];
	}else{
		return null;
	}
}

function removeImageMethodFromWorkspace(){
	var imgMethodBlock = getImageMethodFromWorkspace();
	if(imgMethodBlock !== null){

		var methodBlockParent = imgMethodBlock.getParent();
		var methodBlockNextBlock = imgMethodBlock.getNextBlock();
		imgMethodBlock.unplug();
		//if there is an block plugged to imgMethodBlock, connect it to imgMethodBlock's parent
		if(methodBlockNextBlock !== undefined && methodBlockNextBlock !== null){
			var parentConnection;
			if(methodBlockParent.type === 'objetc_create_wk'){
				parentConnection = methodBlockParent.getFirstStatementConnection();
			}else{
				parentConnection = methodBlockParent.nextConnection;
			}

			methodBlockNextBlock.unplug();
			parentConnection.connect(methodBlockNextBlock.previousConnection);
		}
		imgMethodBlock.dispose();		 

	}
}

function addImageMethodToWorkspace(anImageUrl){
	
	//locate block to connect to
		var objBlocks = workspace.getAllBlocks().filter(function(anElem){return anElem.type === 'objetc_create_wk'});
		if(objBlocks.length !== 1){return;}
		var blockToConnectTo = objBlocks[0]; 

	//create xml
		var xmlStr = '';
		xmlStr += '	<block type="method_create_wk">';
		xmlStr += '		<field name="name">image</field>';
		xmlStr += '		<value name="params">';
		xmlStr += '			<block type="lists_create_with">';
		xmlStr += '				<mutation items="0"></mutation>';
		xmlStr += '			</block>';
		xmlStr += '		</value>';
		xmlStr += '		<statement name="instructions">';
		xmlStr += '			<block type="instruction_wk">';
		xmlStr += '				<value name="instruction">';
		xmlStr += '			    	<block type="text">';
		xmlStr += '			        	<field name="TEXT">return "'+anImageUrl+'"</field>';
		xmlStr += '			        </block>';
		xmlStr += '			    </value>';
		xmlStr += '			</block>';
		xmlStr += '		</statement>';
		xmlStr += '	</block>';
		
	//create new block
		var createdBlock = Blockly.Xml.appendDomToWorkspace(jQuery.parseXML(xmlStr),workspace);
		createdBlock = workspace.getBlockById(createdBlock[0]);
	//attach block
		if(blockToConnectTo.getFirstStatementConnection().targetBlock() === null){
			//object block has no statements blocks: attach new block to object block
			blockToConnectTo.getFirstStatementConnection().connect(createdBlock.previousConnection);
		}else{
			//object block has statements blocks: go to last one and attach new block
			var lastStatementBlock = blockToConnectTo.getFirstStatementConnection().targetBlock();
			var maxIterations = 500;
			while(maxIterations > 0 ){
				maxIterations--;
				if(lastStatementBlock.getNextBlock() !== null){
					lastStatementBlock = lastStatementBlock.getNextBlock();
				}else{
					break;
				}
			}
			lastStatementBlock.nextConnection.connect(createdBlock.previousConnection);

		}

}