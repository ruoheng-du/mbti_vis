import React from "react";
import * as d3 from 'd3'

export function Heatmap(props) {
  const { width, height, data, setHighlightedMBTI, highlightedMBTI } = props;
  const margin = { top: 30, right: 0, bottom: 10, left: 55 };
  const [hoveredCell, setHoveredCell] = React.useState(null);

  React.useEffect(() => {
      if (hoveredCell) {
          setHighlightedMBTI(hoveredCell.MBTI);
      } else {
          setHighlightedMBTI(null);
      }
  }, [hoveredCell, setHighlightedMBTI]);

  if (!data) {
      return <pre>Loading...</pre>;
  };

  const xScale = d3.scaleBand()
      .domain(data.map(d => d.MBTI))
      .range([0, width - 145])
      .paddingInner(0.1);

  const yScale = d3.scaleBand()
      .domain(Object.keys(data[0]).filter(d => d !== "MBTI"))
      .range([0, height - 50])
      .paddingInner(0.1);

  const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d3.max(Object.values(d).filter(val => typeof val === 'number')))]);

  function Cell({ d, xScale, yScale, color }) {
      console.log(xScale.bandwidth());

      return (
          <g transform={`translate(${xScale(d.MBTI)}, ${yScale(d.Zodiac)})`}
              onMouseEnter={() => setHoveredCell(d)}
              onMouseLeave={() => setHoveredCell(null)}>
              <rect width={xScale.bandwidth()}
                  height={yScale.bandwidth()}
                  fill={color}
                  stroke={(d.MBTI === highlightedMBTI) ? 'red' : 'none'}
                  strokeWidth={(d.MBTI === highlightedMBTI) ? 4 : 0} />
          </g>
      );
  }

  return (
      <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data.map(d => (
              Object.keys(d).map(key => {
                  if (key !== "MBTI") {
                      return (
                          <Cell
                              key={d.MBTI + "-" + key}
                              d={{ MBTI: d.MBTI, Zodiac: key }}
                              xScale={xScale}
                              yScale={yScale}
                              color={colorScale(d[key])}
                          />
                      );
                  }
                  return null;
              })
          ))}
          <g className="axis axis-x" ref={node => d3.select(node).call(d3.axisTop(xScale))} />
          <g className="axis axis-y" ref={node => d3.select(node).call(d3.axisLeft(yScale))} />
          <style>{`.axis-x text {font-size: 8px;}
                      .axis-y text {font-size: 8px;}
                      `}</style>
      </g>
  );
}
