import { useState, useEffect } from "react"
import { Component } from "react"

import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'
import ContentManager from './ContentManager';

import EventEmitter from './eventEmitter'

export default class WoblocksController extends Component{

	state = {
		//this info is stores to be able to dynamically define the toolbox
		isOnScene:true,
		currentObjName:'',
		currentIndex:0
		//
	}

	onObjCreateConfigAccept = (objCreateData:any) => {
		console.log('onObjCreateConfigAccept');
		
		//TODO: CHECK IF objCreateData.chosenName IS EMPTY OR ALREADY DEFINED

		if(!woblocksControl.isObjectNamedPresent(objCreateData.chosenName)){ 
			console.log('ADDTAB');
			
			if(this.state.isOnScene){
				woblocksControl.saveSceneXmlContent();
			}else{
				woblocksControl.saveObjectTabXmlContentWithIndex(this.state.currentIndex - 1);
			}
			this.state.isOnScene = false;
			this.state.currentObjName = objCreateData.chosenName;

			woblocksControl.addObjectNamed(objCreateData.chosenName, objCreateData.chosenRepresentation.name,objCreateData.chosenRepresentation.isVisual);
			woblocksControl.addDefaultObjectXmlToWorkspaceNamed(objCreateData.chosenName);//this clears the workspace

			EventEmitter.emit('CreateTab',objCreateData.chosenName);
		}
		
	}

	onTabSwitch = ( eventData:any ) => {
		console.log('onTabSwitch previous:'+eventData.previous+' new:'+eventData.new);


		//SAVE CURRENT
		if(eventData.previous == 0){
			woblocksControl.saveSceneXmlContent();
		}else{
			//create obj
			woblocksControl.saveObjectTabXmlContentWithIndex(eventData.previous - 1);
		}
		//woblocksControl.definedObjectsAsBlocklyBlocks();

		//LOAD NEW
		if(eventData.new == 0){
			this.state.isOnScene = true;
			this.state.currentObjName = '';
			woblocksControl.loadSceneXmlContent();
		}else{
			this.state.currentObjName = eventData.tabName; 
			this.state.isOnScene = false;
			woblocksControl.loadDefinedObjectXmlContent(eventData.new - 1);
		}
		this.state.currentIndex = eventData.new;

	}

	onGameConfigAccept = (eventData:any) => {}

	onGameExecute = (eventData:any) => {}

	onGameStop = (eventData:any) => {}

	onProjectSave  = (eventData:any) => {}

	onProjectLoad  = (eventData:any) => {}

	
    render(){ 
    
    	var toolbox = Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString());
    	if(!this.state.isOnScene){toolbox = Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getObjectToolboxXmlString(this.state.currentObjName));}

    	const tabSwitchListener = EventEmitter.addListener('TabSwitch',this.onTabSwitch);
    	const objCreateAcceptListener = EventEmitter.addListener('ObjectCreateConfigAccept',this.onObjCreateConfigAccept);

		  return (
		    <>
		    	<ContentManager />
			    <BlocklyWorkspace
			      className="blocklyCanvas"
			      toolboxConfiguration={toolbox!}
			      workspaceConfiguration={{ 
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
			      }}
			    />
		    	{this.state.isOnScene} {this.state.currentObjName}
			</>
		    )
		    


	}

}
