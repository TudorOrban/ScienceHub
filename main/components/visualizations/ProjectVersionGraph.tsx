"use client";

import { Graph, ProjectGraph, ProjectSubmissionSmall } from "@/types/versionControlTypes";
import { useEffect, useRef, useState } from "react";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import deepEqual from "fast-deep-equal";

interface ProjectVersionGraphProps {
    projectGraph: ProjectGraph;
    selectedVersionId: string;
    selectedSubmission?: ProjectSubmissionSmall;
    handleSelectGraphNode: (versionId: string) => void;
    expanded: boolean;
    className?: string;
}

const ProjectVersionGraph: React.FC<ProjectVersionGraphProps> = (props) => {
    // States
    const [processedNodesState, setProcessedNodesState] = useState<ProcessedNode[]>([]);
    const [processedEdgesState, setProcessedEdgesState] = useState<ProcessedEdge[]>([]);

    // Refs
    const ref = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const { processedNodes, processedEdges } = preprocessGraphData(
            props.projectGraph.graphData
        );

        if (!deepEqual(processedNodes, processedNodesState)) {
            setProcessedNodesState(processedNodes);
        }

        if (!deepEqual(processedEdges, processedEdgesState)) {
            setProcessedEdgesState(processedEdges);
        }
    }, [props.projectGraph.graphData]);

    useEffect(() => {
        if (props.projectGraph) {
            const horizontalSpacing = 60;
            const verticalSpacing = 24;
            const margin = 20;

            const maxDepth = max(processedNodesState, (d) => d.depth)!;
            const maxLane = max(processedNodesState, (d) => d.lane)!;

            const width = maxDepth * horizontalSpacing + margin * 2 + 20 || 600;
            const height = maxLane * verticalSpacing + margin * 2 || 120;

            const xScale = scaleLinear()
                .domain([0, maxDepth])
                .range([margin, width - margin]);

            const yScale = scaleLinear()
                .domain([0, maxLane])
                .range([margin, height - margin]);

            const svg = select(ref.current).attr("width", width).attr("height", height);

            svg.selectAll("*").remove(); // Clear previous rendering

            svg.selectAll("path")
                .data<ProcessedEdge>(processedEdgesState)
                .enter()
                .append("path")
                .attr("d", (d) => {
                    const startX = xScale(d.source.depth);
                    const startY = yScale(d.source.lane);
                    const endX = xScale(d.target.depth);
                    const endY = yScale(d.target.lane);
                    let path = "";

                    if (
                        d.source.hasMultipleNeighbors ||
                        d.target.hasMultipleNeighbors ||
                        d.source.lane !== d.target.lane
                    ) {
                        // Adjust control points based on lane change
                        const laneChange = d.target.lane - d.source.lane;
                        const controlX = (startX + endX) / 2 - laneChange * 10;
                        const controlY = (startY + endY) / 2 + laneChange * 10;
                        path = `M${startX},${startY} S${controlX},${controlY} ${endX},${endY}`;
                    } else {
                        path = `M${startX},${startY} L${endX},${endY}`;
                    }

                    return path;
                })
                .attr("stroke", "#CCCCCC")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            svg.selectAll("circle")
                .data(processedNodesState)
                .enter()
                .append("circle")
                .attr("cx", (d) => xScale(d.depth))
                .attr("cy", (d) => yScale(d.lane))
                .attr("r", 5)
                .attr("fill", (d) =>
                    d.id === props.selectedVersionId
                        ? "#222FFF"
                        : d.id === props.selectedSubmission?.initialProjectVersionId?.toString() ||
                          d.id === props.selectedSubmission?.finalProjectVersionId?.toString()
                        ? "#8eAb90"
                        : "#3ebd42"
                )
                .attr("stroke", "#EEEEEEE")
                .attr("stroke-width", 1)
                .on("click", (event, d) => {
                    props.handleSelectGraphNode(d.id);
                });

            svg.selectAll("text")
                .data(processedNodesState)
                .enter()
                .append("text")
                .attr("x", (d) => xScale(d.depth) + 8)
                .attr("y", (d) => yScale(d.lane) - 10)
                .text((d) => d.id)
                .attr("font-family", "'Helvetica Neue', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "#EEEEEE");
        }
    }, [
        processedNodesState,
        processedEdgesState,
        props.selectedVersionId,
        props.projectGraph,
        props.handleSelectGraphNode,
        props.expanded,
    ]);

    return (
        <div className={`relative ${props.className || ""}`}>
            {props.expanded && props.projectGraph && (
                <div className="relative">
                    {/* <div className="flex justify-center font-semibold text-xl p-2">
                        Project Graph
                    </div> */}
                    <div
                        ref={containerRef}
                        style={{ maxWidth: "800px", maxHeight: "200px" }}
                        className="h-full rounded-md overflow-x-auto overflow-y-auto shadow-md bg-gray-800 border border-gray-200"
                    >
                        <svg ref={ref} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectVersionGraph;

type ProcessedNode = {
    id: string;
    depth: number;
    lane: number;
    hasMultipleNeighbors?: boolean;
};

type ProcessedEdge = {
    source: ProcessedNode;
    target: ProcessedNode;
};

type ProcessedOutput = {
    processedNodes: ProcessedNode[];
    processedEdges: ProcessedEdge[];
};

const preprocessGraphData = (graph: Graph): ProcessedOutput => {
    let processedNodes: ProcessedNode[] = [];
    let depth = 1;
    const visited = new Set<string>();
    let lane = 1;
    let laneDepthMap: { [depth: number]: number } = {};

    const visitNode = (nodeId: string, depth: number, parentId: string | null) => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        // Determine lane
        while (laneDepthMap[lane] >= depth) {
            lane++;
        }
        laneDepthMap[lane] = depth;

        // Add the processed node
        processedNodes.push({
            id: nodeId,
            depth,
            lane,
            hasMultipleNeighbors: (graph || [])[nodeId]?.neighbors.length > 1,
        });

        // Visit neighbors
        const neighbors = (graph || [])[nodeId]?.neighbors.filter((n) => n !== parentId) || [];
        neighbors.forEach((neighbor) => {
            visitNode(neighbor, depth + 1, nodeId);
        });
    };

    // Assume "1" is always the root
    visitNode("1", depth, null); 

    // Generate edges without duplicates
    const processedEdges: ProcessedEdge[] = [];
    processedNodes.forEach((source) => {
        const neighbors = (graph || [])[source.id]?.neighbors || [];
        neighbors.forEach((neighborId) => {
            const target = processedNodes.find((n) => n.id === neighborId);
            if (target && source.depth < target.depth) {
                processedEdges.push({ source, target });
            }
        });
    });

    return { processedNodes, processedEdges };
};
