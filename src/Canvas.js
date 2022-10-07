import React, {Component, useState, useRef, useCallback} from "react";
import ReactFlow, {
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    addEdge,
    Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import SideBar from "./Components/SIdeBar";

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function Canvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const onConnect = useCallback(
        (params) => setEdges((edges) => addEdge(params, edges)),
        []
    );
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || type === null) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {label: `${type} node`},
            };

            setNodes((nodes) => nodes.concat(newNode));
        },
        [reactFlowInstance]
    );

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onEdgesChange={onEdgesChange}
                        onNodesChange={onNodesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onLoad={setReactFlowInstance}
                        onInit={setReactFlowInstance}
                        fitView
                    >
                        <Controls/>
                    </ReactFlow>
                </div>
                <SideBar/>
            </ReactFlowProvider>
        </div>
    );
}
