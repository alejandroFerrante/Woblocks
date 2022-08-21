import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import AddObjectDialogButton from "./AddObjectDialogButton"
import { WollokObject } from "../models/WollokObject"
import { useState , useReducer, useContext} from "react"
import { Whatshot } from "@material-ui/icons"

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

    

    const elems = [{name:'banana'},{name:'manzana'}];

    return <>
        <Tabs 
            value={globalState.currentTabIndex}
            onChange={onTabSelected}
            variant="scrollable"
        >


        { globalState.tabObjects.map( function(elem:any){  
            return <Tab label={elem.name} key={elem.name} ></Tab> }
        )}

        </Tabs>

        <AddObjectDialogButton />
    </>  
}

/*
        { globalState.tabObjects.map(function(elem:any){ <Tab value={elem.name} icon={elem.icon} key={elem.name} /> }) }

            { globalState.tabObjects.map( wollokObject => 
                <Tab 
                    value={wollokObject.id()}
                    icon={<wollokObject.Icon/>} 
                    key={wollokObject.id()}
                />
            )}
*/