"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ScenarioNode } from "../types/scenario"

interface YamlEditorDialogProps {
  isOpen: boolean
  onClose: () => void
  node: ScenarioNode | null
  onSave: (nodeId: string, yamlContent: string) => void
}

export function YamlEditorDialog({ isOpen, onClose, node, onSave }: YamlEditorDialogProps) {
  const [yamlContent, setYamlContent] = useState("")

  useEffect(() => {
    if (node) {
      // ScenarioNode를 YAML 형식으로 변환
      const yaml = `id: ${node.id}
title: ${node.title}
intro:
  text: ${node.intro.text}${
    node.intro.image_prompt
      ? `
  image_prompt: >
    ${node.intro.image_prompt}`
      : ""
  }
choices:${node.choices
        .map(
          (choice) => `
  - id: ${choice.id}
    text: ${choice.text}
    result: ${choice.result}`,
        )
        .join("")}`

      setYamlContent(yaml)
    }
  }, [node])

  const handleSave = () => {
    if (node) {
      onSave(node.id, yamlContent)
      onClose()
    }
  }

  if (!node) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>시나리오 편집: {node.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">YAML 내용</label>
            <Textarea
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="YAML 형식으로 시나리오를 작성하세요..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
