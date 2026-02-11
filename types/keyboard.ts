export interface KeyboardRequest {
  text: string;
}

export interface KeyboardResponse {
  original_text: string;
  corrected_text: string;
  suggestions: string[];
  language: string;
}
