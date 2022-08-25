import {useState, Component} from "react"
import {Switch , SvgIcon } from "@material-ui/core/"
import { ArrowForward, ArrowBack } from '@material-ui/icons'

export default function ObjectConfigForm(props:any){

    //SLIDER FUNCTIONS/////////////////////////
    const onVisualModeChange = (event:any) => {
        props.setVisualMode( ! props.visualMode);
    }

    const setIndex = function(anIndex:any){
        props.setSliderIndex(anIndex);
    }

    const onNameChange = function(event:any){
        props.setChosenName(event.target.value);
    }
    ///////////////////////////////////////////


    //STYLES///////////////////////////////////    
    const cellStyle = {paddingLeft:"25%",paddingRight:"10%"};
    ///////////////////////////////////////////

    //console.log('ObjectConfigForm props.visualMode:'+props.visualMode+' props.sliderIndex:'+props.sliderIndex);

    return <>
        <br/>
        <br/>
        { props.editName && <div style={cellStyle} >  Nombre <input onChange={onNameChange} /> </div> }
        <br/>
        <div style={cellStyle} >{'Es Visual? '} <Switch checked={props.visualMode} onClick={onVisualModeChange}/></div>
        <br/>
        <div style={cellStyle}><Slider slides={props.representations} isVisual={props.visualMode} index={props.sliderIndex} setSliderIndex={setIndex} /> </div>
    </>
    
}

export function Slider(props:any){

    const currentSlides = props.slides.filter(function(elem:any){return (!props.isVisual) || (elem.isVisual == true)});
    if(props.index > currentSlides.length - 1){props.setSliderIndex(0);}

    const nextIndex = () => {
        if(props.index == currentSlides.length - 1){//if(currentIndex == currentSlides.length - 1){
            props.setSliderIndex(0);//setCurrentIndex(0);
        }else{
            props.setSliderIndex(props.index + 1);//setCurrentIndex(currentIndex + 1);
        }    
    }

    const previousIndex = () => {
        if(props.index == 0 ){//if(currentIndex == 0 ){
            props.setSliderIndex(currentSlides.length - 1);//setCurrentIndex(currentSlides.length - 1);
        }else{
            props.setSliderIndex(props.index - 1);//setCurrentIndex(currentIndex - 1);
        }    
    }

    //STYLES///////////////////////////////////
    const containerStyles = {
        width: "100%"
    }

    const sliderStyle = {
        height: "100%"
    }

    const slideStyle = {
        boarderRadius: "10px",
        backgroundPosition: "center",
        backgroundSize: "cover"
    }
    ///////////////////////////////////////////

    return <>
        <div style={containerStyles} >
            <table>
              
              <tr>

                <td><div onClick={previousIndex}> <SvgIcon ><ArrowBack /></SvgIcon> </div></td>
                
                <td><div style={slideStyle} > 
                    <div style={{textAlign:"center"}} >
                    
                        <>    
                        <img style={{width:"140px",height:"140px"}} src={currentSlides[props.index].icon}  />
                           {props.isVisual && 
                                <img style={{width:"140px",height:"140px"}} src={currentSlides[props.index].url} />
                            }
                        </>


                    </div>
                </div></td>
               
                <td><div onClick={nextIndex}> <SvgIcon ><ArrowForward /></SvgIcon> </div></td>
               
               </tr>

            </table>

        </div>
    </>

}
