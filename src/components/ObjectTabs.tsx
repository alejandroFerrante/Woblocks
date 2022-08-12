import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import AddObjectDialogButton from "./AddObjectDialogButton"
import { WollokObject } from "../models/WollokObject"
import { useState , useReducer, useContext} from "react"
import { Whatshot } from "@material-ui/icons"

import WBContext from '../WBContext'


export default function ObjectTabs (props:any) {

    //const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const {globalState, setGlobalState} = useContext(WBContext);

    const onTabSelected = (event: React.ChangeEvent<{}>,tabId: string) => {
        globalState.currentTab = tabId;
        setGlobalState(globalState);
        //forceUpdate();
    }


    return <>
        <Tabs 
            value={globalState.currentTabIndex}
            onChange={onTabSelected}
            variant="scrollable"
        >

        { globalState.tabObjects.map(function(elem:any){ <Tab value={elem.name} key={elem.name} > {elem.name} </Tab> }) }

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