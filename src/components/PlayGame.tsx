import { Button } from "@material-ui/core"
import { useContext, useEffect, useRef, useState } from "react"
import woblocksControl from "../models/woblocksControl"
import WBContext from "../WBContext"
import 'wollok-game-web'

export default function PlayGame() {
    const { globalState } = useContext(WBContext)
    const divRef = useRef<any>();

    let p5: p5 | null = null
    const stop = () => {
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
            description: "HOLA SOY UNA DESCRIPCION"
        }

        p5 = new Game(project).start(divRef.current)
        return stop
    }, [divRef.current])

    return <div ref={divRef} />
}