"use client";

import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  input: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onCancel: () => void;
  isSending?: boolean;
};

export default function InputSection({ input, onChange, onSend, onCancel, isSending = false }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) onSend();
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-ring transition-shadow">
        <Textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isSending ? "Waiting for response…" : "Ask me anything… (Enter to send)"}
          disabled={isSending}
          className="flex-1 min-h-0 max-h-40 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isSending ? (
          <Button
            size="icon-sm"
            variant="destructive"
            onClick={onCancel}
            className="rounded-xl shrink-0"
            title="Cancel response"
          >
            <Square size={13} fill="currentColor" />
          </Button>
        ) : (
          <Button
            size="icon-sm"
            variant="default"
            onClick={onSend}
            disabled={!input.trim()}
            className="rounded-xl shrink-0"
          >
            <Send size={15} />
          </Button>
        )}
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2">
        {isSending ? "Click ■ to cancel the response" : "Shift + Enter for a new line"}
      </p>
    </div>
  );
}
