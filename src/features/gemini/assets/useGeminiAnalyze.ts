"use client";

import { useCallback } from "react";
import {
  GEMINI_REST_ENDPOINT,
  SYSTEM_INSTRUCTION,
  NOTION_TICKET_TOOL,
} from "@/constants/gemini";
import { useAgentStore } from "@/features/agent-sidebar/assets/useAgentStore";
import type {
  GeminiContentPart,
  GeminiRestRequest,
  GeminiRestResponse,
} from "@/types/gemini";

export function useGeminiAnalyze() {
  const { addLog, setStatus, setDraftReport, addTokenUsage, addToast, setFlowStep } =
    useAgentStore();

  const analyzeFrames = useCallback(
    async (frames: string[]) => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        addLog("ERROR", "API key not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
        setStatus("error");
        return;
      }

      if (frames.length === 0) {
        addLog("WARN", "No frames captured yet. Wait a moment and try again.");
        setStatus("watching");
        return;
      }

      setStatus("analyzing");
      setFlowStep("analyzing");
      addLog("INFO", `Analyzing ${frames.length} captured frames...`);

      // Build parts: text prompt + [Frame N] label + inline images
      const totalFrames = frames.length;
      const parts: GeminiContentPart[] = [
        {
          text: `사용자가 에러 분석을 요청했습니다. 아래 이미지들은 시간순(5fps)으로 캡처된 총 ${totalFrames}장의 연속 프레임입니다. 각 이미지 앞에 [Frame N/${totalFrames}] 라벨이 붙어 있습니다.\n\n프레임을 순서대로 비교하여:\n1) 각 프레임 간 UI 변화를 관찰하고, 사용자가 어떤 요소를 클릭/입력했는지 파악\n2) 어떤 Frame 구간에서 에러가 처음 나타나는지 특정\n3) 에러 발생 전후의 화면 차이를 구체적으로 기술\n\n반드시 Frame 번호를 참조하여 create_notion_ticket 함수를 호출해주세요.`,
        },
        ...frames.flatMap(
          (base64, i): GeminiContentPart[] => [
            { text: `[Frame ${i}/${totalFrames}]` },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64,
              },
            },
          ]
        ),
      ];

      const body: GeminiRestRequest = {
        contents: [{ role: "user", parts }],
        tools: [NOTION_TICKET_TOOL],
        tool_config: {
          function_calling_config: { mode: "ANY" },
        },
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      };

      try {
        const res = await fetch(`${GEMINI_REST_ENDPOINT}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data: GeminiRestResponse = await res.json();

        if (data.error) {
          addLog("ERROR", `Gemini API error: ${data.error.message}`);
          addToast(`API 에러: ${data.error.message}`, "error");
          setStatus("watching");
          return;
        }

        if (!data.candidates?.length) {
          addLog("WARN", "No response from Gemini.");
          setStatus("watching");
          return;
        }

        const responseParts = data.candidates[0].content.parts;

        for (const part of responseParts) {
          if (part.text) {
            addLog("ANALYSIS", part.text);
          }
          if (part.functionCall) {
            const { name, args } = part.functionCall;
            if (name === "create_notion_ticket") {
              addLog("INFO", `Function call: ${name}`);

              // Extract key frames by indices from Gemini response
              const keyFrameIndices: number[] = Array.isArray(args.key_frame_indices)
                ? args.key_frame_indices.filter(
                    (i: number) => Number.isInteger(i) && i >= 0 && i < frames.length
                  )
                : [];
              const screenshots = keyFrameIndices.map((i: number) => frames[i]);
              addLog("INFO", `Extracted ${screenshots.length} key frames from ${frames.length} total.`);

              setDraftReport({
                summary: args.summary || "",
                reproductionSteps: args.reproduction_steps || "",
                severity:
                  (args.severity as "critical" | "high" | "medium" | "low") ||
                  "medium",
                errorType: args.error_type || "Unknown",
                screenshots,
              });
              addLog("INFO", "Draft report generated. Please review and send.");
            }
          }
        }

        if (data.usageMetadata) {
          addTokenUsage(data.usageMetadata.totalTokenCount / 1000);
        }

        setStatus("watching");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        addLog("ERROR", `Request failed: ${msg}`);
        addToast("Gemini 요청 실패. 네트워크를 확인하세요.", "error");
        setStatus("watching");
      }
    },
    [addLog, setStatus, setDraftReport, addTokenUsage, addToast, setFlowStep]
  );

  return { analyzeFrames };
}
