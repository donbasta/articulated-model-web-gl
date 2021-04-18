import React, {useEffect} from 'react';
import './slider.css';
import { useState } from 'react';
const Slider = (props) => {
    const [slider, setSlider] = useState({
        value: props.value,
    })

    useEffect(() => {
        setSlider({
            value: props.value
        });
    }, [props.value]);


    const onSlide = (e) => {
        setSlider({
            value: e.target.value
        });
        props.onChange(slider.value);
    }
    //tambahin state value sama onSlide
    return (
        <div className="slidecontainer">
            <input 
                type="range" 
                min={props.min} 
                max={props.max} 
                value={slider.value} 
                onInput={onSlide}
                className="slider"
            >
            </input>
            {props.show ? 
                <p>Value: {slider.value}</p>
                :
                ""
            }
        </div>
    )
}

export default Slider;