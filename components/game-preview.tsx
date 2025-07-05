"use client"
import type { ScenarioNode, Choice } from "../types/scenario"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface GamePreviewProps {
  selectedNode: ScenarioNode | null
  onChoiceSelect?: (choice: Choice) => void
}

export function GamePreview({ selectedNode, onChoiceSelect }: GamePreviewProps) {
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-2xl mb-2">🎮</div>
          <p>왼쪽에서 노드를 선택하거나</p>
          <p>재생 버튼을 클릭하면</p>
          <p>게임 화면이 여기에 표시됩니다</p>
        </div>
      </div>
    )
  }

  const isStoryNode =
    (!selectedNode.choices || selectedNode.choices.length === 0) && selectedNode.data?.type !== "ending"
  const isChoiceNode = selectedNode.choices && selectedNode.choices.length > 0
  const isEndingNode = selectedNode.data?.type === "ending"

  const getIcon = () => {
    if (isEndingNode) return "🏁"
    if (isStoryNode) return "📖"
    if (isChoiceNode) return "⚖️"
    return "📄"
  }

  return (
    <div className="h-full p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{getIcon()}</span>
            {selectedNode.title}
            {isStoryNode && <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">STORY</span>}
            {isChoiceNode && (
              <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2">CHOICE</span>
            )}
            {isEndingNode && <span className="text-sm bg-red-200 text-red-800 px-2 py-1 rounded ml-2">ENDING</span>}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedNode.intro.image_url && (
            <div className="mb-4">
              <img
                src={selectedNode.intro.image_url || "/placeholder.svg"}
                alt={selectedNode.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedNode.intro.text}</div>

          {selectedNode.intro.image_prompt && (
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-gray-600 mb-1">이미지 프롬프트:</div>
              <div className="text-xs text-gray-500 italic">{selectedNode.intro.image_prompt}</div>
            </div>
          )}

          {isEndingNode ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-center text-red-700">
                <div className="text-lg font-medium mb-2">🏁 게임 종료</div>
                <div className="text-sm text-red-600 mb-3">당신의 선택이 가져온 결과입니다.</div>
                <div className="text-xs text-red-500 italic">"어떤 선택도 완벽하지 않다. 그래서 정치란 무엇인가?"</div>
              </div>
            </div>
          ) : isStoryNode ? (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-center text-purple-700">
                <div className="text-sm font-medium mb-2">📖 스토리 노드</div>
                <div className="text-xs text-purple-600">이 노드는 스토리만 보여주며 선택지가 없습니다.</div>
              </div>
            </div>
          ) : isChoiceNode ? (
            <div className="space-y-3">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="text-center text-yellow-700">
                  <div className="text-sm font-medium">⚖️ 중대한 결정의 순간</div>
                  <div className="text-xs text-yellow-600 mt-1">당신의 선택이 사회에 어떤 영향을 미칠까요?</div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-700">선택지:</h4>
              {selectedNode.choices.map((choice, index) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 bg-white hover:bg-gray-50 border-l-4 border-l-yellow-400"
                  onClick={() => onChoiceSelect?.(choice)}
                >
                  <div className="w-full">
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">선택 {index + 1}</span>
                      {choice.text}
                    </div>
                    <div className="text-sm text-gray-600 italic">→ {choice.result}</div>
                  </div>
                </Button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
