"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import type { ScenarioNode } from "../types/scenario";
import { CustomNode } from "./custom-node";
import { NodeEditForm } from "./node-edit-form";

const nodeTypes: NodeTypes = {
  scenarioNode: (props) => (
    <CustomNode
      {...props}
      onEdit={props.data.onEdit}
      onPlay={props.data.onPlay}
    />
  ),
};

const initialEdges: Edge[] = [];

interface ScenarioEditorProps {
  onNodeSelect: (node: ScenarioNode) => void;
  selectedNodeId: string | null;
}

export function ScenarioEditor({
  onNodeSelect,
  selectedNodeId,
}: ScenarioEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [editingNode, setEditingNode] = useState<ScenarioNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 시나리오 노드 데이터를 API에서 fetch
  React.useEffect(() => {
    fetch("/api/scenarios")
      .then((res) => res.json())
      .then((data) => setNodes(data))
      .catch((err) => console.error("시나리오 데이터 불러오기 실패:", err));
  }, [setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.data as ScenarioNode);
    },
    [onNodeSelect]
  );

  const handleNodeEdit = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setEditingNode(node.data as ScenarioNode);
        setIsDialogOpen(true);
      }
    },
    [nodes]
  );

  const handleNodePlay = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        onNodeSelect(node.data as ScenarioNode);
        console.log("재생:", node.data.title);
      }
    },
    [nodes, onNodeSelect]
  );

  const handleNodeSave = useCallback(
    (updatedNode: ScenarioNode) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === updatedNode.id
            ? {
                ...node,
                data: updatedNode,
              }
            : node
        )
      );
      console.log("노드 저장됨:", updatedNode);
    },
    [setNodes]
  );

  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "scenarioNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        id: `node-${Date.now()}`,
        title: "새 시나리오",
        type: "story",
        intro: {
          text: "내용을 입력하세요...",
        },
        choices: [],
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 노드에 편집/재생 핸들러 추가
  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onEdit: handleNodeEdit,
      onPlay: handleNodePlay,
    },
    selected: node.id === selectedNodeId,
  }));

  // 모든 노드 데이터 추출 (편집 폼에서 사용)
  const allNodesData = nodes.map((node) => node.data as ScenarioNode);

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-10 space-x-2">
        <button
          onClick={addNewNode}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          노드 추가
        </button>
      </div>

      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>

      <NodeEditForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        node={editingNode}
        onSave={handleNodeSave}
        allNodes={allNodesData}
      />
    </div>
  );
}
