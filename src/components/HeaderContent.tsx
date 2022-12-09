import { useContext } from "react"
import { Toolbar, AppBar } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'
import WoblocksLogo from './WoblocksLogo'

import DialogButton from './DialogButton'

import { PermDataSetting, CloudUpload, Save, Code } from '@material-ui/icons'

import WBContext from '../WBContext'


import GeneratedCode from './GeneratedCode'
import GameConfig from './GameConfig'
import ProjectLoad  from './ProjectLoad'
import ProjectSave  from './ProjectSave'

import GameConfigAccept from './GameConfig'
import ProjectLoadAccept from './ProjectLoad'
import ProjectSaveAccept from './ProjectSave'

import {getBackgrounds,getRepIconFor} from '../ImagePathManager';
import woblocksControl from '../models/woblocksControl'

export default function HeaderContent(props:any) {
    
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    const backs = [{name:'ninguna',url:'',value:''}].concat(getBackgrounds());

    const onGameConfigAccept = GameConfigAccept;

    const gameConfigAccept = function(){

        globalState.gameWidth = globalState.proposedWidth;
        globalState.gameHeight = globalState.proposedHeight;
        globalState.gameBackgroundImage = backs[globalState.proposedBackgroundIndex].value;
        woblocksControl.saveConfigInfo(globalState.gameWidth,globalState.gameHeight, globalState.gameBackgroundImage);

        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
    }

    const projectLoadAccept = function(){
        if(!globalState.proposedLoadFile){ return;}

        woblocksControl.loadProjetInfoFromJSON(globalState.proposedLoadFile);

        const fileContentJSON = JSON.parse(globalState.proposedLoadFile);
        globalState.proposedLoadFile = null;

        globalState.currentTabIndex = 0;
        globalState.tabObjects = [{name:'escena', icon:'wollok'}];
        const newTabObjs = Object.keys(fileContentJSON.definedObjectsInfo.objectsInfoMap).map(function(elem:any){
            const iconName = fileContentJSON.definedObjectsInfo.objectsInfoMap[elem].definedObjectsMappingInfo.representationName;
            return {name:elem , icon:iconName }; 
        });
        globalState.tabObjects = globalState.tabObjects.concat(newTabObjs);
        globalState.gameWidth = fileContentJSON.config.height;
        globalState.gameHeight = fileContentJSON.config.width;
        globalState.gameBackgroundImage = fileContentJSON.config.backgroundImage;
        globalState.proposedBackgroundIndex = 0;
        if(backs.map(function(elem){return elem.value}).indexOf(fileContentJSON.config.backgroundImage) >= 0){
            globalState.proposedBackgroundIndex = backs.map(function(elem){return elem.value}).indexOf(fileContentJSON.config.backgroundImage);
        }

        woblocksControl.definedObjectsAsBlocklyBlocks();
        woblocksControl.loadSceneXmlContent();

        setGlobalState(globalState);
        valSetter( (val + 1) % 2);

    }

    const projectSaveAccept = function(){
        
        if(!globalState.proposedSaveName || globalState.proposedSaveName === ''){return;}

        woblocksControl.saveSceneXmlContent();

        const blob = new Blob([woblocksControl.getProjetInfoAsJSON()]);    

        const anchor = window.document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = globalState.proposedSaveName+'.wbk';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(anchor.href);

        globalState.lastUsedName = globalState.proposedSaveName;
        globalState.proposedSaveName = '';
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);

    }

    return <AppBar position="static">
        <Toolbar>
            <WoblocksLogo/>
            <ObjectTabs />
            {globalState.currentTabIndex === 0 && 
                <>

                    <DialogButton Icon = {PermDataSetting} title="Configuracion del Juego" tooltip="Configuracion del Juego" onOpen={()=>{woblocksControl.sanitizeTextInputBlocks();}} onAccept={gameConfigAccept} >
                        <GameConfig />                            
                    </DialogButton>

                    <DialogButton Icon = {CloudUpload} title="Cargar Proyecto" tooltip="Cargar Proyecto" onOpen={()=>{woblocksControl.sanitizeTextInputBlocks();}} onAccept={projectLoadAccept} >
                        <ProjectLoad />
                    </DialogButton>

                    <DialogButton Icon = {Save} title="Guardar Proyecto" tooltip="Guardar Proyecto" onOpen={()=>{woblocksControl.sanitizeTextInputBlocks();}} onAccept={projectSaveAccept}>
                        <ProjectSave />
                    </DialogButton>

                    <DialogButton Icon = {Code} title="Codigo Generado" tooltip="Codigo Generado" onOpen={()=>{woblocksControl.sanitizeTextInputBlocks();}} >
                        <GeneratedCode />                            
                    </DialogButton>
            
                    <PlayDialogButton/>
                    
                </>
            }
        </Toolbar>
    </AppBar>
}
