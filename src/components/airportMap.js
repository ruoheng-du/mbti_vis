import React, { useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import chroma from 'chroma-js';
import { scaleLinear } from "d3-scale";


function AirportMap(props){
    const {width, height, countries, distribution, onCountryClick, selectedPersonality} = props;
    const [clickedCountry, setClickedCountry] = useState(null);
    // console.log(selectedPersonality);

    let projection = geoMercator();
    projection.scale(97)
            .translate([width / 2, height / 2 + 20]);
    let path = geoPath().projection(projection);

    const handleClick = (country) => {
        setClickedCountry(country); // Set the clicked country in the state
        onCountryClick(country); // Invoke the callback function passed from the parent
    };

    const Legend = () => (
        <div>
            <div>
                <span style={{ backgroundColor: chroma(getColor(selectedPersonality)).saturate(100).hex(), width: 20, height: 20, display: 'inline-block', marginRight: 5 }}></span>
                <span>Low Saturation</span>
            </div>
            <div>
                <span style={{ backgroundColor: chroma(getColor(selectedPersonality)).saturate(500).hex(), width: 20, height: 20, display: 'inline-block', marginRight: 5 }}></span>
                <span>High Saturation</span>
            </div>
        </div>
    );

    function getColor(personalityType) {
        switch (personalityType) {
            case "INTJ":
            case "INTP":
            case "ENTJ":
            case "ENTP":
                return "purple"; //purple
            case "INFJ":
            case "INFP":
            case "ENFJ":
            case "ENFP":
                return "green"; //green
            case "ISTJ":
            case "ISFJ":
            case "ESTJ":
            case "ESFJ":
                return "blue"; //blue
            case "ISTP":
            case "ISFP":
            case "ESTP":
            case "ESFP":
                return "yellow"; //yellow
            default:
                return "#eee"; // Default color
        }
    }

    function getSaturation(personalityType) {
        switch (personalityType) {
            case "INTJ":
            case "INTP":
            case "ENTJ":
            case "ENTP":
                return 400; //purple
            case "INFJ":
            case "INFP":
            case "ENFJ":
            case "ENFP":
                return 500; //green
            case "ISTJ":
            case "ISFJ":
            case "ESTJ":
            case "ESFJ":
                return 200; //blue
            case "ISTP":
            case "ISFP":
            case "ESTP":
            case "ESFP":
                return 600; //yellow
            default:
                return 100; // Default color
        }
    }

    function getRange(personalityType) {
        switch (personalityType) {
            case "INTJ":
            case "INTP":
            case "ENTJ":
            case "ENTP":
                return [0, 0.03]; //purple
            case "INFJ":
            case "INFP":
            case "ENFJ":
            case "ENFP":
                return [0, 0.5]; //green
            case "ISTJ":
            case "ISFJ":
            case "ESTJ":
            case "ESFJ":
                return [0, 0.5]; //blue
            case "ISTP":
            case "ISFP":
            case "ESTP":
            case "ESFP":
                return [0, 0.03]; //yellow
            default:
                return [0, 0.5]; // Default color
        }
    }

    const getFillColor = (country) => {
        const countryName = country.properties.name;
        if (distribution && selectedPersonality) {
            const countryData = distribution.find((item) => item.Country === countryName);
            if (countryData) {
                const proportion = countryData[selectedPersonality];
                if (proportion) {
                    const minProportion = Math.min(...distribution.map(item => item[selectedPersonality]));
                    const maxProportion = Math.max(...distribution.map(item => item[selectedPersonality]));
                    const scale = scaleLinear().domain([maxProportion, minProportion]).range(getRange(selectedPersonality));
                    const saturation = scale(proportion);
                    const color = chroma(getColor(selectedPersonality)).saturate(saturation * getSaturation(selectedPersonality)).hex();
                    return color;
                }
            }
        }
        return "#eee";
    };

    return (
            <g>
                {countries.features.map((d) => (
                    <path
                        key={d.properties.name}
                        d={path(d)}
                        stroke={clickedCountry === d ? "#000" : "#ccc"}
                        strokeWidth={clickedCountry === d ? 3 : 1}
                        fill={getFillColor(d)}
                        onClick={() => handleClick(d)}
                        style={{
                            filter: clickedCountry === d ? "none" : "drop-shadow(0 0 5px rgba(0,0,0,0.3))",
                        }}
                    ></path>
                ))}
            </g>
            
    );


}

export { AirportMap }