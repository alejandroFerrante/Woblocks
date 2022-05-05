//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================

//ACTION START
//This Block serves as the starting point of an object or method definition. All other blocks are designed to not generate code if this block 
//is not on top of the top of the block heriarchy. 
Blockly.Blocks['action_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/play.png", 20, 20, "|>"));
    this.setInputsInline(false);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }, isLinkedToActionStart : function(aBlock){
    if(aBlock.previousConnection == null){return false;}
    var iterator = aBlock.previousConnection.targetBlock();
    for(var i  = 0; i < 5000; i++){
      if(iterator == null){
        return false;
      }

      if(iterator.type == 'action_start'){
        return true;
      }

      if(iterator.previousConnection == null){
        return false;
      }

      iterator = iterator.previousConnection.targetBlock();

    } 
    return false;
  }
};

Blockly.JavaScript['action_start'] = function(block) { 
	if(block.nextConnection.targetBlock() != null){
		return Blockly.JavaScript[block.nextConnection.targetBlock().type](block.nextConnection.targetBlock());
	}else{
		return '';
	} 
};
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================

//OBJECT DEFINITION
//This block is used to create an object.It takes a text block for the nme and properties definition statements.
Blockly.Blocks['objetc_create'] = {
  init: function() {
    //this.setMutator(new Blockly.Mutator(""));
    this.setInputsInline(true);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/object.png", 45, 45, "*"));
    this.appendValueInput("objName")
        .setCheck("String")
    this.appendStatementInput('properties')
    .appendField('')
    .setCheck("objetc_property");
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setWarningText('MENSAJES:');
  },doActionJS : function(self, paramsMap){
    if(! Blockly.Blocks['action_start'].isLinkedToActionStart(self)){return '';}

    var value_objname = paramsMap['objName'];
    var value_properties = paramsMap['properties']; 
    var code = 'var ';
    if(value_objname != undefined && value_objname != null && value_objname != ''){
      code += value_objname.replaceAll("'","");
    }else{
      code += ' __objetc_create___objName__ ';
    } 
    code += ' = { name:';
    if(value_objname != undefined && value_objname != null && value_objname != ''){
      code += value_objname;
    }else{
      code += ' __objetc_create___objName__ ';
    }

    if(value_properties != undefined && value_properties != null){
      code += value_properties;
    }else{
      code += ' __object_create___value_properties__ ';
    }
    
    code += ' };\n';
    
    return code;
  },
  updateShape_: function(pxchecked) {
  	alert('updateShape_');
  },
  getMetaInfo:function(self){
  	var value_objname = Blockly.JavaScript.valueToCode(self, 'objName', Blockly.JavaScript.ORDER_ATOMIC);

  	if(value_objname == undefined || value_objname == ''){
      value_objname = null; 
    }
  	
  	return {obj:value_objname.replaceAll('\'',''),method:null};	
  },getMessagesOf: function(block,existingMethods){
  		var value_properties = Blockly.JavaScript.statementToCode(block, 'properties');
  		var result = [];
  		var lst = value_properties.split(',');
  		
  		for(var i = 0; i < lst.length;i++){
		    if(lst[i].includes(':')){
				if( lst[i].split(':')[1].replaceAll(' ','').startsWith('function(') ){
					result.push(lst[i].split(':')[0].replaceAll(' ',''));
				}
				if( existingMethods.includes(lst[i].split(':')[1].replaceAll(' ',''))){
					result.push(lst[i].split(':')[0].replaceAll(' ',''));
				}        
		    }
		}
		return result;
  },nameWasSet:function(block){
  	var value_objname = Blockly.JavaScript.valueToCode(block, 'objName', Blockly.JavaScript.ORDER_ATOMIC);
  	return 	(value_objname != undefined && value_objname != null && value_objname != '');
  }/*,mutationToDom : function (workspace) {
	var container = document.createElement('mutation');
	return container;
  },domToMutation : function (xmlElement) {
		//this.updateShape_();
  },decompose : function (workspace) {
  	//var xmlStr = messagesAsTextListXml( getAllMessagesOf( this ) );
	//var xmlObj =  Blockly.Xml.textToDom( xmlStr , workspace );
  	//return Blockly.Xml.domToWorkspace( xmlObj , workspace);
  
  	var innerXml = messagesAsTextListXml( getAllMessagesOf( this ) );
    var newBlockId = Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(innerXml), workspace)[0];
    workspace.getBlockById(newBlockId).initSvg();
    return workspace.getBlockById(newBlockId);

  }
  */
};

Blockly.JavaScript['objetc_create'] = function(block) {
  var value_objname = Blockly.JavaScript.valueToCode(block, 'objName', Blockly.JavaScript.ORDER_ATOMIC);
  var value_properties = Blockly.JavaScript.statementToCode(block, 'properties');
  var code = Blockly.Blocks['objetc_create'].doActionJS(block,{'objName':value_objname , 'properties':value_properties});
  return code;
};


//OBJECT PROPERTY
//used for defining a property. First block must be a text block and the second one can be any value
Blockly.Blocks['objetc_property'] = {
  init: function() {
    this.appendValueInput("name")
        .setCheck("String");
    this.appendValueInput("value")
        .appendField(":");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
  },doActionJS:function(self, paramsMap){
    if(! Blockly.Blocks['action_start'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_value = paramsMap['value'];

    var code = ' , ';
    if(value_name != undefined && value_name != null && value_name != ''){
      code += value_name.replaceAll("'","");
    }else{
      code += ' __objetc_property___name__ ';
    }

    code += ':';
    
    if(value_value != undefined && value_value != null && value_value != ''){
      code += value_value.replaceAll("'","")+' ';
    }else{
      code += ' __objetc_property___value__ '
    }

    return code;
  }
};

Blockly.JavaScript['objetc_property'] = function(aBlock) {
  var value_name = Blockly.JavaScript.valueToCode(aBlock, 'name', Blockly.JavaScript.ORDER_ATOMIC);
  if(value_name != undefined && value_name != null){value_name = removeInitialNumbers(value_name);}
  var value_value = Blockly.JavaScript.valueToCode(aBlock, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  var code = Blockly.Blocks['objetc_property'].doActionJS(aBlock,{'name':value_name , 'value':value_value});
  return code;
};
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================

//METHOD CREATE
//takes a string block for the method name and a list of parameter names (string list block) and instructions to create a method
Blockly.Blocks['method_create'] = {
  init: function() {
    this.setInputsInline(true);
    this.appendValueInput("name")
    	.appendField(new Blockly.FieldImage("icons/action.png", 45, 45, "*"))
        .setCheck("String")
        //.appendField("METHOD");
    this.appendValueInput("params")
        .setCheck("Array")
        .appendField("PARAMS:");
    this.appendDummyInput()
        .appendField("INSTRUCTIONS");
    this.appendStatementInput('instructions')
    .appendField('');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
  },doActionJS:function(self, paramsMap){
    if(! Blockly.Blocks['action_start'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_params = paramsMap['params'];
    var value_instructions = paramsMap['instructions'];
    var code = 'var ';
    if(value_name != undefined && value_name != null && value_name != ''){
      code += value_name.replaceAll("'",""); 
    }else{
      code += ' __method_create___name__ ';
    }
    code += ' = function(';
    if(value_params != undefined && value_params != null && value_params != ''){
      code += (''+value_params).replaceAll(']','').replaceAll('[','').replaceAll("'",""); 
    }else{
      code += ' __method_create___params__ ';
    }
    code += '){\n';

    if(value_instructions != undefined && value_instructions != null && value_instructions != ''){
      code += value_instructions.replaceAll("'",""); 
    }else{
      code += ' __method_create___instructions__ ';
    }

    code += '};\n';

    return code;  
  },
  getMetaInfo:function(self){
  	var value_name = Blockly.JavaScript.valueToCode(self, 'name', Blockly.JavaScript.ORDER_ATOMIC);
  	var value_params = Blockly.JavaScript.valueToCode(self, 'params', Blockly.JavaScript.ORDER_ATOMIC);

  	if(value_name == undefined || value_name == ''){
  		value_name = null;
  	}

  	var paramsAmount = null;
  	if(value_params != undefined && value_params != null && value_params != ''){
      paramsAmount = value_params.split(',').length; 
    }
  	
  	return {obj:null,method:{name:value_name.replaceAll('\'',''),paramsAmount:paramsAmount}};
  }

};

Blockly.JavaScript['method_create'] = function(block) {
	var value_name = Blockly.JavaScript.valueToCode(block, 'name', Blockly.JavaScript.ORDER_ATOMIC);
	var value_params = Blockly.JavaScript.valueToCode(block, 'params', Blockly.JavaScript.ORDER_ATOMIC);
	if(value_params != undefined && value_params != null ){
		var originalList = eval(value_params);
		var newList = [];
		for(var i = 0; i < originalList.length; i++){
			newList.push(removeInitialNumbers(originalList[i]));
		}
		value_params = '['+newList+']';

	}
	var value_instructions = Blockly.JavaScript.statementToCode(block, 'instructions');
	var code = Blockly.Blocks['method_create'].doActionJS(block,{'name':value_name , 'params':value_params , 'instructions':value_instructions });
	return code;
		
};


//METHOD INSTRUCTION
//a simple block that describes an instruction.It automatically appends the ; at the end
Blockly.Blocks['method_instruction'] = {
  init: function() {
    this.appendValueInput("instruction")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
  },doActionJS:function(self, paramsMap){
      if(! Blockly.Blocks['action_start'].isLinkedToActionStart(self)){return '';}

      var value_instruction = paramsMap['instruction'];
      var code = '';
      if(value_instruction != undefined && value_instruction != null && value_instruction != ''){
        code += value_instruction.replaceAll("'","");
      }else{
        code += ' __method_instruction___instruction__ ';
      }
      code +=';\n';

      return code;
  }};

  Blockly.JavaScript['method_instruction'] = function(block) {
    var value_instruction = Blockly.JavaScript.valueToCode(block, 'instruction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = Blockly.Blocks['method_instruction'].doActionJS(block,{'instruction':value_instruction});
    return code;
  };

//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================

Blockly.Blocks['executor'] = {
  init: function() {
  	this.appendDummyInput().appendField(new Blockly.FieldImage("icons/Pointer.png", 30, 30, ""));
    this.appendValueInput("executor")
        .setCheck(null)
        .appendField("");
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/Arrow.png", 30, 30, ""));
    this.appendValueInput("method")
        .setCheck(null)
        .appendField("");
    this.appendStatementInput('params')
    .appendField('');    
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
    //this.setColour('#d69833');
    this.setColour('#751072');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },doActionJS:function(self, paramsMap,metaInfo){
  	  if(! Blockly.Blocks['action_start'].isLinkedToActionStart(self)){return '';}

  	  var value_executor = paramsMap['executor'];
  	  var value_method = paramsMap['method'];
	  var value_params = paramsMap['params'];
	  var messages;
	  //check if obj exists?
	  //check if has method?
	  //check if params coincide?
	  if(value_executor == undefined || value_executor == null || value_executor == ''){
	  	//empty executor
	  	alert('No se ha provisto un ejecutor');
	  	sceneErrorLog = 'No se ha provisto un ejecutor';
	  	return false;
	  }
	  if(value_method == undefined || value_method == null || value_method == ''){
	  	//empty method
	  	if(sceneAlertErrors){alert('No se ha provisto un mensaje a enviar');}
	  	sceneErrorLog = 'No se ha provisto un mensaje a enviar';
	  	return false;
	  }
	  if(value_params == undefined || value_params == null){
	  	//empty params
	  	if(sceneAlertErrors){alert('No se han provisto parametros de ejecucion');}
	  	sceneErrorLog = 'No se han provisto parametros de ejecucion';
	  	return false;
	  }
	  if(!metaInfo.objects.includes(value_executor)){
	  	//inexisting executor
	  	if(sceneAlertErrors){alert('El ejecutor \''+value_executor+'\' es inexistente');}
	  	sceneErrorLog = 'El ejecutor \''+value_executor+'\' es inexistente';
	  	return false;
	  }

	  messages = getMessagesOf(value_executor); 
	  if(! messages.includes(value_method) ){
	  	//inexisting method
	  	if(sceneAlertErrors){alert('El ejecutor \''+value_executor+'\' no sabe responder el mensaje \''+value_method+'\'');}
	  	sceneErrorLog = 'El ejecutor \''+value_executor+'\' no sabe responder el mensaje \''+value_method+'\'';
	  	return false;
	  }

	  //if((value_params == '' && metaInfo.methods[value_method] != 0) || (value_params.split(',').length !=  metaInfo.methods[value_method]) ){
	  //	//wrong amount of params
	  //	if(sceneAlertErrors){alert('Los parametros provistos para el mensaje \''+value_method+'\' son incorrectos');}
	  //	sceneErrorLog = 'Los parametros provistos para el mensaje \''+value_method+'\' son incorrectos';
	  //	return false;	
	  //}

	  return value_executor+'.'+value_method+'('+value_params+')';
  }
};

Blockly.JavaScript['executor'] = function(block,metaInfo) {
	var value_executor = Blockly.JavaScript.valueToCode(block, 'executor', Blockly.JavaScript.ORDER_ATOMIC).replaceAll('\'','');
	var value_method = Blockly.JavaScript.valueToCode(block, 'method', Blockly.JavaScript.ORDER_ATOMIC).replaceAll('\'','');
	var value_params = Blockly.JavaScript.statementToCode(block, 'params');
	return Blockly.Blocks['executor'].doActionJS(block,{'executor':value_executor,'method':value_method,'params':value_params},metaInfo);
}


Blockly.Blocks['executor_param'] = {
  init: function() {
    this.appendValueInput("param")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setColour('#cf9c11');
    //this.setColour('#7d1e7b');
  },doActionJS:function(self, paramsMap){
  	var value_instruction = paramsMap['param'];
    var code = '';
	//if(self.getPreviousBlock().type != 'executor_param'){
	//	code += '[';
	//}
     code += value_instruction.replaceAll('\'','');
	if(self.getNextBlock() == undefined || self.getNextBlock() == null || self.getNextBlock().type != 'executor_param'){
		//code += ']';
	}else{
		code += ',';
	}
    return code;
  }
 };

  Blockly.JavaScript['executor_param'] = function(block) {
    var value_instruction = Blockly.JavaScript.valueToCode(block, 'param', Blockly.JavaScript.ORDER_ATOMIC);
    return Blockly.Blocks['executor_param'].doActionJS(block,{'param':value_instruction});
  };



//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//Inherit base from Javascript, everything needed will be overiden
Blockly.Wollok = Blockly.JavaScript

//ACTION START
//This Block serves as the starting point of an object or method definition. All other blocks are designed to not generate code if this block 
//is not on top of the top of the block heriarchy. 
Blockly.Blocks['action_start_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/play.png", 20, 20, "|>"));
    this.setInputsInline(false);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }, isLinkedToActionStart : function(aBlock){
    if(aBlock.previousConnection == null){return false;}
    var iterator = aBlock.previousConnection.targetBlock();
    for(var i  = 0; i < 5000; i++){
      if(iterator == null){
        return false;
      }

      if(iterator.type == 'action_start_wk'){
        return true;
      }

      if(iterator.previousConnection == null){
        return false;
      }

      iterator = iterator.previousConnection.targetBlock();

    } 
    return false;
  }
};

Blockly.Wollok['action_start_wk'] = function(block) { 
  if(block.nextConnection.targetBlock() != null){
    return Blockly.Wollok[block.nextConnection.targetBlock().type](block.nextConnection.targetBlock());
  }else{
    return '';
  } 
};

//OBJECT DEFINITION
//This block is used to create an object.It takes a text block for the nme and properties definition statements.
Blockly.Blocks['objetc_create_wk'] = {
  init: function() {
    //this.setMutator(new Blockly.Mutator(""));
    this.setInputsInline(true);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/wollokBW.png", 40, 40, "*"));
    this.appendValueInput("objName")
        .setCheck("String")
    this.appendStatementInput('properties')
    .appendField('')
    .setCheck("objetc_property");
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setWarningText('MENSAJES:');
  },doActionWK : function(self, paramsMap){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_objname = paramsMap['objName'];
    var value_properties = paramsMap['properties']; 
    var code = 'object ';
    if(value_objname != undefined && value_objname != null && value_objname != ''){
      code += value_objname.replaceAll("'","");
    }else{
      code += ' __objetc_create___objName__ ';
    } 
    code += ' { \n var name = ';
    if(value_objname != undefined && value_objname != null && value_objname != ''){
      code += value_objname;
    }else{
      code += ' __objetc_create___objName__ ';
    }

    if(value_properties != undefined && value_properties != null){
      code += value_properties;
    }else{
      code += ' __object_create___value_properties__ ';
    }
    
    code += ' \n}';
    
    return code;
  },messagesOf : function(self){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return [];}

    var methodCreateBlocks = workspace.getAllBlocks().filter(function(aBlock){return aBlock.type == 'method_create_wk'});
    var methods = [];
    for(var i = 0; i < methodCreateBlocks.length; i++){
      if(hasAncestorWithId(methodCreateBlocks[i] , self.id)){
        methods.push( Blockly.Wollok.valueToCode(methodCreateBlocks[i], 'name', Blockly.Wollok.ORDER_ATOMIC).replaceAll('\'','') );
      }
    }
    

    return methods;
  }
};

Blockly.Wollok['objetc_create_wk'] = function(block) {
  var value_objname = Blockly.Wollok.valueToCode(block, 'objName', Blockly.Wollok.ORDER_ATOMIC);
  var value_properties = Blockly.Wollok.statementToCode(block, 'properties');
  var code = Blockly.Blocks['objetc_create_wk'].doActionWK(block,{'objName':value_objname , 'properties':value_properties});
  return code;
};

//OBJECT PROPERTY
//used for defining a property. First block must be a text block and the second one can be any value
Blockly.Blocks['objetc_property_wk'] = {
  init: function() {
    this.appendValueInput("name")
        .setCheck("String");
    this.appendValueInput("value")
        .appendField(new Blockly.FieldImage("icons/Arrow.png", 30, 30, ""));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  },doActionWK:function(self, paramsMap){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_value = paramsMap['value'];

    var code = '\n var ';
    if(value_name != undefined && value_name != null && value_name != ''){
      code += value_name.replaceAll("'","");
    }else{
      code += ' __objetc_property___name__ ';
    }

    code += ' = ';
    
    if(value_value != undefined && value_value != null && value_value != ''){
      code += value_value.replaceAll("'","")+' ';
    }else{
      code += ' __objetc_property___value__ '
    }

    return code;
  }
};

Blockly.Wollok['objetc_property_wk'] = function(aBlock) {
  var value_name = Blockly.Wollok.valueToCode(aBlock, 'name', Blockly.Wollok.ORDER_ATOMIC);
  if(value_name != undefined && value_name != null){value_name = removeInitialNumbers(value_name);}
  var value_value = Blockly.Wollok.valueToCode(aBlock, 'value', Blockly.Wollok.ORDER_ATOMIC);
  var code = Blockly.Blocks['objetc_property_wk'].doActionWK(aBlock,{'name':value_name , 'value':value_value});
  return code;
};

//OBJECT METHOD
//used for defining a method. 
Blockly.Blocks['method_create_wk'] = {
  init: function() {
    this.appendValueInput("name")
      .appendField(new Blockly.FieldImage("icons/action.png", 35, 35, "*"))
        .setCheck("String");
        //.appendField("METHOD");
    this.appendValueInput("params")
        .setCheck("Array");
        //.appendField("(");
    /*this.appendDummyInput()
        .appendField(")");*/
    this.appendStatementInput('instructions')
    .appendField('');
    this.setInputsInline(false);
    this.setInputsInline(true);
    this.setTooltip('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },doActionWK:function(self, paramsMap){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_params = paramsMap['params'];
    var value_instructions = paramsMap['instructions'];
    var code = '\nmethod ';
    if(value_name != undefined && value_name != null && value_name != ''){
      code += value_name.replaceAll("'",""); 
    }else{
      code += ' __method_create___name__ ';
    }
    code += '(';
    if(value_params != undefined && value_params != null && value_params != ''){
      code += (''+value_params).replaceAll(']','').replaceAll('[','').replaceAll("'",""); 
    }else{
      code += ' __method_create___params__ ';
    }
    code += '){\n';

    if(value_instructions != undefined && value_instructions != null /*&& value_instructions != ''*/){
      code += value_instructions.replaceAll("'",""); 
    }else{
      code += ' __method_create___instructions__ ';
    }

    code += '}';

    return code;  
  }
};
Blockly.Wollok['method_create_wk'] = function(block) {
  var value_name = Blockly.Wollok.valueToCode(block, 'name', Blockly.Wollok.ORDER_ATOMIC);
  var value_params = Blockly.Wollok.valueToCode(block, 'params', Blockly.Wollok.ORDER_ATOMIC);
  if(value_params != undefined && value_params != null && value_params != '' ){
    var originalList = eval(value_params);
    var newList = [];
    for(var i = 0; i < originalList.length; i++){
      newList.push(removeInitialNumbers(originalList[i]));
    }
    value_params = '['+newList+']';

  }
  var value_instructions = Blockly.Wollok.statementToCode(block, 'instructions');
  var code = Blockly.Blocks['method_create_wk'].doActionWK(block,{'name':value_name , 'params':value_params , 'instructions':value_instructions });
  return code;
    
};

//INSTRUCTION
//a simple block that describes an instruction.can be used in an object or in a program
Blockly.Blocks['instruction_wk'] = {
  init: function() {
    this.appendValueInput("instruction")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
  },doActionWK:function(self, paramsMap){
      if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

      var value_instruction = paramsMap['instruction'];
      var code = '';
      if(value_instruction != undefined && value_instruction != null && value_instruction != ''){
        code += value_instruction.replaceAll("'","");
      }else{
        code += ' __method_instruction___instruction__ ';
      }
      code +='\n';

      return code;
  }};

  Blockly.Wollok['instruction_wk'] = function(block) {
    var value_instruction = Blockly.Wollok.valueToCode(block, 'instruction', Blockly.Wollok.ORDER_ATOMIC);
    var code = Blockly.Blocks['instruction_wk'].doActionWK(block,{'instruction':value_instruction});
    return code;
  };

Blockly.Blocks['executor_wk'] = {
  init: function() {
    /*this.appendDummyInput().appendField(new Blockly.FieldImage("icons/Pointer.png", 30, 30, ""));*/
    this.appendValueInput("executor")
        .setCheck(null)
        .appendField("");
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("icons/mSend.png", 35, 35, ""));
    this.appendValueInput("method")
        .setCheck(null)
        .appendField("");
    this.appendStatementInput('params')
    .appendField('');    
    this.setTooltip('');
    this.setColour('#ab2ba7');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },doActionWK:function(self, paramsMap){
      if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

      var value_executor = paramsMap['executor'];
      var value_method = paramsMap['method'];
      var value_params = paramsMap['params'];
      var messages;
      var existingObjects;
      var executorBlock = null;
      //check if obj exists?
      //check if has method?
      //check if params coincide?
      if(value_executor == undefined || value_executor == null || value_executor == ''){
        //empty executor
        alert('No se ha provisto un ejecutor');
        sceneErrorLog = 'No se ha provisto un ejecutor';
        return false;
      }
      if(value_method == undefined || value_method == null || value_method == ''){
        //empty method
        if(sceneAlertErrors){alert('No se ha provisto un mensaje a enviar');}
        sceneErrorLog = 'No se ha provisto un mensaje a enviar';
        return false;
      }
      if(value_params == undefined || value_params == null){
        //empty params
        if(sceneAlertErrors){alert('No se han provisto parametros de ejecucion');}
        sceneErrorLog = 'No se han provisto parametros de ejecucion';
        return false;
      }

      existingObjects = definedObjectNames.concat( workspace.getAllBlocks().filter(function(aBlock){return aBlock.type == 'objetc_create_wk' && aBlock.previousConnection != null && aBlock.previousConnection.targetBlock().type == 'action_start_wk' }).map(function(x) {return Blockly.Wollok.valueToCode(x, 'objName', Blockly.Wollok.ORDER_ATOMIC).replaceAll('\'','');}) );
      if(!existingObjects.includes(value_executor)){
        //inexisting executor
        if(sceneAlertErrors){alert('Aviso: El ejecutor \''+value_executor+'\' no se ha definido en este ambiente');}
        sceneErrorLog = 'Aviso: El ejecutor \''+value_executor+'\' no se ha definido en este ambiente';
        //return false;
      }

      var objectBlocks = workspace.getAllBlocks().filter(function(aBlock){return aBlock.type == 'objetc_create_wk' && aBlock.previousConnection != null && aBlock.previousConnection.targetBlock().type == 'action_start_wk'});
      for(var i = 0; i < objectBlocks.length; i++){
          if(Blockly.Wollok.valueToCode(objectBlocks[i], 'objName', Blockly.Wollok.ORDER_ATOMIC).replaceAll('\'','') == value_executor){
            executorBlock = objectBlocks[i];
            break;    
          }
      }

      if(existingObjects.includes(value_executor)){
        messages = [];
        if(executorBlock != null){ messages = Blockly.Blocks['objetc_create_wk'].messagesOf(executorBlock);} 
        if(!messages.includes(value_method) ){
          //inexisting method
          if(sceneAlertErrors){alert('El ejecutor \''+value_executor+'\' no sabe responder el mensaje \''+value_method+'\'');}
          sceneErrorLog = 'El ejecutor \''+value_executor+'\' no sabe responder el mensaje \''+value_method+'\'';
          return false;
        }
      }

      return value_executor+'.'+value_method+'('+value_params+')';
    }
};

Blockly.Wollok['executor_wk'] = function(block) {
  var value_executor = Blockly.Wollok.valueToCode(block, 'executor', Blockly.Wollok.ORDER_ATOMIC).replaceAll('\'','');
  var value_method = Blockly.Wollok.valueToCode(block, 'method', Blockly.Wollok.ORDER_ATOMIC).replaceAll('\'','');
  var value_params = Blockly.Wollok.statementToCode(block, 'params');
  return Blockly.Blocks['executor_wk'].doActionWK(block,{'executor':value_executor,'method':value_method,'params':value_params});
}


Blockly.Blocks['executor_param_wk'] = {
  init: function() {
    this.appendValueInput("param")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setPreviousStatement(true, null);
    this.setTooltip('');
    this.setColour('#cf9c11');
    
  },doActionWK:function(self, paramsMap){
    var value_instruction = paramsMap['param'];
    var code = '';
  
     code += value_instruction.replaceAll('\'','');
    if(self.getNextBlock() == undefined || self.getNextBlock() == null || self.getNextBlock().type != 'executor_param'){
      
    }else{
      code += ',';
    }
      return code;
    }
 };

  Blockly.Wollok['executor_param_wk'] = function(block) {
    var value_instruction = Blockly.Wollok.valueToCode(block, 'param', Blockly.Wollok.ORDER_ATOMIC);
    return Blockly.Blocks['executor_param_wk'].doActionWK(block,{'param':value_instruction});
  };


//VAR DECLARATION
//used for defining a variabe within an execution.
Blockly.Blocks['var_objetc_wk'] = {
  init: function() {
    this.appendValueInput("name")
        .setCheck("String");
    this.appendValueInput("value")
        .appendField(new Blockly.FieldImage("icons/Arrow.png", 30, 30, ""));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setColour('#a1c932');
  },doActionWK:function(self, paramsMap){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_value = paramsMap['value'];

    var code = '\n var ';
    if(value_name != undefined && value_name != null && value_name != ''){
      code += value_name.replaceAll("'","");
    }else{
      code += ' __objetc_property___name__ ';
    }

    code += ' = ';
    
    if(value_value != undefined && value_value != null && value_value != ''){
      code += value_value.replaceAll("'","")+' ';
    }else{
      code += ' __objetc_property___value__ '
    }

    return code;
  }
};

Blockly.Wollok['var_objetc_wk'] = function(aBlock) {
  var value_name = Blockly.Wollok.valueToCode(aBlock, 'name', Blockly.Wollok.ORDER_ATOMIC);
  if(value_name != undefined && value_name != null){value_name = removeInitialNumbers(value_name);}
  var value_value = Blockly.Wollok.valueToCode(aBlock, 'value', Blockly.Wollok.ORDER_ATOMIC);
  var code = Blockly.Blocks['var_objetc_wk'].doActionWK(aBlock,{'name':value_name , 'value':value_value});
  return code;
};

//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================







function hasAncestorWithId(aBlock, anId){
  if(aBlock.previousConnection == null){return false;}
    var iterator = aBlock.previousConnection.targetBlock();
    for(var i  = 0; i < 5000; i++){
      if(iterator == null){
        return false;
      }

      if(iterator.id == anId){
        return true;
      }

      if(iterator.previousConnection == null){
        return false;
      }

      iterator = iterator.previousConnection.targetBlock();

    } 
    return false;
}

function getMessagesOf(aBlockName){
	var iterateAll = true;

	var objs = getAllParentlessObjects();
	var index = 0;
	var found = false;
	var result = null;
	var existingMethods = [];
		
	//find object
	while(index < objs.length){
		if(objs[index].type == 'action_start' && objs[index].getNextBlock() != null && objs[index].getNextBlock().type == 'objetc_create'){
			if( Blockly.JavaScript.valueToCode(objs[index].getNextBlock(), 'objName', Blockly.JavaScript.ORDER_ATOMIC).replaceAll('\'','') == aBlockName){
				found = true;
				break;
			}
		}
		if(objs[index].type == aBlockName && definedObjectNames.includes(aBlockName)){
			found = true;
			break;
		}
		index++;
	}

	if(found){
		//collect exiting methods
		for(var j = 0; ( (iterateAll && j < objs.length ) || (j < index)); j++){
			if(j != index){
				if(objs[j].type == 'action_start' && objs[j].getNextBlock() != null && objs[j].getNextBlock().type == 'method_create'){
					existingMethods.push( Blockly.JavaScript.valueToCode(objs[j].getNextBlock(), 'name', Blockly.JavaScript.ORDER_ATOMIC).replaceAll('\'','') );
				}else if(definedBehaviourNames.includes(objs[j].type)){
					existingMethods.push(objs[j].type);
				}
			}
		}

		if(objs[index].type == 'action_start'){
			result = Blockly.Blocks['objetc_create'].getMessagesOf(objs[index].getNextBlock(),existingMethods);
		}else if(definedObjectNames.includes(aBlockName)){
			var decomposed = objs[index].decompose(Blockly.getMainWorkspace());
			result = Blockly.Blocks['objetc_create'].getMessagesOf(decomposed.getNextBlock(),existingMethods);
			decomposed.dispose();
		}

	}

	
	return result;
}


function getAllMessagesOf(aBlock){
	var iterateAll = true;
	var metainfo;
	var existingMethods;
	var objs;
	var targetBlock = null;
	var messages;

	if(aBlock.type == 'objetc_create'){
		targetBlock = aBlock;
	}else if(definedObjectNames.includes(aBlock.name)){
		targetBlock = Blockly.Blocks[aBlock.type].getDecompose(workspace);
	}

	if(targetBlock != null){
		
		existingMethods = [];

		//GET EXISTING METHODS
		objs = getAllParentlessObjects();
		for(var i = 0; i < objs.length; i++){
			if(objs[i].type == 'action_start' && objs[i].getNextBlock() != undefined && objs[i].getNextBlock().id == targetBlock.id){
				for(var j = 0; ( (iterateAll && j < objs.length) || j < i); j++){
					if( objs[j].type == 'action_start' && objs[j].getNextBlock() != undefined && objs[j].getNextBlock().type == 'method_create'){
						metainfo = Blockly.Blocks['method_create'].getMetaInfo( objs[j].getNextBlock() );
						existingMethods.push( metainfo.method.name );
					}else if( definedBehaviourNames.includes(objs[j].type) ){
						existingMethods.push(objs[j].type);
					}
				}
				break;
			}
		}	

		messages = Blockly.Blocks['objetc_create'].getMessagesOf(targetBlock,existingMethods);
		
		if(definedObjectNames.includes(aBlock.name)){
			targetBlock.dispose();
		}

		return messages;
	
	}
	return [];
}	

function messagesAsTextListXml(aList){
	var result = '';
	result += '<xml>';
	if(aList.length > 0){
		result += '<block type="lists_create_with">';
		result += '<mutation items="'+aList.length+'"></mutation>';
		for(var i = 0; i < aList.length; i++){
			result += '<value name="ADD'+i+'">';
			result += '<block type="text">';
			result += '<field name="TEXT">'+aList[i]+'</field>';
			result += '</block>';
			result += '</value>';	    
		}
		result += '</block>';
	}else{
		result += '<block type="lists_create_with">';
    	result += '<mutation items="0"></mutation>';
  		result += '</block>';
	}
	result += '</xml>';
	return result;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function removeInitialNumbers(aString){
	var firstNonNumericIndex = 0;
	while(firstNonNumericIndex < aString.length && isNumeric(aString[firstNonNumericIndex])){
		firstNonNumericIndex++;
	}
	return aString.substring(firstNonNumericIndex);
}