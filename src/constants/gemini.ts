export const GEMINI_MODEL = "gemini-2.5-flash";

export const GEMINI_REST_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const SYSTEM_INSTRUCTION = `너는 실시간 QA 엔지니어다. 사용자가 공유한 화면 캡처 이미지들을 분석하고 있다.

역할:
- 이미지들은 시간순(5fps)으로 캡처된 연속 프레임이며, 각 이미지 앞에 [Frame N] 라벨이 붙어 있다
- **프레임 간 차이를 하나씩 비교**하여 사용자의 조작 흐름을 재구성하라:
  - 이전 프레임과 비교하여 새로 나타난/사라진/변경된 UI 요소를 감지
  - 체크박스 상태 변화, 버튼 클릭 흔적, 입력 필드 값 변화, 카운터 숫자 변화 등을 추적
  - 에러가 처음 나타나는 정확한 Frame 번호를 특정
- 에러 발생까지의 **단계별 조작 과정**을 구체적으로 기술하라 (단순히 결과 상태만 기술하지 말 것)

분석 요령:
- Frame 0부터 순서대로 훑으며 변화가 감지되는 구간을 기록
- "Frame X~Y: 사용자가 [구체적 요소]를 [조작]" 형태로 변화 포인트를 파악
- 에러 직전 Frame과 에러 직후 Frame의 차이를 명확히 대비
- 동일한 상태가 지속되는 구간은 건너뛰고, 변화가 있는 Frame에 집중

응답 규칙:
- 한국어로 응답
- 에러 분석 시 반드시 create_notion_ticket 함수를 호출하여 리포트 생성
- 간결하고 기술적인 용어 사용
- Frame 번호는 내부 분석용이다. 최종 리포트(reproduction_steps)에는 Frame 번호를 포함하지 말고, 사용자가 읽기 쉬운 조작 단계로 기술하라`;

export const NOTION_TICKET_TOOL = {
  function_declarations: [
    {
      name: "create_notion_ticket",
      description:
        "분석된 에러를 Notion 티켓으로 생성합니다. 에러의 요약, 재현 단계, 심각도, 에러 유형을 포함합니다.",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "에러에 대한 한줄 요약",
          },
          reproduction_steps: {
            type: "string",
            description: "에러 재현을 위한 구조화된 리포트. 반드시 아래 3섹션 포맷을 따르라:\n\n[사전 조건]\n화면의 초기 상태를 기술 (페이지명, 표시된 항목 수, 카운터 초기값 등)\n\n[재현 절차]\n1. [조작할 UI 요소] [조작 방법]\n   - [조작 후 화면 변화 관찰 내용] (정상)\n2. [다음 조작할 UI 요소] [조작 방법]\n   - [에러] 구체적 에러 내용\n\n[에러 상세]\n에러의 패턴과 추정 원인을 1~2문장으로 기술.\n\n규칙: Frame 번호는 포함하지 말 것. 각 단계에서 조작한 UI 요소명과 화면 변화를 구체적으로 기술. 최소 3단계 이상.",
          },
          severity: {
            type: "string",
            description: "심각도: critical, high, medium, low 중 하나",
          },
          error_type: {
            type: "string",
            description: "에러 유형 (예: TypeError, NetworkError, UIBug 등)",
          },
          key_frame_indices: {
            type: "array",
            items: { type: "integer" },
            description: "버그 리포트에 첨부할 핵심 프레임의 인덱스 배열 (0-based). 에러 발생 직전, 에러 시점, 에러 직후 등 최대 3~5장을 선택하라.",
          },
        },
        required: ["summary", "reproduction_steps", "severity", "error_type", "key_frame_indices"],
      },
    },
  ],
};

export const SCREEN_CAPTURE_CONFIG = {
  width: 1280,
  height: 720,
  fps: 5,
  quality: 0.6,
  mimeType: "image/jpeg",
  bufferSize: 100,
};
