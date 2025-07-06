"use client";
import type { ScenarioNode, Choice } from "../types/scenario";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GamePreviewProps {
  selectedNode: ScenarioNode | null;
  onChoiceSelect?: (choice: Choice) => void;
}

export function GamePreview({
  selectedNode,
  onChoiceSelect,
}: GamePreviewProps) {
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
    );
  }

  const isStoryNode =
    (!selectedNode.choices || selectedNode.choices.length === 0) &&
    selectedNode.data?.type !== "ending";
  const isChoiceNode = selectedNode.choices && selectedNode.choices.length > 0;
  const isEndingNode = selectedNode.data?.type === "ending";

  // RPG 스타일 레이아웃
  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-lg shadow-lg">
      {/* 배경 이미지 */}
      {selectedNode.intro.image_url ? (
        <img
          src={selectedNode.intro.image_url}
          alt={selectedNode.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 opacity-80" />
      )}
      {/* 반투명 다이얼로그/선택지 상자 */}
      <div className="absolute bottom-0 left-0 w-full pb-0 px-0 z-10">
        <div className="max-w-2xl mx-auto mb-8 bg-white/90 rounded-t-2xl shadow-2xl p-6 backdrop-blur-md border-t-4 border-blue-300">
          {/* 노드 타입/타이틀 */}
          <div className="flex items-center gap-2 mb-2">
            {isEndingNode && <span className="text-lg">🏁</span>}
            {isStoryNode && <span className="text-lg">📖</span>}
            {isChoiceNode && <span className="text-lg">⚖️</span>}
            <span className="font-bold text-lg text-gray-800">
              {selectedNode.title}
            </span>
            {isStoryNode && (
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">
                STORY
              </span>
            )}
            {isChoiceNode && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2">
                CHOICE
              </span>
            )}
            {isEndingNode && (
              <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded ml-2">
                ENDING
              </span>
            )}
          </div>
          {/* 다이얼로그 텍스트 */}
          <div className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base mb-4 min-h-[80px]">
            {selectedNode.intro.text}
          </div>
          {/* 이미지 프롬프트 */}
          {selectedNode.intro.image_prompt && (
            <div className="bg-blue-50 p-2 rounded-lg border-l-4 border-blue-400 text-xs text-gray-600 mb-3">
              <span className="font-semibold">이미지 프롬프트:</span>{" "}
              {selectedNode.intro.image_prompt}
            </div>
          )}
          {/* 선택지/엔딩 안내 */}
          {isEndingNode ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center text-red-700">
              <div className="text-lg font-medium mb-2">🏁 게임 종료</div>
              <div className="text-sm text-red-600 mb-3">
                당신의 선택이 가져온 결과입니다.
              </div>
              <div className="text-xs text-red-500 italic">
                "어떤 선택도 완벽하지 않다. 그래서 정치란 무엇인가?"
              </div>
            </div>
          ) : isStoryNode ? (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center text-purple-700">
              <div className="text-sm font-medium mb-2">📖 스토리 노드</div>
              <div className="text-xs text-purple-600">
                이 노드는 스토리만 보여주며 선택지가 없습니다.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center text-yellow-700">
                <div className="text-sm font-medium">⚖️ 중대한 결정의 순간</div>
                <div className="text-xs text-yellow-600 mt-1">
                  당신의 선택이 사회에 어떤 영향을 미칠까요?
                </div>
              </div>
              <h4 className="font-semibold text-gray-700">선택지:</h4>
              {selectedNode.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  className="w-full text-left justify-start h-auto p-4 bg-white hover:bg-blue-50 border-l-4 border-l-blue-400 rounded-lg shadow mb-2 transition-all"
                  onClick={() => onChoiceSelect?.(choice)}
                >
                  <div className="w-full">
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        선택 {index + 1}
                      </span>
                      {choice.text}
                    </div>
                    <div className="text-sm text-gray-600 italic">
                      → {choice.result}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
