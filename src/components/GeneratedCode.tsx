import woblocksControl from '../models/woblocksControl'

export default function GeneratedCode(){

	const onComponentRendered = function(aDiv:any){
		if(aDiv){
        	aDiv.innerHTML = woblocksControl.simpleFormatter( woblocksControl.getExecutionString(),true);;
		}
	}

	return <>
	    <br/>
	    <div style={{alignSelf:"center",paddingLeft:"5%",overflow:"auto",width:"80%",textAlign:"left"}} ref={onComponentRendered} ></div>
	    <br/>
    </>

}
