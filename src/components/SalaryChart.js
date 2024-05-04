import React from 'react';
import * as d3 from 'd3';

export function PersonalityIncomeChart(props) {
    const { offsetX, offsetY, height, width, data, highlightedMBTI, setHighlightedMBTI } = props;
    const [tooltipData, setTooltipData] = React.useState(null);
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const [highlightedBar, setHighlightedBar] = React.useState(null);
    const margin = { top: 20, right: 60, bottom: 30, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(data.labels)
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data.datasets[0].data)])
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const bars = data.labels.map((d, i) => (
        <rect
            key={d}
            x={margin.left + xScale(d)}
            y={margin.top + yScale(data.datasets[0].data[i])}
            width={xScale.bandwidth()}
            height={innerHeight - yScale(data.datasets[0].data[i])}
            fill={data.datasets[0].backgroundColor[i]}
            onMouseEnter={() => {
                setTooltipData({ label: d, value: `Salary: ${data.datasets[0].data[i]}` });
                setTooltipVisible(true);
                setHighlightedBar(i);
                setHighlightedMBTI(d);
            }}
            onMouseLeave={() => {
                setTooltipVisible(false);
                setHighlightedBar(null);
                setHighlightedMBTI(null);
            }}
            strokeWidth={(highlightedBar === i || highlightedMBTI === d) ? "4" : "0.5"}
            stroke={(highlightedBar === i || highlightedMBTI === d) ? "red" : "none"}

        />
    ));

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${offsetX}, ${offsetY})`}>
                {bars}
                <g transform={`translate(45, ${innerHeight + margin.top})`}>
                    <g ref={node => d3.select(node).call(xAxis)} />
                </g>
                <g transform={`translate(${margin.left}, 20)`}>
                    <g ref={node => d3.select(node).call(yAxis)} />
                </g>
            </g>
            {tooltipVisible && tooltipData && (
            <>
                <rect
                    x={margin.left + xScale(tooltipData.label) + xScale.bandwidth() / 2 - 50}
                    y={margin.top + yScale(data.datasets[0].data[data.labels.indexOf(tooltipData.label)]) - 20 }
                    width="100"
                    height="20"
                    fill="grey"
                    // stroke="black"
                    // strokeWidth="0.5"
                    rx="5"
                />
                <text
                    x={margin.left + xScale(tooltipData.label) + xScale.bandwidth() / 2 }
                    y={margin.top + yScale(data.datasets[0].data[data.labels.indexOf(tooltipData.label)]) - 5}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                >
                    {tooltipData.value}
                </text>
            </>
            )}
        </svg>
    );
}
