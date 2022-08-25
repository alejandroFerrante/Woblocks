import Blockly from 'blockly'

import {imagePathManager, getIconPathFor, getAllSprites} from '../ImagePathManager'

import woblocksControl from '../models/woblocksControl'

//ACTION START
//This Block serves as the starting point of an object or method definition. All other blocks are designed to not generate code if this block 
//is not on top of the top of the block heriarchy. 
Blockly.Blocks['action_start_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage( getIconPathFor('play'), 20, 20, "|>",null,null,null));      
    this.setInputsInline(false);
    this.setNextStatement(true, ['objetc_definition_wk','execution_wk','action_start_wk']);
    this.setTooltip('');
    this.setColour('#03071e');
  }, isLinkedToActionStart : function(aBlock:any){
    if(aBlock.previousConnection === null){return false;}
    var iterator = aBlock.previousConnection.targetBlock();
    for(var i  = 0; i < 5000; i++){
      if(iterator === null){
        return false;
      }

      if(iterator.type === 'action_start_wk'){
        return true;
      }

      if(iterator.previousConnection === null){
        return false;
      }

      iterator = iterator.previousConnection.targetBlock();

    } 
    return false;
  },getValueWK: function(block:any) { 
    if(block.nextConnection.targetBlock() !== null){
      return Blockly.Blocks[block.nextConnection.targetBlock().type].getValueWK(block.nextConnection.targetBlock());
    }else{
      return '';
    } 
  }
};

//OBJECT DEFINITION
//This block is used to create an object.It takes a text block for the nme and properties definition statements.
Blockly.Blocks['objetc_create_wk'] = {
  init: function() {
    this.setInputsInline(true);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('wollokBW'), 40, 40, "*",null,null,null));
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombre"), "name");
    this.appendStatementInput('properties')
    .setCheck('objetc_definition_wk');
    this.setPreviousStatement(true, 'objetc_definition_wk');
    this.setTooltip('');
    this.setColour('#03071e');
  },doActionWK : function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_objname = paramsMap['objName'];
    var value_properties = paramsMap['properties']; 
    var code = 'object ';
    code += value_objname.replaceAll("'","");
    code += '{\n';
    code += value_properties.join('\n');
    code += ' \n}';
    
    return code;
  },messagesOf : function(self:any){
    //if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return [];}

    var methodCreateBlocks = Blockly.getMainWorkspace().getAllBlocks(false).filter(function(aBlock){return aBlock.type === 'method_create_wk'});
    var methods = [];
    for(var i = 0; i < methodCreateBlocks.length; i++){
      if(hasAncestorWithId(methodCreateBlocks[i] , self.id)){
        methods.push( extractFieldNamed( methodCreateBlocks[i] , 'name') )
      }
    }
    

    return methods;
  },getValueWK: function(aBlock:any) {
    var value_objname = extractFieldNamed(aBlock,'name');
    var value_properties = extractStatementsAsWkValues(aBlock);
    var code = Blockly.Blocks['objetc_create_wk'].doActionWK(aBlock,{'objName':value_objname , 'properties':value_properties});
    return code;
  }
};



//OBJECT PROPERTY
//used for defining a property. First block must be a text block and the second one can be any value
Blockly.Blocks['objetc_property_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombreDePropiedad"), "name");
    this.appendValueInput("value")
        .appendField(new Blockly.FieldImage(getIconPathFor('arrow'), 30, 30, "",null,null,null));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'objetc_definition_wk');
    this.setNextStatement(true, 'objetc_definition_wk');
    this.setTooltip('');
    this.setColour('#03071e');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_value = paramsMap['value'];

    var code = '\n var ';
    code += value_name.replaceAll("'","");
    
    code += ' = ';
    code += value_value.replaceAll("'","")+' ';

    return code;
  },getValueWK: function(aBlock:any) {
    var value_name = aBlock.getFieldValue('name');
    if(value_name){value_name = removeInitialNumbers(value_name);}
    
    var value_value = ''; 
    var valueBlock = getBlockOfInputNamed(aBlock,'value');
    if(valueBlock){
      if(valueBlock.type === 'text'){
        value_value = extractValueFromTextBlock(valueBlock);
      }else if( (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== undefined) && (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== null) ){
        value_value = Blockly.Blocks[valueBlock.type].getValueWK(valueBlock);
      }
    }

    var code = Blockly.Blocks['objetc_property_wk'].doActionWK(aBlock,{'name':value_name , 'value':value_value});
    return code;
  }
};


//OBJECT METHOD
//used for defining a method. 
Blockly.Blocks['method_create_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombreDeMensaje"), "name")
        .appendField(new Blockly.FieldImage(getIconPathFor('action'), 35, 35, "*",null,null,null));
    this.appendValueInput("params")
        .setCheck("Array");
    this.appendStatementInput('instructions')
    .appendField('');
    this.setInputsInline(false);
    this.setInputsInline(true);
    this.setTooltip('');
    this.setPreviousStatement(true, 'objetc_definition_wk');
    this.setNextStatement(true, 'objetc_definition_wk');
    this.setColour('#03071e');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_params = paramsMap['params'];
    var value_instructions = paramsMap['instructions'];
    var code = 'method ';
    if(value_name !== undefined && value_name !== null && value_name !== ''){
      code += value_name.replaceAll("'",""); 
    }
    code += '(';
    if(value_params !== undefined && value_params !== null && value_params !== ''){
      code += ''+value_params.join(','); 
    }
    code += '){\n';

    if(value_instructions !== undefined && value_instructions !== null /*&& value_instructions !== ''*/){
      code += value_instructions.join('\n'); 
    }

    code += '\n}';

    return code;  
  },getValueWK: function(aBlock:any) {
      var value_name = extractFieldNamed(aBlock,'name');
      var listBlock = getBlockOfInputNamed(aBlock,'params');
      var value_paramNames = [];
      if(listBlock){
        value_paramNames = extractValuesListofTextBlocks(listBlock);
      }
      var value_instructions = extractStatementsAsWkValues(aBlock);
      var code =Blockly.Blocks['method_create_wk'].doActionWK(aBlock,{'name':value_name , 'params':value_paramNames,'instructions':value_instructions});
      return code;
  }
};

//INSTRUCTION 
//a simple block that describes an instruction.can be used in an object or in a program
Blockly.Blocks['instruction_wk'] = {
  init: function() {
    this.appendValueInput("instruction")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true, ['instruction_wk','execution_wk']);
    this.setPreviousStatement(true, ['instruction_wk','execution_wk']);
    this.setTooltip('');
    this.setColour('#03071e');
  },doActionWK:function(self:any, paramsMap:any){
      //if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

      var value_instruction = paramsMap['instruction'];
      var code = '';
      if(value_instruction !== undefined && value_instruction !== null && value_instruction !== ''){
        code += value_instruction.replaceAll("'","");
      }
      //code +='\n';

      return code;
  },getValueWK: function(aBlock:any) {
    
    var value_instruction = ''; 
    var valueBlock = getBlockOfInputNamed(aBlock,'instruction');
    if(valueBlock !== undefined && valueBlock !== null){
      if(valueBlock.type === 'text'){
        value_instruction = extractValueFromTextBlock(valueBlock);
      }else if( (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== undefined) && (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== null) ){
        value_instruction = Blockly.Blocks[valueBlock.type].getValueWK(valueBlock);
      }
    }


    var code = Blockly.Blocks['instruction_wk'].doActionWK(aBlock,{'instruction':value_instruction});
    return code;  
  }};

//MESSAGE SENDING
//used for sending a message with params to an object
Blockly.Blocks['executor_wk'] = {
  init: function() {
    this.appendValueInput("executor")
        .setCheck(null)
        .appendField("");
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('mSend'), 35, 35, "",null,null,null));
    
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombreDeMensaje"), "method");
    this.appendStatementInput('params')
    .appendField('');    
    this.setTooltip('');
    this.setInputsInline(true);//
    this.setColour('#f0a329');
    this.setPreviousStatement(true, ['instruction_wk','method_instructions_wk','action_start_wk','execution_wk']);
    this.setNextStatement(true, ['instruction_wk','execution_wk','execution_wk']);
  },doActionWK:function(self:any, paramsMap:any, checkActionStart:any){
      if(checkActionStart && ! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

      var value_executor = paramsMap['executor'];
      var value_method = paramsMap['method'];
      var value_params = paramsMap['params'];
      var messages;
      var existingObjects;
      var executorBlock = null;
      //check if obj exists?
      //check if has method?
      //check if params coincide?
      if(value_executor === undefined || value_executor === null || value_executor === ''){
        //empty executor
        //alert('No se ha provisto un ejecutor');
        //sceneErrorLog = 'No se ha provisto un ejecutor';
        return false;
      }
      if(value_method === undefined || value_method === null || value_method === ''){
        //empty method
        //if(sceneAlertErrors){alert('No se ha provisto un mensaje a enviar');}
        //sceneErrorLog = 'No se ha provisto un mensaje a enviar';
        return false;
      }
      if(value_params === undefined || value_params === null){
        //empty params
        //if(sceneAlertErrors){alert('No se han provisto parametros de ejecucion');}
        //sceneErrorLog = 'No se han provisto parametros de ejecucion';
        return false;
      }

      return value_executor+'.'+value_method+'('+value_params+')  ';
  },getValueWK: function(aBlock:any) {
      var executor_block = getBlockOfInputNamed(aBlock,'executor');
      var value_executor = executor_block?executor_block.getValueWK(executor_block):'';
      var value_methodName = aBlock.getFieldValue('method');
      var value_params = extractStatementsAsWkValues(aBlock);

      var code = Blockly.Blocks['executor_wk'].doActionWK(aBlock,{'executor':value_executor?value_executor:'','method':value_methodName,'params':value_params},false);
      return code;
    }
};

Blockly.Blocks['execution_res_wk'] = {
  init: function() {
    this.appendValueInput("executor")
        .setCheck(null)
        .appendField("");
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('mSend'), 35, 35, "",null,null,null));
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombreDeMensaje"), "method");
    this.appendStatementInput('params')
    .appendField('');    
    this.setInputsInline(true);//
    this.setTooltip('');
    this.setColour('#f0a329');
    this.setOutput(true);
  },getValueWK: function(aBlock:any) {
      var executor_block = getBlockOfInputNamed(aBlock,'executor');
      var value_executor = executor_block?executor_block.getValueWK(executor_block):'';
      var value_methodName = aBlock.getFieldValue('method');
      var value_params = extractStatementsAsWkValues(aBlock);

      var code = Blockly.Blocks['executor_wk'].doActionWK(aBlock,{'executor':value_executor,'method':value_methodName,'params':value_params},false);
      return code;
    }
};

Blockly.Blocks['executor_param_wk'] = {
  init: function() {
    this.appendValueInput("param")
        .setCheck("String");
    this.setInputsInline(true);
    this.setNextStatement(true);
    this.setPreviousStatement(true);
    this.setTooltip('');
    //this.setColour('#FFB228');
    this.setColour('#ffba08');
    
  },doActionWK:function(self:any, paramsMap:any){
    var value_instruction = paramsMap['param'];
    var code = '';
  
     code += value_instruction.replaceAll('\'','');
    if(self.getNextBlock() === undefined || self.getNextBlock() === null || self.getNextBlock().type !== 'executor_param'){
      
    }else{
      code += ',';
    }
      return code;
    },getValueWK: function(aBlock:any) {
      var paramBlock = getBlockOfInputNamed(aBlock,'param');
      var value_param = '';
      if(paramBlock !== undefined && paramBlock !== null){
        if(paramBlock.type === 'text'){
          value_param = extractValueFromTextBlock(paramBlock);
        }else if( (Blockly.Blocks[paramBlock.type].getValueWK(paramBlock) !== undefined) && (Blockly.Blocks[paramBlock.type].getValueWK(paramBlock) !== null) ){
          value_param = Blockly.Blocks[paramBlock.type].getValueWK(paramBlock);
        }
      }
      var code = Blockly.Blocks['executor_param_wk'].doActionWK(aBlock,{'param':value_param});
      return code;
    }
 };

//VAR DECLARATION
//used for defining a variabe within an execution.
Blockly.Blocks['var_objetc_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("unNombreDeVariable"), "name");
    this.appendValueInput("value")
        .appendField(new Blockly.FieldImage(getIconPathFor('arrow'), 30, 30, "",null,null,null));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'execution_wk');
    this.setNextStatement(true, 'execution_wk');
    this.setTooltip('');
    this.setColour('#90a955');
    //this.setColour('#357C3C');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_name = paramsMap['name'];
    var value_value = paramsMap['value'];

    var code = '\n var ';
    if(value_name !== undefined && value_name !== null && value_name !== ''){
      code += value_name.replaceAll("'","");
    }else{
      code += ' __objetc_property___name__ ';
    }

    code += ' = ';
    
    if(value_value !== undefined && value_value !== null && value_value !== ''){
      code += value_value.replaceAll("'","")+' ';
    }else{
      code += ' __objetc_property___value__ '
    }

    return code;
  },getValueWK:function(aBlock:any){
    var value_name = extractFieldNamed(aBlock,'name');
    var valueBlock = getBlockOfInputNamed(aBlock,'value');
    var value_value = '';
    if(valueBlock !== undefined && valueBlock !== null){
      if(valueBlock.type === 'text'){
        value_value = extractValueFromTextBlock(valueBlock);
      }else if( (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== undefined) && (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== null) ){
        value_value = Blockly.Blocks[valueBlock.type].getValueWK(valueBlock);
      }
    }
    var code = Blockly.Blocks['executor_param_wk'].doActionWK(aBlock,{'name':value_name,'value':value_value});
    return code;
  }
};

//KEYBOARD EVENT
//used for defining keyboard events.
Blockly.Blocks['keyboard_event_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('buttonPress'), 35, 35, "",null,null,null))
        .appendField(new Blockly.FieldDropdown(getKeyboardPicklist()),"keyName");
    this.appendStatementInput("instructions").setCheck('execution_wk');
    this.setPreviousStatement(true,'execution_wk');
    this.setNextStatement(true,'execution_wk');
    this.setColour('#dc2f02');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_keyname = paramsMap['keyName'];
    var value_instructions = paramsMap['instructions'];
    return 'keyboard.'+value_keyname+'().onPressDo { \n'+value_instructions+' \n}';
  },getValueWK(aBlock:any){
    var value_keyName = extractFieldNamed(aBlock,'keyName');
    var value_instructions = extractStatementsAsWkValues(aBlock);
    var code = Blockly.Blocks['keyboard_event_wk'].doActionWK(aBlock,{'keyName':value_keyName,'instructions':value_instructions});
    return code;
  }
};

//TICKER EVENT
//used for defining ticker events.
Blockly.Blocks['tick_event_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('timer') , 35, 35, "",null,null,null))
        .appendField(new Blockly.FieldTextInput("nombreDelEvento"), "event_name")
        .appendField(new Blockly.FieldNumber("1000"), "timer");
    this.appendStatementInput("instructions").setCheck('execution_wk');
    this.setPreviousStatement(true,'execution_wk');
    this.setNextStatement(true,'execution_wk');
    this.setColour('#9d0208');
    //this.setColour('#F76E11');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_event_name = paramsMap['evtName'];
    var value_timer = paramsMap['timer'];
    var value_instructions = paramsMap['instructions'];
    return 'game.onTick('+value_timer+', "'+value_event_name+'",{ \n'+value_instructions+'\n })';
  },getValueWK(aBlock:any){

    var value_event = extractFieldNamed(aBlock,'event_name');
    var value_timer = extractFieldNamed(aBlock,'timer');
    var value_instructions = extractStatementsAsWkValues(aBlock);

    var code = Blockly.Blocks['tick_event_wk'].doActionWK(aBlock,{'evtName':value_event,'timer':value_timer,'instructions':value_instructions});
    return code;
  }
};

//COLLISSION
//used for defining collission events.
Blockly.Blocks['collission_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('crash'), 35, 35, "",null,null,null))
        .appendField(new Blockly.FieldTextInput("nombreDelObjeto"), "target_name");
    this.appendDummyInput().appendField(new Blockly.FieldTextInput("nombreDeQuienColisiono"), "collided_name")
    this.appendStatementInput("instructions").setCheck('execution_wk');
    this.setPreviousStatement(true,'execution_wk');
    this.setNextStatement(true,'execution_wk');
    this.setColour('#6a040f');
    //this.setColour('#B20600');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_target_name = paramsMap['target'];
    var value_param_name = paramsMap['param'];
    var value_instructions = paramsMap['instructions'];
    return 'game.whenCollideDo('+value_target_name+', \n{'+value_param_name+' =>  \n'+value_instructions+'\n})';
  },getValueWK(aBlock:any){
     var value_targetName = extractFieldNamed(aBlock,'target_name');
     var value_collided = extractFieldNamed(aBlock,'collided_name');
     var value_instructions = extractStatementsAsWkValues(aBlock);

     var code = Blockly.Blocks['collission_wk'].doActionWK(aBlock,{'target':value_targetName,'param':value_collided,'instructions':value_instructions});
     return code; 
  }
};

//CONDITION STATEMEN
//used for defining if then else statements.
Blockly.Blocks['condition_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('question_black'), 35, 35, "",null,null,null));
    this.appendValueInput("condition");
    this.setInputsInline(true);
    this.appendStatementInput("instructionsPositive").setCheck('execution_wk').appendField(new Blockly.FieldImage(getIconPathFor('conditionOK'), 20, 20, "",null,null,null));
    this.appendStatementInput("instructionsNegative").setCheck('execution_wk').appendField(new Blockly.FieldImage(getIconPathFor('conditionNOK'), 20, 20, "",null,null,null));
    this.setPreviousStatement(true,'execution_wk');
    this.setNextStatement(true,'execution_wk');
    this.setColour('#faa307');
    //this.setColour('#573391');
  },doActionWK:function(self:any, paramsMap:any){
    if(! Blockly.Blocks['action_start_wk'].isLinkedToActionStart(self)){return '';}

    var value_condition = paramsMap['condition'];
    var value_positive_case = paramsMap['positive'];
    var value_negative_case = paramsMap['negative'];
    var result = `if(`+value_condition+`){
      `+value_positive_case+`
    }`;
    if(value_negative_case !== undefined && value_negative_case !== null && value_negative_case !== ''){
      result += `else{
        `+value_negative_case+`
      }`;
    }
    return result;
  },getValueWK(aBlock:any){
    var conditionBlock = getBlockOfInputNamed(aBlock,'condition');
    var value_condition = '';
    if(conditionBlock){
      if(conditionBlock.type === 'text'){
        value_condition = extractValueFromTextBlock(conditionBlock);
      }else if( Blockly.Blocks[conditionBlock.type].getValueWK(conditionBlock) ){
        value_condition = Blockly.Blocks[conditionBlock.type].getValueWK(conditionBlock);
      }
    }

    var positiveBlock = getBlockOfInputNamed(aBlock,'instructionsPositive');
    var value_positive = [];
    if(positiveBlock && positiveBlock.connection.targetBlock()){
      value_positive = getBlockSuccesionAsWKValues(positiveBlock.connection.targetBlock());
    }

    var negativeBlock = getBlockOfInputNamed(aBlock,'instructionsNegative');
    var value_negative = [];
    if(negativeBlock && negativeBlock.connection.targetBlock()){
      value_negative = getBlockSuccesionAsWKValues(negativeBlock.connection.targetBlock());
    }    

    var code = Blockly.Blocks['condition_wk'].doActionWK(aBlock,{'condition':value_condition,'positive':value_positive,'negative':value_negative}); 
    return code;
  }
};

//GAME
//repreentes the object game (Wollok Game native)
Blockly.Blocks['game_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('controller'), 25, 25, "",null,null,null));
    this.setOutput(true);
    this.setTooltip("Game");
    this.setColour('#32a852');
  },getValueWK(aBlock:any){
    return 'game';
  }
};

Blockly.Blocks['sprite_block_wk'] = {
  init: function() {
    var options = [
        ['none', 'NONE'],
        [{'src': 'canada.png', 'width': 50, 'height': 25, 'alt': 'Canada'}, 'CANADA'],
        [{'src': 'usa.png', 'width': 50, 'height': 25, 'alt': 'USA'}, 'USA'],
        [{'src': 'mexico.png', 'width': 50, 'height': 25, 'alt': 'Mexico'}, 'MEXICO']
    ];
    options = getAllSprites().map(function(elem){ return [{'src':elem.url ,'width': 50, 'height': 50, 'alt': elem.alias },elem.alias] });
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(options), 'Sprite');
    this.setOutput(true);
  },doActionWK:function(self:any, paramsMap:any){
    return '"'+paramsMap['sprite']+'"';
  },getValueWK(aBlock:any){
      var value_sprite = extractFieldNamed(aBlock,'Sprite');
      var code = Blockly.Blocks['sprite_block_wk'].doActionWK(aBlock,{'sprite':value_sprite});
      return code;

  }
};

//OTHERS
//a simple wrapper block that appends 'return' to the result of the result of the block giving a better visual
Blockly.Blocks['return_wk'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage(getIconPathFor('return'), 25, 25, "",null,null,null));
    this.appendValueInput("value")
        .setCheck(null)
        .appendField("");
    this.setInputsInline(true);//
    this.setTooltip('');
    this.setColour('#469b9e');
    //this.setOutput(true);
    this.setPreviousStatement(true, null);
  },doActionWK:function(self:any, paramsMap:any){
    return 'return '+paramsMap['value'];
  },getValueWK(aBlock:any){

      var valueBlock = getBlockOfInputNamed(aBlock,'value');
      var value_value = '';
      if(valueBlock !== undefined && valueBlock !== null){
        if(valueBlock.type === 'text'){
          value_value = extractValueFromTextBlock(valueBlock);
        }else if( (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== undefined) && (Blockly.Blocks[valueBlock.type].getValueWK(valueBlock) !== null) ){
          value_value = Blockly.Blocks[valueBlock.type].getValueWK(valueBlock);
        }
      }

      var code = Blockly.Blocks['return_wk'].doActionWK(aBlock,{'value':value_value});
      return code;

  }
};

//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================
//=============================================================================================================================================

function getBlockOfInputNamed(aBlock:any, anInputName:string){
  if(!aBlock.inputList.find(function(elem:any){return elem.name === anInputName})){return null}
  return aBlock.inputList.find(function(elem:any){return elem.name === anInputName}).connection.targetBlock();
}

function getKeyboardPicklist(){
  var result = [];
  result.push(['alt','alt']);     
  //result.push(['any','any']);     
  //result.push(['arrow','arrow']);   
  result.push(['borrar','backspace']);     
  //result.push(['center','center']);      
  result.push(['control','control']);     
  //result.push(['del','del']);     
  result.push(['abajo','down']);      
  result.push(['enter','enter']);     
  result.push(['izquierda','left']);      
  //result.push(['letter','letter']);    
  result.push(['-','minusKey']);      
  //result.push(['num','num']);     
  result.push(['+','plusKey']);     
  result.push(['derecha','right']);     
  result.push(['shift','shift']);     
  //result.push(['slash','slash']);     
  result.push(['espacio','space']);     
  result.push(['arriba','up']);      
  result.push(['num0','num0']);      
  result.push(['num1','num1']);      
  result.push(['num2','num2']);      
  result.push(['num3','num3']);      
  result.push(['num4','num4']);      
  result.push(['num5','num5']);      
  result.push(['num6','num6']);      
  result.push(['num7','num7']);      
  result.push(['num8','num8']);      
  result.push(['num9','num9']);      
  result.push(['a','a']);     
  result.push(['b','b']);     
  result.push(['c','c']);     
  result.push(['d','d']);     
  result.push(['e','e']);     
  result.push(['f','f']);     
  result.push(['g','g']);     
  result.push(['h','h']);     
  result.push(['i','i']);     
  result.push(['j','j']);     
  result.push(['k','k']);     
  result.push(['l','l']);     
  result.push(['m','m']);     
  result.push(['n','n']);     
  result.push(['o','o']);     
  result.push(['p','p']);     
  result.push(['q','q']);     
  result.push(['r','r']);     
  result.push(['s','s']);     
  result.push(['t','t']);     
  result.push(['u','u']);     
  result.push(['v','v']);     
  result.push(['w','w']);     
  result.push(['x','x']);     
  result.push(['y','y']);     
  result.push(['z','z']); 
  return result;   
}

function hasAncestorWithId(aBlock:any, anId:any){
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

function removeInitialNumbers(aString:string){
  var firstNonNumericIndex = 0;
  while(firstNonNumericIndex < aString.length && isNumeric(aString[firstNonNumericIndex])){
    firstNonNumericIndex++;
  }
  return aString.substring(firstNonNumericIndex);
}

function isNumeric(n:any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function extractFieldNamed(aBlock:any, aName:string){
  return aBlock.getFieldValue(aName);
} 

function extractValueFromTextBlock(aBlock:any){
  if(aBlock.type !== 'text' ){return '';}
  return extractFieldNamed(aBlock,'TEXT');
}

function extractStatementsAsWkValues(aBlock:any){
  return woblocksControl.getAllStatementsOf(aBlock).map(function(elem){return Blockly.Blocks[elem.type].getValueWK(elem)});
}

function getBlockSuccesionAsWKValues(aStaringBLock:any){
  var result = [];
  if(aStaringBLock){
    result.push( aStaringBLock.getValueWK(aStaringBLock) );    
    var iter = aStaringBLock.getNextBlock();
    while(iter != null){
      result.push( iter.getValueWK(iter) );    
      var iter = iter.getNextBlock();
    }
  }
  return result;
}

function extractValuesListofTextBlocks(aBlock:any){
  if(aBlock.type !== 'lists_create_with'){return [];}
  return aBlock.childBlocks_.filter(function(elem:any){return elem.type === 'text'}).map(function(elem:any){return extractValueFromTextBlock(elem);});
}


export default Blockly