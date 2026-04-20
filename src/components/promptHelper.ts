export function getCharacterCount(text: string): number {
  return text.length;
}

export function formatCharacterCount(count: number): string {
  return `${count} 글자`;
}

export function handleExampleSelection(example: string): string {
  return example;
}

export function isValidPrompt(prompt: string): boolean {
  return prompt.trim().length > 0;
}
