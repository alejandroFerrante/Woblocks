import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import { useContext } from "react"
import { Close } from "@material-ui/icons"
import { Add as AddIcon } from '@material-ui/icons'
import { SvgIcon } from "@material-ui/core/"

import DialogButton from './DialogButton'

import Blockly from 'blockly';
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'

import { imagePathManager, getIconPathFor, getRepIconFor } from '../ImagePathManager'

import NewObject from './NewObject'
//import NewObjectAccept from './NewObject'

export default function ObjectTabs (props:any) {

    //const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

    const onTabSelected = (event: React.ChangeEvent<{}>,tabId: string) => {
        if(globalState.currentTabIndex !== tabId){
            console.log(tabId);
            

            //SAVE CURRENT WORKSPACE
            if(globalState.currentTabIndex == 0){
                woblocksControl.saveSceneXmlContent();
            }else{
                woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
            }

            woblocksControl.definedObjectsAsBlocklyBlocks();

            //LOAD NEW
            if(Number(tabId) == 0){
                woblocksControl.loadSceneXmlContent();
                woblocksControl.fillMessagesOfForWorkspace();
                woblocksControl.sanitizedeletedObjects();
                woblocksControl.saveSceneXmlContent();
            }else{
                woblocksControl.loadDefinedObjectXmlContent(Number(tabId) - 1);
            }
            
            woblocksControl.closeToolbox();

            globalState.currentTabIndex = Number(tabId);
            setGlobalState(globalState);
            valSetter( (val + 1) % 2);
        }
    }

    const removeItem = function(){
        woblocksControl.removeObjectOfIndex(globalState.currentTabIndex - 1);
        globalState.tabObjects.splice(  globalState.currentTabIndex ,1);
        globalState.currentTabIndex = 0;
        setGlobalState(globalState);

        woblocksControl.loadSceneXmlContent();
        woblocksControl.definedObjectsAsBlocklyBlocks();
        woblocksControl.sanitizedeletedObjects();
        woblocksControl.saveSceneXmlContent();
        var wsp:any = Blockly.getMainWorkspace(); 
        wsp.getToolbox().clearSelection(); 

        valSetter( (val + 1) % 2);
    }    

    const openConfirm = function(aTitle:string,aBody:string){
        globalState.alertState.isOpen = true;
        globalState.alertState.title = aTitle;
        globalState.alertState.body = aBody;
        globalState.alertState.mode = 'CONFIRM';
        globalState.alertState.onModalConrirm = removeItem;
        setGlobalState(globalState);
        valSetter( (val+1) % 2 );
    }

    return <>
        <Tabs 
            value={globalState.currentTabIndex}
            onChange={onTabSelected}
            variant="scrollable"
        >
        
        { globalState.tabObjects.map( function(elem:any){  
            return <Tab label = { (elem.name === 'Escena' && <WollokIcon />) || 
                    <table title={elem.name} >
                        <tr>
                        <img 
                            alt="Ícono del objeto" 
                            src={ getIconPathFor(elem.icon) || getRepIconFor(elem.icon) } 
                            style={{width:"45px",height:"45px"}}>
                        </img>
                        { 
                            <SvgIcon style={{paddingBottom:"40%",height:"20px",width:"20px"}} onClick={()=>{openConfirm('Borrar Objeto','¿Esta seguro que quiere eliminar este objeto?')}}>
                              <Close/>
                          </SvgIcon>
                          
                        }
                        </tr>
                    </table>
                } key={elem.name} >
                </Tab> }
        )}


        </Tabs>

        <DialogButton  Icon = {AddIcon} title="Nuevo Objeto" tooltip="Nuevo Objeto" onAccept={NewObjectAccept}>
            <NewObject />
        </DialogButton>

    </>  
}

function NewObjectAccept(){
        const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);

        if(!globalState.proposedNewObjName || globalState.proposedNewObjName === ''){
            return;
        }
        if(globalState.tabObjects.map(function(elem:any){return elem.name}).includes(globalState.proposedNewObjName) ){
            return;
        }
        //{chosenName, chosenRepresentation}
        const rep = globalState.selectedRepresentation

        //SAVE CURRENT WORKSPACE
        if(globalState.currentTabIndex == 0){
            woblocksControl.saveSceneXmlContent();
        }else{
            woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
        }

        //ADD TAB OBJ
        globalState.tabObjects.push( {name:globalState.proposedNewObjName , icon:rep.name} );

        //SELECT TAB
        globalState.currentTabIndex = globalState.tabObjects.length - 1;

        //ADD OBJ DATA
        woblocksControl.addObjectNamed(globalState.proposedNewObjName, rep.name,rep.isVisual);

        //LOAD NEW WORKSPACE
        var repImage = (globalState.proposedNewObjIsVisual)? rep.alias : null;//if visual add the image method to the block construct
        woblocksControl.addDefaultObjectXmlToWorkspaceWithNameAndImage    (globalState.proposedNewObjName, repImage);//this clears the workspace

        //SAVE OBJ WORKSPACE INFO
        woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
        woblocksControl.setObjectInfoOfIndex(globalState.currentTabIndex - 1, rep.name,globalState.proposedNewObjIsVisual);

        woblocksControl.closeToolbox();

        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
    
}