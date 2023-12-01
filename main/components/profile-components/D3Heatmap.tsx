// D3Heatmap.tsx
"use client";

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

type ActivityData = {
  date: string;
  count: number;
  type: 'experiment' | 'datasetUpload';
};

interface D3HeatmapProps {
  data: ActivityData[];
}

function D3Heatmap({ data }: D3HeatmapProps) {
    // const ref = useRef(null);
    // const activityTypes = ['experiment', 'datasetUpload'];

    // const numDates = new Set(data.map(d => d.date)).size; 
    // const cellSize = 20; // You can adjust this based on your preference
    // const width = 12 * cellSize;
    // const height = 12 * cellSize;

    // useEffect(() => {
    //     const svg = d3.select(ref.current)
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    //     const tooltip = d3.select(ref.current)
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    //     const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(data, d => d.count) || 0]);

    //     const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //     const numWeeks = d3.timeWeek.count(d3.min(data, d => new Date(d.date))!, d3.max(data, d => new Date(d.date))!) + 1;
    //     const xScale = d3.scaleBand().domain(Array.from({ length: numWeeks }, (_, i) => i.toString())).range([0, width]).padding(0.1);

    //     const yScale = d3.scaleBand().domain(daysOfWeek).range([0, height]).padding(0.1);

    //     const xAxis = d3.axisTop(xScale).tickValues(xScale.domain().filter((_, i) => i % 4 === 0));  // Show every 4th week for clarity
    //     svg.append("g").call(xAxis);
    //     const yAxis = d3.axisLeft(yScale);
    //     svg.append("g").call(yAxis);

    //     svg.selectAll("rect")
    //     .classed('heatmap-rect', true);  // Add this line

    //     svg.selectAll("rect")
    //         .data(data)
    //         .enter()
    //         .append("rect")
    //         .attr("x", d => xScale(String(d3.timeWeek.count(new Date(data[0].date), new Date(d.date)))) || 0)
    //         .attr("y", d => yScale(daysOfWeek[new Date(d.date).getDay()]) || 0)
    //         .attr("width", xScale.bandwidth())
    //         .attr("height", yScale.bandwidth())
    //         .attr("fill", d => colorScale(d.count))
    //         .on("mouseover", function(event, d) {
    //             // Lighten the existing color
    //             let currentColor = d3.color(colorScale(d.count));
    //             let lighterColor = (currentColor as any).brighter(0.35); // Adjust the brightness value as needed
    //             d3.select(this).style("fill", lighterColor);
            
    //             // Interrupt any ongoing transitions on the tooltip to make it immediately visible
    //             tooltip.interrupt()
    //                 .style("opacity", 0.9)
    //                 .html(`Date: ${d.date}<br/>Projects: ${d.count}`)
    //                 .style("left", (event.clientX + 5) + "px")
    //                 .style("top", (event.clientY - 28) + "px");
    //         })
            
    //         .on("mouseout", function(d) {
    //             // Reset the color
    //             d3.select(this).style("fill", colorScale(d.count));
            
    //             // Interrupt any ongoing transitions and fade out the tooltip
    //             tooltip.interrupt()
    //                 .transition()
    //                 .duration(500)
    //                 .style("opacity", 0);
    //         })
            
    //         .append("title")
    //         .text(d => `${d.date}: ${d.count} activities`);

    //     return () => {
    //         svg.remove();
    //         return undefined;
    // };

    // }, [data]);

    // return <div ref={ref}></div>;
    return null;
}

export default D3Heatmap;
