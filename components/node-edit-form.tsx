"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload, X } from "lucide-react"
import type { ScenarioNode, Choice } from "../types/scenario"

interface NodeEditFormProps {
  node: ScenarioNode | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedNode: ScenarioNode) => void
  allNodes: ScenarioNode[] // 모든 노드 목록 (다음 노드 선택용)
}

export function NodeEditForm({ node, isOpen, onClose, onSave, allNodes }: NodeEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    type: "story" as "story" | "choice" | "ending",
    introText: "",
    imagePrompt: "",
    imageUrl: "",
    nextNodeId: "", // story/ending 노드용
    choices: [] as Choice[],
  })

  useEffect(() => {
    if (node) {
      setFormData({
        id: node.id,
        title: node.title,
        type: (node.data?.type as "story" | "choice" | "ending") || "story",
        introText: node.intro.text,
        imagePrompt: node.intro.image_prompt || "",
        imageUrl: node.intro.image_url || "",
        nextNodeId: node.nextNodeId || "",
        choices: node.choices || [],
      })
    }
  }, [node])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setFormData((prev) => ({ ...prev, imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    if (!node) return

    const updatedNode: ScenarioNode = {
      ...node,
      id: formData.id,
      title: formData.title,
      intro: {
        text: formData.introText,
        image_prompt: formData.imagePrompt || undefined,
        image_url: formData.imageUrl || undefined,
      },
      choices: formData.choices,
      nextNodeId: formData.type !== "choice" ? formData.nextNodeId || undefined : undefined,
      data: {
        ...node.data,
        type: formData.type,
      },
    }

    onSave(updatedNode)
    onClose()
  }

  const addChoice = () => {
    setFormData((prev) => ({
      ...prev,
      choices: [
        ...prev.choices,
        {
          id: `choice-${Date.now()}`,
          text: "",
          result: "",
          nextNodeId: "",
        },
      ],
    }))
  }

  const removeChoice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }))
  }

  const updateChoice = (index: number, field: keyof Choice, value: string) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) => (i === index ? { ...choice, [field]: value } : choice)),
    }))
  }

  // 현재 노드를 제외한 다른 노드들 목록
  const availableNodes = allNodes.filter((n) => n.id !== formData.id)

  if (!node) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>노드 편집: {node.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="node-id">노드 ID</Label>
                  <Input
                    id="node-id"
                    value={formData.id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                    placeholder="예: crossroad-teen"
                  />
                </div>
                <div>
                  <Label htmlFor="node-type">노드 타입</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "story" | "choice" | "ending") =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">Story (스토리)</SelectItem>
                      <SelectItem value="choice">Choice (선택지)</SelectItem>
                      <SelectItem value="ending">Ending (결말)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="node-title">제목</Label>
                <Input
                  id="node-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="예: 규칙이란 무엇인가?"
                />
              </div>
            </CardContent>
          </Card>

          {/* 스토리 내용 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">스토리 내용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="intro-text">스토리 텍스트</Label>
                <Textarea
                  id="intro-text"
                  value={formData.introText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, introText: e.target.value }))}
                  placeholder="스토리 내용을 입력하세요..."
                  className="min-h-[120px]"
                />
              </div>

              {/* 이미지 업로드 */}
              <div>
                <Label>이미지</Label>
                <div className="space-y-3">
                  {formData.imageUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="업로드된 이미지"
                        className="max-w-xs max-h-48 rounded-lg border"
                      />
                      <Button onClick={removeImage} size="sm" variant="destructive" className="absolute top-2 right-2">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">이미지를 업로드하세요</p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        파일 선택
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image-prompt">이미지 프롬프트 (AI 생성용)</Label>
                <Textarea
                  id="image-prompt"
                  value={formData.imagePrompt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imagePrompt: e.target.value }))}
                  placeholder="AI 이미지 생성을 위한 프롬프트를 입력하세요..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 노드 연결 (선택지가 없는 경우) */}
          {formData.type !== "choice" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">노드 연결</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="next-node">다음 노드</Label>
                  <Select
                    value={formData.nextNodeId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, nextNodeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="다음 노드를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">연결 없음</SelectItem>
                      {availableNodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.title} ({node.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 선택지 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">선택지</CardTitle>
                {formData.type === "choice" && (
                  <Button onClick={addChoice} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    선택지 추가
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {formData.type !== "choice" ? (
                <div className="text-center py-8 text-gray-500">
                  <p>이 노드 타입은 선택지가 필요하지 않습니다.</p>
                </div>
              ) : formData.choices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>선택지가 없습니다.</p>
                  <p className="text-sm">Choice 노드는 최소 1개의 선택지가 필요합니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.choices.map((choice, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">선택지 {index + 1}</h4>
                        <Button
                          onClick={() => removeChoice(index)}
                          size="sm"
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`choice-id-${index}`}>선택지 ID</Label>
                            <Input
                              id={`choice-id-${index}`}
                              value={choice.id}
                              onChange={(e) => updateChoice(index, "id", e.target.value)}
                              placeholder="예: wait, cross"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`choice-text-${index}`}>선택지 텍스트</Label>
                            <Input
                              id={`choice-text-${index}`}
                              value={choice.text}
                              onChange={(e) => updateChoice(index, "text", e.target.value)}
                              placeholder="예: 신호가 바뀔 때까지 기다린다"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`choice-next-${index}`}>다음 노드</Label>
                            <Select
                              value={choice.nextNodeId || "none"}
                              onValueChange={(value) =>
                                updateChoice(index, "nextNodeId", value === "none" ? "" : value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="다음 노드 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">연결 없음</SelectItem>
                                {availableNodes.map((node) => (
                                  <SelectItem key={node.id} value={node.id}>
                                    {node.title} ({node.id})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`choice-result-${index}`}>결과 텍스트</Label>
                          <Textarea
                            id={`choice-result-${index}`}
                            value={choice.result}
                            onChange={(e) => updateChoice(index, "result", e.target.value)}
                            placeholder="이 선택의 결과나 의미를 설명하세요..."
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 저장/취소 버튼 */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
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
