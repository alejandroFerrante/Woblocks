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
        console.log(p5);
        p5?.remove()
    }

    useEffect(() => {
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
        console.log('!!!! '+globalState.wkGame);
        setGlobalState(globalState);
        valSetter( (val + 1) % 2);
        return stop
    }, [divRef.current])

    return <>
        <button onClick={stop}>STOP</button>
        <div ref={divRef} />
        </>
}