import { useContext, useEffect, useRef } from "react"
import woblocksControl from "../models/woblocksControl"
import WBContext from "../WBContext"
import 'wollok-game-web'

export default function PlayGame() {
    const { globalState } = useContext(WBContext)
    const divRef = useRef<any>();

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

        new Game(project).start(divRef.current)
    }, [divRef.current])

    return <div ref={divRef} />
}