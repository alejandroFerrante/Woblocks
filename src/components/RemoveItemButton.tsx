import { useContext } from "react"
import WBContext from '../WBContext'

import woblocksControl from '../models/woblocksControl'

import {getIconPathFor} from '../ImagePathManager'

import swal from 'sweetalert'

import Blockly from 'blockly'

export default function RemoveItemButton(){
	
	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);

	const buttonStyle = {width:"40px",height:"33px",backgroundColor:"transparent",borderColor:"transparent"};
	const imgStyle = {width:"100%",height:"100%",color:"white"};

	const handleClick = function(){
		swal({
			title:  "¿Esta seguro que quiere eliminar este objeto?",
			icon:   "warning",
			buttons: ["No","Si"]
		}).then(answer => {
			if(answer){
				woblocksControl.removeObjectOfIndex(globalState.currentTabIndex - 1);
				globalState.tabObjects.splice(  globalState.currentTabIndex ,1);
				globalState.currentTabIndex = 0;
				setGlobalState(globalState);

				woblocksControl.loadSceneXmlContent();
				woblocksControl.definedObjectsAsBlocklyBlocks();
				var wsp:any = Blockly.getMainWorkspace(); 
				wsp.getToolbox().clearSelection(); 

				valSetter( (val + 1) % 2);
			}
		});
	}

	return <>
		<button style={buttonStyle} onClick={handleClick} ><img style={imgStyle} src={getIconPathFor('trash')}/></button>
	</>
}