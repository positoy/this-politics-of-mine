"use client";
import { Handle, Position, type NodeProps } from "reactflow";
import { Button } from "@/components/ui/button";
import { Play, Edit, Trash2 } from "lucide-react";

interface CustomNodeProps extends NodeProps {
  onEdit?: (nodeId: string) => void;
  onPlay?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
}

export function CustomNode({
  data,
  selected,
  onEdit,
  onPlay,
  onDelete,
}: CustomNodeProps) {
  const isStoryNode =
    data.choices && data.choices.length === 0 && data.type !== "ending";
  const isChoiceNode = data.choices && data.choices.length > 0;
  const isEndingNode = data.type === "ending";

  const getNodeStyle = () => {
    if (isEndingNode) {
      return "bg-red-50 border-red-300";
    } else if (isStoryNode) {
      return "bg-purple-50 border-purple-300";
    } else if (isChoiceNode) {
      return "bg-yellow-50 border-yellow-300";
    } else {
      return "bg-white border-gray-300";
    }
  };

  const getNodeLabel = () => {
    if (isEndingNode) return "ENDING";
    if (isStoryNode) return "STORY";
    if (isChoiceNode) return "CHOICE";
    return "";
  };

  const getNodeLabelStyle = () => {
    if (isEndingNode) return "bg-red-200 text-red-800";
    if (isStoryNode) return "bg-purple-200 text-purple-800";
    if (isChoiceNode) return "bg-yellow-200 text-yellow-800";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md border-2 min-w-[200px] ${getNodeStyle()} ${
        selected ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold text-gray-800">{data.title}</div>
          {getNodeLabel() && (
            <span
              className={`text-xs px-2 py-1 rounded ${getNodeLabelStyle()}`}
            >
              {getNodeLabel()}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-600 max-w-[180px] line-clamp-3">
          {data.intro?.text || "내용 없음"}
        </div>

        {isChoiceNode && (
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            {data.choices.length}개의 선택지
          </div>
        )}

        <div className="flex gap-1 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.(data.id);
            }}
          >
            <Play className="w-3 h-3 mr-1" />
            재생
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(data.id);
            }}
          >
            <Edit className="w-3 h-3 mr-1" />
            편집
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs bg-transparent text-red-500 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(data.id);
            }}
            title="노드 삭제"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            삭제
          </Button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
