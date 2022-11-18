import { Button } from "@material-ui/core"
import { useContext, useEffect, useRef, useState } from "react"
import woblocksControl from "../models/woblocksControl"
import WBContext from "../WBContext"
import 'wollok-game-web'

export default function PlayGame() {
    const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
    const divRef = useRef<any>();

    let p5: p5 | null = null
    const stop = () => {
        p5?.remove()
    }

    useEffect(() => {
        doWorkspaceSave();

        const myProgramStr = woblocksControl.getExecutionString()
        const sources = woblocksControl.buildWkProgramSourceFor(myProgramStr)

        console.log({ sources })

        const project = {
            main: 'main',
            images: globalState.wkImages,
            sounds: [],
            sources,
            description: ""
        }

        p5 = new Game(project).start(divRef.current)
        globalState.wkGame = p5;
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
        return stop
    }, [divRef.current])

    const doWorkspaceSave = () => {
            if(globalState.currentTabIndex === 0){
                woblocksControl.saveSceneXmlContent();
            }else{
                woblocksControl.saveObjectTabXmlContentWithIndex(globalState.currentTabIndex - 1);
            }
            woblocksControl.definedObjectsAsBlocklyBlocks();
            woblocksControl.unselectAllBlocks();
            woblocksControl.closeToolbox();
    }

    return <>
        <div ref={divRef} />
        </>
}