import Blockly from 'blockly';
import './woblocks_blocks.tsx'
import {getRepIconFor} from '../ImagePathManager'

var woblocksControl = {};
woblocksControl.private = {};


woblocksControl.init = function(){
	this.mainSceneInfo = {xml:Blockly.Xml.textToDom('<xml></xml>') };
	
	this.definedObjectsInfo = {};
	this.definedObjectsInfo.objectNames = []; //name list
	this.definedObjectsInfo.objectsInfoMap = {};//Map Name => {definedObjectXmlContent , definedObjectsMappingInfo}
	//definedObjectXmlContent : xml
	//definedObjectsMappingInfo: {representationName,isVisual}

	this.config = {};
	this.config.wkImages = [];
	this.config.height = 20;
	this.config.width = 20;
	this.config.backgroundImage = '';
	this.toRemove = [];
	this.wkGame = null;	

	//override translations to turn native list block into parameter-list block
	Blockly.Msg['LISTS_CREATE_EMPTY_TITLE'] = '';
	Blockly.Msg['LISTS_CREATE_WITH_INPUT_WITH'] = '';
	Blockly.Msg['LISTS_CREATE_WITH_CONTAINER_TITLE_ADD'] = '';
	Blockly.Msg['LISTS_CREATE_WITH_ITEM_TITLE'] = 'parametro';


}

woblocksControl.addObjectNamed = function(aNewObjectName,aRepresentationName,isVisual){
	if(this.definedObjectsInfo.objectNames.includes(aNewObjectName)){return false;}
	this.definedObjectsInfo.objectNames.push(aNewObjectName);
	this.definedObjectsInfo.objectsInfoMap[aNewObjectName] = {code:'',xml:'<xml></xml>',definedObjectsMappingInfo: {representationName:aRepresentationName,isVIsual:isVisual}};
	return true;
}

//WORKSPACE XML & BLOCKS UTILS

woblocksControl.saveSceneXmlContent = function(){
	this.sanitizeTextInputBlocks();
	this.mainSceneInfo.xml = Blockly.Xml.domToText( Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace()) );
	//console.log('saveSceneXmlContent>> '+ this.mainSceneInfo.xml );
	return true;
}

woblocksControl.addDefaultObjectXmlToWorkspaceNamed = function(anObjectName){
	Blockly.getMainWorkspace().clear();
	var xmlStr = '<xml>'+woblocksControl.getDefaultWKObjectXmlNamed(anObjectName)+'</xml>';

	var objXmlToAppend = Blockly.Xml.textToDom( xmlStr );
	Blockly.Xml.appendDomToWorkspace( objXmlToAppend,Blockly.getMainWorkspace());
}

woblocksControl.addDefaultObjectXmlToWorkspaceWithNameAndImage = function(anObjectName,anImage){
	console.log('woblocksControl addDefaultObjectXmlToWorkspaceWithNameAndImage '+anObjectName+' '+anImage);
	Blockly.getMainWorkspace().clear();
	var xmlStr = '<xml>'+woblocksControl.getDefaultWKObjectXmlWithNameAndImage(anObjectName,anImage)+'</xml>';

	var objXmlToAppend = Blockly.Xml.textToDom( xmlStr );
	Blockly.Xml.appendDomToWorkspace( objXmlToAppend,Blockly.getMainWorkspace());
}

woblocksControl.saveObjectTabXmlContentWithIndex = function(anIndex){
	this.sanitizeTextInputBlocks();
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	
	var objName = this.definedObjectsInfo.objectNames[anIndex];
	
	const definitionBlock = woblocksControl.getAllParentlessObjects().filter(function(elem){
		return elem.type === 'objetc_create_wk'
	})[0];
	this.definedObjectsInfo.objectsInfoMap[objName].xml = '<xml>'+( (definitionBlock)?Blockly.Xml.domToText(Blockly.Xml.blockToDom(definitionBlock)):'' )+'</xml>'; 
	this.definedObjectsInfo.objectsInfoMap[objName].code =  (definitionBlock)?Blockly.Blocks[ definitionBlock.type ].getValueWK(definitionBlock):'';

	return true;
}

woblocksControl.loadSceneXmlContent = function(){
	Blockly.getMainWorkspace().clear();
	if(this.mainSceneInfo.xml){
		//console.log('loadSceneXmlContent '+this.mainSceneInfo.xml);
		Blockly.Xml.appendDomToWorkspace( Blockly.Xml.textToDom( this.mainSceneInfo.xml ),Blockly.getMainWorkspace());
	}
}

woblocksControl.loadDefinedObjectXmlContent = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}

	var objName = this.definedObjectsInfo.objectNames[anIndex];
	Blockly.getMainWorkspace().clear();
	if(this.definedObjectsInfo.objectsInfoMap[objName].xml){
		Blockly.Xml.appendDomToWorkspace( Blockly.Xml.textToDom( this.definedObjectsInfo.objectsInfoMap[objName].xml ),Blockly.getMainWorkspace());
	}
	return true;
}

woblocksControl.getAllParentlessObjects = function(){
	var nodes = this.getWorkspaceXmlContentAsList();
	var ids = [];for(var i = 0; i < nodes.length; i++){ids.push(nodes[i].id);}
	//var ids = nodes.map(function(anElem){return anElem.id;});

	var blocks = Blockly.getMainWorkspace().getAllBlocks();
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

woblocksControl.getWorkspaceXmlContentAsList = function(){
	return Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace()).childNodes;
}

woblocksControl.getAllStatementsOf = function(aBlock){
	var result = [];
	if(aBlock.statementInputCount > 0 && aBlock.getFirstStatementConnection().targetBlock()){
		var iter = aBlock.getFirstStatementConnection().targetBlock();
		result.push(iter);
		while(iter.getNextBlock() != null){
			iter = iter.getNextBlock();
			result.push(iter);
		}
	}
	return result;
}

// MAGIC: CREATES TOKEN BLOCKS BASED ON DEFINED OBJECTS

woblocksControl.definedObjectsAsBlocklyBlocksFor = function(aSpecificationsList){
	aSpecificationsList.map(function(elem){

	  Blockly.defineBlocksWithJsonArray([
	  {
	    "type": elem.name,
		"message0": "%1",
		"args0": [
		  {
		    "type": "field_image",
		    "src": elem.iconUrl,
		    "width": 25,
		    "height": 25,
		    "alt": "*",
		    "flipRtl": false
		  }
		],
		"output": null,
		"colour": 120,
		"tooltip": elem.name,
		"helpUrl": ""
	  }
	]);

	Blockly.Blocks[''+elem.name].getValueWK = function(aBlock){return elem.name;}

	});
}

woblocksControl.definedObjectsAsBlocklyBlocks = function(){
	var specList = woblocksControl.definedObjectsInfo.objectNames.map(function(objName){ 
		return { name:objName , iconUrl: getRepIconFor(woblocksControl.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.representationName) } 
	});
	woblocksControl.definedObjectsAsBlocklyBlocksFor(specList);
}

//BUILD GAME

woblocksControl.getExecutionString = function(){

	const definitionBlocks = woblocksControl.getAllParentlessObjects().filter(function(elem){
		return elem.type === 'objetc_create_wk'
	});

	//const executionTypes = ['executor_wk', 'execution_res_wk', 'var_objetc_wk', 'keyboard_event_wk', 'tick_event_wk', 'collission_wk'];
	const executionTypes = ['action_start_wk'];
	const executionBlocks = woblocksControl.getAllParentlessObjects().filter(function(elem){
		return executionTypes.includes(elem.type)
	});
	var result = `import wollok.game.*
program main {
game.width(`+this.config.width+`)
game.height(`+this.config.height+`)
`;
	if(this.config.backgroundImage && this.config.backgroundImage !== ''){
		result += `game.boardGround("`+this.config.backgroundImage+`")
		`;	
	}

    result += `keyboard.backspace().onPressDo{
	game.remove()
}
game.start()
    `;

    result += Object.keys(this.definedObjectsInfo.objectsInfoMap).filter(function(key){return woblocksControl.definedObjectsInfo.objectsInfoMap[key].definedObjectsMappingInfo.isVisual }).map(function(key){ return 'game.addVisual('+key+')'  }).join('\n');
    result += '\n';
	result += executionBlocks.map(function(elem){return Blockly.Blocks[elem.type].getValueWK(elem)}).join('\n');
	result += '\n}\n';

	result += definitionBlocks.map(function(elem){return Blockly.Blocks[elem.type].getValueWK(elem)}).join('\n')
	result += '\n';
	result += Object.keys(this.definedObjectsInfo.objectsInfoMap).map(function(key){ return  woblocksControl.definedObjectsInfo.objectsInfoMap[key].code }).join('\n');

	return result;
}

//assumes a string where each line has no identation
woblocksControl.simpleFormatter = function(str,useHtml){
    var result = [];
    var strLst = str.split('\n');
    var lvl = 0;
    var line;
    strLst.forEach(function(aLine){
        line = aLine.replace(/^\s+|\s+$/g, '');
        var diff = (line.split("{").length - 1) - (line.split("}").length - 1) 
        //console.log(line+'   diff:'+diff);
        var padding = '';
        if(useHtml){
        	padding = '<span style="display: inline-block;margin-left: 40px;"></span>';
        }

        if( diff > 0 ){
            result.push(padding.repeat(lvl)+line.replace('\n',''));
            lvl += diff;
        }else if(diff < 0){
            lvl += diff;
            result.push(padding.repeat(lvl)+line.replace('\n',''));
            
        }else{
            result.push(padding.repeat(lvl)+line.replace('\n',''));
        }
    })
    if(useHtml){
    	return result.join('<br/>');
    }
    return result.join('\n');
}

woblocksControl.buildWkProgramSourceFor = function(aProgramString){
	return [ { name: 'main.wlk', content: aProgramString }];
}

woblocksControl.buildWkProgramSource = function(aProgramString){
	return woblocksControl.buildWkProgramSourceFor(woblocksControl.getExecutionString());
}

//IMAGES

woblocksControl.LoadGivenImagesInto = async function (imgsToLoad,listToFill){
	
	for(var i = 0; i < imgsToLoad.length; i++){
	  //console.log('LoadGivenImagesInto>>>>>>>> '+imgsToLoad[i].alias+' || '+imgsToLoad[i].url);
	  const response = await fetch(imgsToLoad[i].url)
	  const imageBlob = await response.blob()
	  imageBlob.name = imgsToLoad[i].alias;
	  listToFill.push(buildImage(imageBlob));
	  listToFill[listToFill.length - 1].path = imgsToLoad[i].url;   
	}
	
}

function buildImage(file) {
    const possiblePaths = [file.name]
    const url = URL.createObjectURL(file)
    return { possiblePaths, url }
}

//OBJ REPRESENTATION INFO 

woblocksControl.getObjectInfoOfIndex = function(anIndex){
	//if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return null;}

	var objName = this.definedObjectsInfo.objectNames[anIndex];
	return {name:objName , representationName:this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.representationName, isVisual:this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.isVisual }
}

woblocksControl.setObjectInfoOfIndex = function(anIndex, aRepName,isVisualValue){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return;}

	var objName = this.definedObjectsInfo.objectNames[anIndex];	
	this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.representationName = aRepName;
	this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.isVisual = isVisualValue;
}

//REMOVE OBJECT

woblocksControl.removeObjectOfIndex = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	
	var objToRemove = this.definedObjectsInfo.objectNames[anIndex]; 
	this.toRemove = [objToRemove];
	this.definedObjectsInfo.objectNames.splice(anIndex,1);
	delete this.definedObjectsInfo.objectsInfoMap[objToRemove];
	return true;
}

//SAVE PROJECT
woblocksControl.getProjetInfoAsJSON = function(){
	var result = {};
	result.mainSceneInfo = {xml:this.mainSceneInfo.xml};
	result.definedObjectsInfo = { objectNames:this.definedObjectsInfo.objectNames };
	result.definedObjectsInfo.objectsInfoMap = {};
	this.definedObjectsInfo.objectNames.map(function(aName){
		result.definedObjectsInfo.objectsInfoMap[aName] = {
			definedObjectsMappingInfo: 	woblocksControl.definedObjectsInfo.objectsInfoMap[aName].definedObjectsMappingInfo , 
			xml: 	woblocksControl.definedObjectsInfo.objectsInfoMap[aName].xml,
			code: 	woblocksControl.definedObjectsInfo.objectsInfoMap[aName].code
		};
	});
	result.config = this.config;
	return JSON.stringify(result);
}

woblocksControl.saveLocalStorage = function(){
	window.localStorage.setItem("mainSceneInfo", this.mainSceneInfo);
	window.localStorage.setItem("definedObjectsInfo", this.definedObjectsInfo);
	window.localStorage.setItem("config",  this.config);
	window.localStorage.setItem("haswoblocksStorage",true);
}

//LOAD PROJECT
woblocksControl.loadProjetInfoFromJSON = function(aJsonObjInfo){
	var result = JSON.parse(aJsonObjInfo);
	this.mainSceneInfo = {xml:result.mainSceneInfo.xml};
	this.definedObjectsInfo = { objectNames:result.definedObjectsInfo.objectNames, objectsInfoMap:{}};
	this.definedObjectsInfo.objectNames.map(function(aName){
		woblocksControl.definedObjectsInfo.objectsInfoMap[aName] = {definedObjectsMappingInfo:result.definedObjectsInfo.objectsInfoMap[aName].definedObjectsMappingInfo};
		woblocksControl.definedObjectsInfo.objectsInfoMap[aName].xml = result.definedObjectsInfo.objectsInfoMap[aName].xml;
		woblocksControl.definedObjectsInfo.objectsInfoMap[aName].code = result.definedObjectsInfo.objectsInfoMap[aName].code;
	});
	this.config = result.config;
}

woblocksControl.loadLocalStorage = function(){
	if(window.localStorage.getItem("haswoblocksStorage") ){
		this.mainSceneInfo = window.localStorage.getItem("mainSceneInfo");
		this.definedObjectsInfo = window.localStorage.getItem("definedObjectsInfo");
		this.config = window.localStorage.getItem("config");
	}
	return {objectsInfoMap:this.definedObjectsInfo.objectsInfoMap , configHeight: this.config.height, configWidth: this.config.width, configBackgroundImage:this.config.backgroundImage};
}

//SAVE CONFIG INFO
woblocksControl.saveConfigInfo = function(aWidth,aHeight, aBackgroundImageUrl){
	this.config.height = aHeight;
	this.config.width = aWidth;
	this.config.backgroundImage = aBackgroundImageUrl;
}

//MESSAGES AN OBJECT CAN RESPOND

woblocksControl.fillMessagesOfForWorkspace = function(){
	
	const objCreateBlocks = Blockly.getMainWorkspace().getAllBlocks().filter(function(aBlock){return (aBlock.type === 'objetc_create_wk')});
	objCreateBlocks.forEach(function(elem){
		const msgs = woblocksControl.messagesOf(elem);
		elem.setWarningText('MENSAJES:\n'+msgs.join('\n'));
	});
	

	const tokenBlocks = Blockly.getMainWorkspace().getAllBlocks().filter(function(aBlock){return woblocksControl.definedObjectsInfo.objectNames.includes(aBlock.type)});
	tokenBlocks.forEach(function(elem){
		var xmlStr = woblocksControl.definedObjectsInfo.objectsInfoMap[elem.type].xml;
		xmlStr = xmlStr.substring(5 , xmlStr.length - 6);
		const realBlock = Blockly.Xml.domToBlock( Blockly.Xml.textToDom(xmlStr),Blockly.getMainWorkspace());
		//const realBlock = Blockly.Xml.domToBlock(Blockly.Xml.textToDom('<block type="text" />'),Blockly.getMainWorkspace());
		const msgs = woblocksControl.messagesOf(realBlock);
		elem.setWarningText('MENSAJES:\n'+msgs.join('\n'));
		realBlock.dispose();
	});
}

woblocksControl.messagesOf = function(targetBlock){
    var methodCreateBlocks = Blockly.getMainWorkspace().getAllBlocks().filter(function(aBlock){return (aBlock.type === 'method_create_wk' && woblocksControl.hasAncestorWithId(aBlock , targetBlock.id))});
    return methodCreateBlocks.map(function(elem){return elem.getFieldValue('name')});
}    

woblocksControl.hasAncestorWithId = function(aBlock, anId){
  if(aBlock.previousConnection === null){return false;}
    var iterator = aBlock.previousConnection.targetBlock();
    for(var i  = 0; i < 5000; i++){
      if(iterator === null){
        return false;
      }

      if(iterator.id === anId){
        return true;
      }

      if(iterator.previousConnection === null){
        return false;
      }

      iterator = iterator.previousConnection.targetBlock();

    } 
    return false;
}

//OTHERS

woblocksControl.sanitizedeletedObjects = function(){
	Blockly.getMainWorkspace().getAllBlocks().filter(function(elem){return woblocksControl.toRemove.includes(elem.type)}).forEach(function(aBlock){
			aBlock.dispose();
	});
	woblocksControl.toRemove = [];
}

woblocksControl.sanitizeTextInputBlocks = function(){

	this.sanitizeBlocks('method_create_wk',['name']);
	this.sanitizeBlocks('objetc_property_wk',['name']);
	this.sanitizeBlocks('objetc_create_wk',['name']);
	this.sanitizeBlocks('param_wk',['paramName']);
	this.sanitizeBlocks('executor_wk',['method']); 
	this.sanitizeBlocks('execution_res_wk',['method']); 
	this.sanitizeBlocks('var_objetc_wk',['name']);
	this.sanitizeBlocks('tick_event_wk',['event_name']); 
	this.sanitizeBlocks('collission_wk',['target_name','collided_name']);  
	
}

woblocksControl.sanitizeBlocks = function(aType,aFieldList){
	var fieldBlock;
	Blockly.getMainWorkspace().getAllBlocks().filter(function(elem){return elem.type == aType}).forEach(function(aBlock){
		for(var i = 0; i < aFieldList.length;i++){
			fieldBlock = aBlock.getField(aFieldList[i]); 
			if(fieldBlock){fieldBlock.setValue( fieldBlock.value_.replace(/[^A-Za-z]+/g, '') );}
		}
	});
}

woblocksControl.closeToolbox = function(){
	Blockly.getMainWorkspace().getToolbox().clearSelection();
}

woblocksControl.objectNamedIsPresent = function(aName){
	return this.definedObjectsInfo.objectNames.includes(aName);
}

woblocksControl.unselectAllBlocks = function(){
	Blockly.getMainWorkspace().getAllBlocks().map(function(elem){elem.unselect();});
}

//STRING XML METHODS

woblocksControl.getMainToolboxXmlString =	function(){
	var xmlStr = `<xml>

	<category name="DEFINICIONES">
        
        <block type="objetc_create_wk">
        </block>

	    <block type="objetc_property_wk">
	        <value name="value">
	        </value>
	    </block>

	    <block type="method_create_wk">
	        <value name="params">
	            <block type="lists_create_with">
	            <mutation items="0"></mutation>
	            </block>
	        </value>
	        <statement name="instructions">
	        </statement>
	    </block>

	    <block type="param_wk" >
	    </block>
	
	    <block type="return_wk" >
	    </block>

	</category>

	<category name="OBJETOS Y MENSAJES">

	    <block type="executor_wk" >		
	        <value name="executor">
	        </value>
	        <statement name="params"><block type="executor_param_wk"><value name="param">
	        </value></block></statement>
	    </block>

	    <block type="execution_res_wk" >		
	        <value name="executor">
	        </value>
	        <statement name="params">
	            <block type="executor_param_wk">
	                <value name="param">
	                </value>
	            </block>
	        </statement>
	    </block>		

	    <block type="executor_param_wk">
	        <value name="param">
	        </value>
	    </block>

	    <block type="text_input_wk" >
	        <field name="inputName"></field>
	    </block>

		<block type="game_wk"></block>
	`;

	if(this.definedObjectsInfo.objectNames.length > 0){
		for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++ ){
			xmlStr +='			<block type="'+this.definedObjectsInfo.objectNames[i]+'"></block>';
			
		}
	}

	xmlStr += `
	</category>

	<category name="EVENTOS">

	    <block type="keyboard_event_wk">
	    </block>

	    <block type="tick_event_wk">
	    </block>

	    <block type="collission_wk">
	    </block>
	
	</category>	

	<category name="OTROS COMANDOS">
	
	    <block type="condition_wk" >
	    </block>

	    <block type="sprite_block_wk" >
	    </block>

	    <block type="var_objetc_wk">
	        <value name="value">
	        </value>
	    </block>

	    <block type="operation_block_wk" >
	    </block>

		<block type="string_literal_wk" >
		</block>

		<block type="number_literal_wk" >
		</block>

		<block type="boolean_literal_wk" >
		</block>		

	</category>	
	
	</xml>    
	`;

	return xmlStr;
}

woblocksControl.getObjectToolboxXmlStringForIndex =	function(anIndex){
	return woblocksControl.getObjectToolboxXmlString(this.definedObjectsInfo.objectNames[anIndex]);
}

woblocksControl.getObjectToolboxXmlString =	function(currentObject){
	var xmlStr = `<xml>

	<category name="DEFINICIONES">
	    
        <block type="objetc_create_wk">
        </block>

	    <block type="objetc_property_wk">
	        <value name="value">
	        </value>
	    </block>

	    <block type="method_create_wk">
	        <value name="params">
	            <block type="lists_create_with">
	            <mutation items="0"></mutation>
	            </block>
	        </value>
	        <statement name="instructions">
	        </statement>
	    </block>

	    <block type="param_wk" >
	    </block>

	    <block type="return_wk" >
	    </block>

	</category>

	<category name="OBJETOS Y MENSAJES">

	    <block type="executor_wk" >		
	        <value name="executor">
	        </value>
	        <statement name="params"><block type="executor_param_wk"><value name="param">
	        </value></block></statement>
	    </block>

	    <block type="execution_res_wk" >		
	        <value name="executor">
	        </value>
	        <statement name="params">
	            <block type="executor_param_wk">
	                <value name="param">
	                </value>
	            </block>
	        </statement>
	    </block>		

	    <block type="executor_param_wk">
	        <value name="param">
	        </value>
	    </block>

	    <block type="text_input_wk" >
	        <field name="inputName"></field>
	    </block>

	    <block type="game_wk"></block>
	    `;

	if(this.definedObjectsInfo.objectNames.length > 0){
		for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++ ){
			if(this.definedObjectsInfo.objectNames[i] != currentObject ){
				xmlStr +='			<block type="'+this.definedObjectsInfo.objectNames[i]+'"></block>';
			}
		}
	}

	xmlStr += `
	</category>

	<category name="EVENTOS">

	    <block type="keyboard_event_wk">
	    </block>

	    <block type="tick_event_wk">
	    </block>

	    <block type="collission_wk">
	    </block>
	
	</category>	

	<category name="OTROS COMANDOS">
	
	    <block type="condition_wk" >
	    </block>

	    <block type="sprite_block_wk" >
	    </block>

	    <block type="var_objetc_wk">
	        <value name="value">
	        </value>
	    </block>

	    <block type="operation_block_wk" >
	    </block>
	    
		<block type="string_literal_wk" >
		</block>
		
		<block type="number_literal_wk" >
		</block>
		
		<block type="boolean_literal_wk" >
		</block>	    

	</category>	
	
	</xml>
	`;

	return xmlStr;
}

woblocksControl.getDefaultWKObjectXmlNamed = function(proposedName){
	var defaultXml = '';
	defaultXml +='	<block deletable="false" type="objetc_create_wk" >';
	defaultXml +='		<field name="name">'+proposedName+'</field>';
	defaultXml +='		<statement name="properties">';
	defaultXml +='			<block type="objetc_property_wk">';
	defaultXml +='				<value name="value">';
	defaultXml +='					<block type="text_input_wk">';
	defaultXml +='						<field name="inputName">unValorDePropiedad</field>';
	defaultXml +='					</block>';
	defaultXml +='				</value>';
	defaultXml +='			</block>';
	defaultXml +='		</statement>';
	defaultXml +='	</block>';
		
	return defaultXml;
}

woblocksControl.getDefaultWKObjectXmlWithNameAndImage = function(aName, anImage){
	var xmlStr = '';
	xmlStr += '		<block type="objetc_create_wk">\n';
	xmlStr += '			<field name="name">'+aName+'</field>\n';
	xmlStr += '			<statement name="properties">\n';
	//xmlStr += '				<block type="objetc_property_wk">\n';
	//xmlStr += '					<field name="name">name</field>\n';
	//xmlStr += '					<value name="value">\n';
	//xmlStr += '						<block type="text">\n';
	//xmlStr += '							<field name="TEXT">"'+aName+'"</field>\n';
	//xmlStr += '						</block>\n';
	//xmlStr += '					</value>\n';
	if(anImage){
		//xmlStr += '					<next>\n';
		xmlStr += '						<block type="method_create_wk">\n';
		xmlStr += '							<field name="name">image</field>\n';
		xmlStr += '							<value name="params">\n';
		xmlStr += '								<block type="lists_create_with" ><mutation items="0"></mutation></block>\n';
		xmlStr += '							</value>\n';
		xmlStr += '							<statement name="instructions">\n';
		xmlStr += '								<block type="return_wk">\n';
		xmlStr += '									<value name="value">\n';
		xmlStr += '										<block type="sprite_block_wk">\n';
		xmlStr += '											<field name="Sprite">'+anImage+'</field>\n';
		xmlStr += '										</block>\n';
		xmlStr += '									</value>\n';
		xmlStr += '								</block>\n';
		xmlStr += '							</statement>\n';
		xmlStr += '							<next>\n';
		xmlStr += '								<block type="method_create_wk">\n';
		xmlStr += '									<field name="name">position</field>\n';
		xmlStr += '									<value name="params">\n';
		xmlStr += '										<block type="lists_create_with" ><mutation items="0"></mutation></block>\n';
		xmlStr += '									</value>\n';
		xmlStr += '									<statement name="instructions">\n';
		xmlStr += '										<block type="return_wk">\n';
		xmlStr += '											<value name="value">\n';
		xmlStr += '												<block type="execution_res_wk">\n';
		xmlStr += '													<field name="method">at</field>\n';
		xmlStr += '													<value name="executor">\n';
		xmlStr += '														<block type="game_wk"></block>\n';
		xmlStr += '													</value>\n';
		xmlStr += '													<statement name="params">\n';
		xmlStr += '														<block type="executor_param_wk">\n';
		xmlStr += '															<value name="param">\n';
		xmlStr += '																<block type="text_input_wk"><field name="inputName">0</field></block>\n';
		xmlStr += '															</value>\n';
		xmlStr += '															<next>\n';
		xmlStr += '																<block type="executor_param_wk">\n';
		xmlStr += '																	<value name="param">\n';
		xmlStr += '																		<block type="text_input_wk"><field name="inputName">0</field></block>\n';
		xmlStr += '																	</value>\n';
		xmlStr += '																</block>\n';
		xmlStr += '															</next>\n';
		xmlStr += '														</block>\n';
		xmlStr += '													</statement>\n';
		xmlStr += '												</block>\n';
		xmlStr += '											</value>\n';
		xmlStr += '										</block>\n';
		xmlStr += '									</statement>\n';
		xmlStr += '								</block>\n';
		xmlStr += '							</next>\n';
		xmlStr += '						</block>\n';
		//xmlStr += '					</next>\n';
	}
	//xmlStr += '				</block>\n';
	xmlStr += '			</statement>\n';
	xmlStr += '		</block>\n';
	return xmlStr;
}



woblocksControl.init()

export default woblocksControl;