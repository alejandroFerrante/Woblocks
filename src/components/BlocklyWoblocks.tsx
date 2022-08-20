import { useState, useContext } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'
import CurrentObjectConfig from './CurrentObjectConfig'
import RemoveItemButton from './RemoveItemButton'


import WBContext from '../WBContext'

export default function BlocklyWoblocks() {
  const [xml, setXml] = useState("");

  const {globalState} = useContext(WBContext);

  const toolbox = (globalState.currentTabIndex == 0)?Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString()) : Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getObjectToolboxXmlStringForIndex( globalState.currentTabIndex - 1));

  return (<table><tr>
    <td style={{paddingBottom:"150px"}} >
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
      initialXml={xml}
      onXmlChange={setXml}
    />
    </td>
    {globalState.currentTabIndex !== 0 && <td > <RemoveItemButton /> <CurrentObjectConfig /></td>}
    </tr></table>
  )
}
