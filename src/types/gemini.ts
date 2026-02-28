export interface GeminiTool {
  function_declarations: GeminiFunctionDeclaration[];
}

export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export interface GeminiFunctionCall {
  name: string;
  args: Record<string, string>;
}

// REST API generateContent
export interface GeminiRestRequest {
  contents: {
    role: string;
    parts: GeminiContentPart[];
  }[];
  tools: GeminiTool[];
  tool_config: {
    function_calling_config: {
      mode: string;
    };
  };
  system_instruction: {
    parts: { text: string }[];
  };
}

export type GeminiContentPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

export interface GeminiRestResponse {
  candidates?: {
    content: {
      role: string;
      parts: { text?: string; functionCall?: GeminiFunctionCall }[];
    };
    finishReason: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
