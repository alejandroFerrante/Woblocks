import { AppBar, Dialog, DialogProps, Toolbar, Typography,Button } from '@material-ui/core'
import {WarningRounded} from '@material-ui/icons'
import {useState, useContext} from 'react';

import WBContext from '../WBContext'

export default function AlertModal(){


	const {globalState, setGlobalState, val, valSetter} = useContext(WBContext);
	

	const closeModalFunc = function(){
		globalState.alertState.isOpen = false;
		setGlobalState(globalState);
		valSetter( (val+1) % 2 );
	}

	const onAlertRendered = function(aDiv:any){
		console.log('onAlertRendered '+aDiv);
		if(aDiv){
			aDiv.innerHTML = globalState.alertState.body;
		}
	}

	return <>
	<Dialog onClick={() => {if(globalState.alertState.mode == 'WARNING'){closeModalFunc()} } } open={globalState.alertState.isOpen} >
	    <AppBar position="static">
	    	<Typography><b>
	        	<div style={{textAlign:"center"}}>{globalState.alertState.title}</div>
	        </b></Typography>
	    </AppBar>
	    <div style={{textAlign:"center"}}>
	    	<WarningRounded style={{width:"80px", height:"80px"}} />

	    <br/>
	    </ div>
	    	<div style={{alignSelf:"center",paddingLeft:"5%",overflow:"auto",textAlign:"center"}} ref={onAlertRendered} ></div>
	    <br/>
	    <br/>
	    {	(globalState.alertState.mode == 'CONFIRM') &&
		    <table><td style={{textAlign:"center"}}>
			    <Button variant="outlined"  onClick={closeModalFunc} >No</Button>
			    <Button variant="contained" onClick={()=>{globalState.alertState.onModalConrirm();closeModalFunc();}} >Si</Button>
		    </td></table>
		}
	    
    </Dialog>
    </>

}
