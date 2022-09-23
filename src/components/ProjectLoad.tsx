import { useContext } from "react"
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import {getRepIconFor} from '../ImagePathManager'

/*
export function ProjectLoadAccept(){
	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	if(!globalState.proposedLoadFile){ return;}

	woblocksControl.loadProjetInfoFromJSON(globalState.proposedLoadFile);
	const fileContentJSON = JSON.parse(globalState.proposedLoadFile);
	globalState.proposedLoadFile = null;

	globalState.currentTabIndex = 0;
	globalState.tabObjects = [{name:'escena', icon:'wollok'}];
	const newTabObjs = Object.keys(fileContentJSON.definedObjectsInfo.objectsInfoMap).map(function(elem:any){
		const iconName = fileContentJSON.definedObjectsInfo.objectsInfoMap[elem].definedObjectsMappingInfo.representationName;
		return {name:elem , icon: getRepIconFor(iconName) }; 
	});
	globalState.tabObjects = globalState.tabObjects.concat(newTabObjs);
	globalState.gameWidth = fileContentJSON.config.height;
	globalState.gameHeight = fileContentJSON.config.width;
	globalState.modalState = 'CLOSED';

	woblocksControl.loadSceneXmlContent();

	setGlobalState(globalState);
	valSetter( (val + 1) % 2);

}
*/

export default function ProjectLoad(){

	//COMPONENT USED FOR LOADING A wbk PROJECT FILE 
	const handleAccept = () => {
	}

	const fileLoaded = function(something:any){
		
		var fr = new FileReader();
		fr.addEventListener("loadend", function(e:any) {
		    globalState.proposedLoadFile = e.srcElement.result;
			setGlobalState(globalState);
		});
		  
		fr.readAsText(something.target.files[0]);
	}

	const inputStyle = {paddingLeft:"5%",width:"80%",paddingRight:"5%"}

	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	
	return <>
			<br/>
			<div><input type="file" accept=".wbk" style={inputStyle} onChange={fileLoaded}  /> </div>
			<br/>			
	</>
}