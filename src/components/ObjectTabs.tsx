import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import AddObjectDialogButton from "./AddObjectDialogButton"
import { WollokObject } from "../models/WollokObject"
import { useState , useReducer, useContext} from "react"
import { Close } from "@material-ui/icons"
import {SvgIcon} from "@material-ui/core/"

import Blockly from 'blockly';
import WBContext from '../WBContext'
import woblocksControl from '../models/woblocksControl'


import {imagePathManager, getIconPathFor, getRepIconFor, getAllSprites} from '../ImagePathManager'

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
            
            var wsp:any = Blockly.getMainWorkspace(); 
            wsp.getToolbox().clearSelection(); 

            globalState.currentTabIndex = Number(tabId);
            setGlobalState(globalState);
            valSetter( (val + 1) % 2);
        }
    }

    const removeItem = function(){
        console.log('HERE');

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


    const elems = [{name:'banana'},{name:'manzana'}];

    return <>
        <Tabs 
            value={globalState.currentTabIndex}
            onChange={onTabSelected}
            variant="scrollable"
        >


        { globalState.tabObjects.map( function(elem:any){  
            return <Tab label={
                    <table title={elem.name} >
                        <tr>
                        <img src={ ((getIconPathFor(elem.icon) != '') && getIconPathFor(elem.icon) ) || getRepIconFor(elem.icon)} style={{width:"45px",height:"45px"}}></img>
                        { (elem.name != 'Escena') && 
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

        <AddObjectDialogButton />
    </>  
}

/*
        { globalState.tabObjects.map( function(elem:any){  
            return <Tab label={elem.name} key={elem.name} ></Tab> }
        )}
*/