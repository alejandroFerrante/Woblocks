import { useState, useContext } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'


import WBContext from '../WBContext'

import "../woblocksClasses.css";

import {getBackgrounds} from '../ImagePathManager';

import { useBlocklyWorkspace } from 'react-blockly';
import {useRef} from 'react'

export default function BlocklyWoblocks() {
  const [xml, setXml] = useState("");

  const {globalState,setGlobalState} = useContext(WBContext);

  const toolbox = (globalState.currentTabIndex === 0)?Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString()) : Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getObjectToolboxXmlStringForIndex( globalState.currentTabIndex - 1));

  const onXmlChange = function(value:string){
   //console.log('XML CHANGE! '+value);
   if((globalState.currentTabIndex === 0)){
     woblocksControl.fillMessagesOfForWorkspace();
   }
   setXml(value); 
  }

  const onWorkspaceLoaded = function(theWk:any){
    console.log('LOADED');
  }
/*
  const [intialLoad,setIntialLoad] = useState(false);

  if(!intialLoad){
      const backs = [{name:'ninguna',url:'',value:''}].concat(getBackgrounds());
      const loadResult = woblocksControl.loadLocalStorage();

      globalState.currentTabIndex = 0;
      globalState.tabObjects = [{name:'escena', icon:'wollok'}];
      const newTabObjs = Object.keys(loadResult.objectsInfoMap).map(function(elem:any){
          const iconName = loadResult.objectsInfoMap[elem].definedObjectsMappingInfo.representationName;
          return {name:elem , icon:iconName }; 
      });
      globalState.tabObjects = globalState.tabObjects.concat(newTabObjs);
      globalState.gameWidth = loadResult.configHeight;
      globalState.gameHeight = loadResult.configWidth;
      globalState.gameBackgroundImage = loadResult.configBackgroundImage;
      globalState.proposedBackgroundIndex = 0;
      if(backs.map(function(elem){return elem.value}).indexOf(loadResult.configBackgroundImage) >= 0){
          globalState.proposedBackgroundIndex = backs.map(function(elem){return elem.value}).indexOf(loadResult.configBackgroundImage);
      }

      woblocksControl.loadSceneXmlContent();

      setGlobalState(globalState);
      setIntialLoad(true);
    }
*/
  return (
    <div>
      <BlocklyWorkspace 
        className="blocklyCanvas blocklyWorkspaceClass"
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
          oneBasedIndex : true,
          onInject:{onWorkspaceLoaded}
        }}
        initialXml={xml}
        onXmlChange={onXmlChange}
      />
    </div>
  )
}
