"use client"

import type React from "react"
import { useCallback, useState } from "react"
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
} from "reactflow"
import "reactflow/dist/style.css"
import type { ScenarioNode } from "../types/scenario"
import { CustomNode } from "./custom-node"
import { NodeEditForm } from "./node-edit-form"

const nodeTypes: NodeTypes = {
  scenarioNode: (props) => <CustomNode {...props} onEdit={props.data.onEdit} onPlay={props.data.onPlay} />,
}

// 시나리오 데이터 - 연결 정보 추가
const initialNodes: Node[] = [
  {
    id: "crossroad-teen",
    type: "scenarioNode",
    position: { x: 250, y: 25 },
    data: {
      id: "crossroad-teen",
      title: "규칙이란 무엇인가?",
      intro: {
        text: "새벽 2시, 차가 없는 횡단보도 앞. 친구는 무단횡단을 하자고 한다.",
        image_prompt:
          "empty crosswalk at night, red traffic light, two middle school students waiting, urban street in silence",
      },
      choices: [
        {
          id: "wait",
          text: "신호가 바뀔 때까지 기다린다",
          result: "나는 규칙이란 나 자신과의 약속일지도 모른다고 생각했다.",
          nextNodeId: "become-president",
        },
        {
          id: "cross",
          text: "그냥 건넌다",
          result: "나는 법이란 상황에 따라 바뀌어야 한다고 생각했다.",
          nextNodeId: "become-president",
        },
      ],
    },
  },
  {
    id: "become-president",
    type: "scenarioNode",
    position: { x: 250, y: 200 },
    data: {
      id: "become-president",
      title: "대통령이 되다",
      type: "story",
      nextNodeId: "first-critical-choice",
      intro: {
        text: `시간이 흘러, 너는 대학을 나와 평범한 직장인이 된다.

어느 날, 출근길 버스에서 한 아주머니가 넘어질 뻔한 걸 네가 안아서 구했다.

그 장면은 누군가의 휴대폰에 찍혔고, 뉴스에 나오고, 밈이 되었다.
갑자기 '시민의 영웅'이라는 별명이 붙었다.

몇 주 뒤, 사람들은 장난처럼 이야기했다.
"이런 사람이 대통령이 되어야 해!"

그리고…정말로 너는 대통령이 되었다.

👑 대통령이 된 당신. 이젠 수많은 선택의 책임이 따라온다.`,
        image_prompt:
          "ordinary office worker helping elderly woman on bus, viral moment, news cameras, presidential inauguration ceremony",
      },
      choices: [],
    },
  },
  {
    id: "first-critical-choice",
    type: "scenarioNode",
    position: { x: 250, y: 380 },
    data: {
      id: "first-critical-choice",
      title: "첫 번째 중대한 선택",
      type: "choice",
      intro: {
        text: `스쿨존에서 교통사고가 발생했다.

어린아이가 크게 다쳤고, 가해자는 60대 여성 운전자.

언론은 분노하고 있다.
여론은 말한다:
"스쿨존 사고는 무조건 징역형이다!"

법리적으로는 고의가 없었고, 사망도 아닌 부상.
하지만 아이 부모는 울부짖는다.

이제 당신은 결정을 내려야 한다.`,
        image_prompt:
          "school zone accident scene, injured child, elderly female driver, angry crowd, news reporters, presidential office meeting",
      },
      choices: [
        {
          id: "follow-public-opinion",
          text: "여론에 따라 가해자를 강력히 처벌한다",
          result: "국민들은 환호했지만, 법조계는 우려를 표했다. '감정적 판단이 법치주의를 흔든다'는 비판이 일었다.",
          nextNodeId: "ending-prison",
        },
        {
          id: "follow-law",
          text: "법리에 따라 적정한 처벌을 유지한다",
          result: "법조계는 지지했지만, 국민들은 분노했다. '대통령이 가해자 편을 든다'는 여론이 들끓었다.",
          nextNodeId: "ending-no-prison",
        },
        {
          id: "find-middle-ground",
          text: "제3의 길을 모색한다 - 스쿨존 안전 강화 정책을 발표한다",
          result:
            "정책적 해결책을 제시했지만, 양쪽 모두 불만을 표했다. '회피한다'는 비판과 '현실적'이라는 평가가 엇갈렸다.",
          nextNodeId: "ending-no-prison", // 임시로 설정
        },
      ],
    },
  },
  {
    id: "ending-prison",
    type: "scenarioNode",
    position: { x: 100, y: 560 },
    data: {
      id: "ending-prison",
      title: "감옥에 보낸다",
      type: "ending",
      intro: {
        text: `감옥에 간 여성은 인터뷰를 통해 말한다.

"평생 법을 지키며 살아왔는데, 그날은 브레이크가 말을 듣지 않았어요…"

그녀의 가족은 슬퍼했고, 여론은 며칠 만에 관심을 잃었다.

당신은 조용히 혼잣말을 한다.

"정의란, 항상 대중의 감정과 같은 방향일까?"`,
        image_prompt:
          "elderly woman in prison uniform giving interview, sad family members, fading news coverage, president alone in office contemplating",
      },
      choices: [],
    },
  },
  {
    id: "ending-no-prison",
    type: "scenarioNode",
    position: { x: 400, y: 560 },
    data: {
      id: "ending-no-prison",
      title: "감옥에 보내지 않는다",
      type: "ending",
      intro: {
        text: `며칠 뒤, 또 다른 스쿨존에서 사고가 발생했다.

"대통령이 봐줬기 때문에 법이 무너졌다"는 비난이 쏟아졌다.

당신의 지지율은 폭락했고, 국회는 탄핵을 논의하기 시작했다.

당신은 고개를 숙였다.
"그날 새벽, 나는 신호등을 기다렸었지…"

그리고, 혼잣말로 중얼거린다.
"법이란, 규칙이란... 결국 누굴 위한 것일까?"`,
        image_prompt:
          "another school zone accident, angry protesters, falling approval ratings on TV, president bowing head, flashback to teenage crosswalk scene",
      },
      choices: [],
    },
  },
]

const initialEdges: Edge[] = []

interface ScenarioEditorProps {
  onNodeSelect: (node: ScenarioNode) => void
  selectedNodeId: string | null
}

export function ScenarioEditor({ onNodeSelect, selectedNodeId }: ScenarioEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [editingNode, setEditingNode] = useState<ScenarioNode | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.data as ScenarioNode)
    },
    [onNodeSelect],
  )

  const handleNodeEdit = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        setEditingNode(node.data as ScenarioNode)
        setIsDialogOpen(true)
      }
    },
    [nodes],
  )

  const handleNodePlay = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        onNodeSelect(node.data as ScenarioNode)
        console.log("재생:", node.data.title)
      }
    },
    [nodes, onNodeSelect],
  )

  const handleNodeSave = useCallback(
    (updatedNode: ScenarioNode) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === updatedNode.id
            ? {
                ...node,
                data: updatedNode,
              }
            : node,
        ),
      )
      console.log("노드 저장됨:", updatedNode)
    },
    [setNodes],
  )

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
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  // 노드에 편집/재생 핸들러 추가
  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onEdit: handleNodeEdit,
      onPlay: handleNodePlay,
    },
    selected: node.id === selectedNodeId,
  }))

  // 모든 노드 데이터 추출 (편집 폼에서 사용)
  const allNodesData = nodes.map((node) => node.data as ScenarioNode)

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-4 z-10 space-x-2">
        <button onClick={addNewNode} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
  )
}
