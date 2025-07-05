"use client"

import { useState } from "react"
import { ScenarioEditor } from "../components/scenario-editor"
import { GamePreview } from "../components/game-preview"
import type { ScenarioNode, Choice } from "../types/scenario"

export default function GameEditorPage() {
  const [selectedNode, setSelectedNode] = useState<ScenarioNode | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  const handleNodeSelect = (node: ScenarioNode) => {
    setSelectedNode(node)
    setSelectedNodeId(node.id)
  }

  const handleChoiceSelect = (choice: Choice) => {
    console.log("선택된 선택지:", choice)
    // 여기서 다음 노드로 이동하는 로직을 구현할 수 있습니다
  }

  return (
    <div className="h-screen flex">
      {/* 왼쪽: 시나리오 그래프 에디터 */}
      <div className="w-1/2 border-r border-gray-300">
        <div className="h-full">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">시나리오 에디터</h2>
            <p className="text-sm text-gray-600">React Flow로 스토리를 구성하세요</p>
          </div>
          <ScenarioEditor onNodeSelect={handleNodeSelect} selectedNodeId={selectedNodeId} />
        </div>
      </div>

      {/* 오른쪽: 게임 미리보기 */}
      <div className="w-1/2">
        <div className="h-full">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">게임 미리보기</h2>
            <p className="text-sm text-gray-600">선택된 노드의 게임 화면</p>
          </div>
          <GamePreview selectedNode={selectedNode} onChoiceSelect={handleChoiceSelect} />
        </div>
      </div>
    </div>
  )
}
