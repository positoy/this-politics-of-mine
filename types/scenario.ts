export interface ScenarioNode {
  id: string;
  title: string;
  intro: {
    text: string;
    image_prompt?: string;
    image_url?: string; // 업로드된 이미지 URL
  };
  choices: Choice[];
  nextNodeId?: string; // story/ending 노드용 다음 노드
  position: { x: number; y: number };
  data?: {
    type?: "story" | "choice" | "ending";
  };
  image_generated?: boolean | string; // true면 id로 리소스 이미지 사용
}

export interface Choice {
  id: string;
  text: string;
  result: string;
  nextNodeId?: string; // 이 선택지를 선택했을 때 이동할 다음 노드
}

export interface GameState {
  currentNodeId: string;
  playerStats: {
    approval: number;
    justice: number;
    stability: number;
  };
  history: string[];
}
