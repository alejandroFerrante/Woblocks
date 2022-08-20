import { useContext, useState } from "react"
import WBContext from '../WBContext'

import {imagePathManager, getIconPathFor} from '../ImagePathManager'
import ObjectConfigForm from './ObjectConfigForm'

import woblocksControl from '../models/woblocksControl'

export default function CurrentObjectConfig(){

	const {globalState,val,setGlobalState,valSetter} = useContext(WBContext);
	const objInfo = woblocksControl.getObjectInfoOfIndex(globalState.currentTabIndex - 1);//: {name ,representationName,isVisual};

	const list = imagePathManager.representations.filter(function(elem:any){return (!objInfo.isVisual) || (elem.isVisual == true)});
	const representationIndex = (list.includes(objInfo.representationName)) ? list.indexOf(objInfo.representationName) : 0
	

	console.log('CurrentObjectConfig currentTabIndex:'+globalState.currentTabIndex+' || name:'+objInfo.name+' repName:'+objInfo.representationName+' isVIsual:'+objInfo.isVisual+' repIndex:'+representationIndex);

	const setVisualModeFunc = function(newVal:any){
		setVisualMode(newVal);
		const rep = imagePathManager.representations.filter(function(elem:any){return (!newVal) || (elem.isVisual == true)})[sliderIndex];
		woblocksControl.setObjectInfoOfIndex(globalState.currentTabIndex - 1, rep.name,newVal);
		var x = woblocksControl.getObjectInfoOfIndex(globalState.currentTabIndex - 1);
	}

	const setSliderIndexFunc = function(newVal:any){
		setSliderIndex(newVal);
		const rep = imagePathManager.representations.filter(function(elem:any){return (!visualMode) || (elem.isVisual == true)})[newVal];
		woblocksControl.setObjectInfoOfIndex(globalState.currentTabIndex - 1, rep.name,visualMode);
		var x = woblocksControl.getObjectInfoOfIndex(globalState.currentTabIndex - 1);
	}

	const [visualMode,setVisualMode] = useState(objInfo.isVisual);
    const [sliderIndex,setSliderIndex] = useState( representationIndex );
    const [chosenName,setChosenName] = useState(objInfo.name);
	

	return <>
		<ObjectConfigForm editName={false}  visualMode={visualMode} sliderIndex={sliderIndex} chosenName={chosenName} setVisualMode={setVisualModeFunc} setSliderIndex={setSliderIndexFunc} setChosenName={setChosenName} representations={imagePathManager.representations}/>
	</>

}