import React from "react";
import { scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";

export function BarChart(props) {
    const { offsetX, offsetY, height, width, data, clickedCountry } = props;
    const personalityTypes = Object.keys(data[0]).slice(1);
    const maxProportion = Math.max(...data.map(d => Math.max(...personalityTypes.map(type => +d[type]))));
    const xScale = scaleLinear().range([0, width]).domain([0, maxProportion]).nice();
    const yScale = scaleBand().range([0, height]).domain(personalityTypes).padding(0.2);
    const textX = offsetX - 20 + width / 2;
    const textY = offsetY - 10;

    if (!clickedCountry) {
        return (
            <g transform={`translate(${offsetX}, ${offsetY})`}>
                <YAxis yScale={yScale} height={height} offsetX={offsetX} />
                <XAxis xScale={xScale} width={width} height={height} />
            </g>
        );
    }

    const selectedCountryData = data.find(d => d.Country === clickedCountry.properties.name);
    let barData = [];
    if (selectedCountryData) {
        barData = Object.entries(selectedCountryData)
            .filter(([key, value]) => key !== "Country")
            .map(([key, value]) => ({ type: key, proportion: +value }));
    }

    return (
        <g>
            <text x={textX} y={textY} textAnchor="middle" fontWeight="bold">{clickedCountry.properties.name}</text>
            <g transform={`translate(${offsetX}, ${offsetY})`}>
                {barData.map(d => (
                    <rect
                        key={d.type}
                        x={0}
                        y={yScale(d.type)}
                        width={xScale(d.proportion)}
                        height={yScale.bandwidth()}
                        stroke="black"
                        fill={getFillColor(d.type)}
                    />
                ))}
                <YAxis yScale={yScale} height={height} offsetX={offsetX} />
                <XAxis xScale={xScale} width={width} height={height} />
            </g>
        </g>
    );
}

function getFillColor(personalityType) {
    switch (personalityType) {
        case "INTJ":
        case "INTP":
        case "ENTJ":
        case "ENTP":
            return '#CAB8E0'; //purple
        case "INFJ":
        case "INFP":
        case "ENFJ":
        case "ENFP":
            return '#B2CF99'; //green
        case "ISTJ":
        case "ISFJ":
        case "ESTJ":
        case "ESFJ":
            return '#9FD3DF'; //blue
        case "ISTP":
        case "ISFP":
        case "ESTP":
        case "ESFP":
            return '#F5E09D'; //yellow
        default:
            return "#992a5b"; // Default color
    }
}