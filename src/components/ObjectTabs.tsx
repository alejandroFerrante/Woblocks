import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import AddObjectDialogButton from "./AddObjectDialogButton"
import { WollokObject } from "../models/WollokObject"
import { useState , useReducer} from "react"
import { Whatshot } from "@material-ui/icons"

import EventEmitter from './eventEmitter'

export default function ObjectTabs (props:any) {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const mainTab = new WollokObject("stub", WollokIcon)
    //new WollokObject("fueguito", Whatshot)
    //const wollokObjs = [mainTab] // TODO: this is an example, should be taken from global state
    
    const [wollokObjs,setWollokObjs] = useState([mainTab]);
    const [currentTabId, setCurrentTabId] = useState(mainTab.id()) // TODO: probably this should be global state
    

    const onTabSelected = (event: React.ChangeEvent<{}>,tabId: string) => {
        console.log('onTabSelected');
        if(tabId != currentTabId){
            EventEmitter.emit('TabSwitch', { previous:wollokObjs.map(function(elem){return elem.name} ).indexOf(currentTabId) , new:wollokObjs.map(function(elem){return elem.name} ).indexOf(tabId) , currentObjectName:tabId} );
            setCurrentTabId(tabId)
        }
    }

    const AddTab = (chosenName:string) => {
        //if(!wollokObjs.map(function(elem){return elem.name }).includes(chosenName) ){
            setWollokObjs(wollokObjs.concat([new WollokObject(chosenName, Whatshot)]));
            setCurrentTabId(chosenName);
            forceUpdate();
    }


    const listener = EventEmitter.once('CreateTab',AddTab);

    return <>
        <Tabs 
            value={currentTabId}
            onChange={onTabSelected}
            variant="scrollable"
        >
            {wollokObjs.map( wollokObject => 
                <Tab 
                    value={wollokObject.id()}
                    icon={<wollokObject.Icon/>} 
                    key={wollokObject.id()}
                />
            )}
        </Tabs>
        <AddObjectDialogButton openCreateObjectModal={props.openCreateObjectModal} />
    </>  
}