import { useState, useContext } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'


import WBContext from '../WBContext'

import "../woblocksClasses.css";

export default function BlocklyWoblocks() {
  const [xml, setXml] = useState("");

  const {globalState} = useContext(WBContext);

  const toolbox = (globalState.currentTabIndex === 0)?Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString()) : Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getObjectToolboxXmlStringForIndex( globalState.currentTabIndex - 1));

  const onXmlChange = function(value:string){
   //console.log('XML CHANGE! '+value);
   if((globalState.currentTabIndex === 0)){
     woblocksControl.fillMessagesOfForWorkspace();
   }
   setXml(value); 
  }

  return (
    <div /*style={{position:"relative",width:"1200px", height:"100%"}}*/ >
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
          oneBasedIndex : true
        }}
        initialXml={xml}
        onXmlChange={onXmlChange}
      />
    </div>
  )
}
