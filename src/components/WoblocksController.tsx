import { useState, useEffect } from "react"
import { Component } from "react"

import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'
import ContentManager from './ContentManager';

export default class WoblocksController extends Component{



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
			this.state.definedObjects.push({name:objCreateData.chosenName , icon:objCreateData.chosenRepresentation.icon });
			this.state.currentIndex = this.state.definedObjects.length;

			console.log( 'isOnScene: '+this.state.isOnScene+' currentObjName:'+this.state.currentObjName+' currentIndex:'+this.state.currentIndex+' definedObjects.length:'+this.state.definedObjects.length);

		}
		
	}

	onTabSwitch = ( eventData:any ) => {
		console.log('onTabSwitch new:'+eventData+' isOnScene:'+this.state.isOnScene+' currentIndex:'+this.state.currentIndex);

		//SAVE CURRENT
		if(this.state.isOnScene){
			woblocksControl.saveSceneXmlContent();
		}else{
			//create obj
			woblocksControl.saveObjectTabXmlContentWithIndex(this.state.currentIndex - 1);
		}
		//woblocksControl.definedObjectsAsBlocklyBlocks();

		//LOAD NEW
		if(eventData == 'scene'){
			this.state.isOnScene = true;
			this.state.currentObjName = 'scene';
			this.state.currentIndex = 0;
			woblocksControl.loadSceneXmlContent();
		}else{
			this.state.currentObjName = eventData; 
			this.state.isOnScene = false;
			this.state.currentIndex = 1 + this.state.definedObjects.indexOf(eventData);
			woblocksControl.loadDefinedObjectXmlContent(this.state.currentIndex);
		}

		console.log( 'isOnScene: '+this.state.isOnScene+' currentObjName:'+this.state.currentObjName+' currentIndex:'+this.state.currentIndex+' definedObjects.length:'+this.state.definedObjects.length);

	}

	onGameConfigAccept = (eventData:any) => {}

	onGameExecute = (eventData:any) => {}

	onGameStop = (eventData:any) => {}

	onProjectSave  = (eventData:any) => {}

	onProjectLoad  = (eventData:any) => {}

	state = {
		//this info is stores to be able to dynamically define the toolbox
		isOnScene:true,
		currentObjName:'scene',
		currentIndex:0,
		//
		definedObjects:[{}].splice(1)
	}

	
    render(){ 
    
    	var toolbox = Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString());
    	if(!this.state.isOnScene){toolbox = Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getObjectToolboxXmlString(this.state.currentObjName));}

		  return (
		    <>
		    	<ContentManager onObjCreateConfigAccept={this.onObjCreateConfigAccept} definedObjects={this.state.definedObjects} currentTab={this.state.currentObjName} onTabSwitch={this.onTabSwitch} />
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
			</>
		    )
		    


	}

}
