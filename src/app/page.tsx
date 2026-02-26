"use client";

import { useState, useRef } from "react";
import { Bot } from "lucide-react";
import { Label } from "@/components/ui/label";
import InputSection from "../components/sections/InputSection";
import MessageDashboard from "../components/sections/MessageDashboard";
import type { Message } from "../components/sections/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelRequest() {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
    setIsSending(false);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: Message = { id: Date.now(), role: "user", text };
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!hasStarted) setHasStarted(true);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setIsSending(true);

    timeoutRef.current = setTimeout(() => {
      if (controller.signal.aborted) return;
      setIsTyping(false);
      setIsSending(false);
      abortControllerRef.current = null;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "I received your message. (Connect your API to respond here.)",
        },
      ]);
    }, 1200);
  }

  if (!hasStarted) {
    return (
      <div className="flex flex-col h-screen w-full bg-background">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
            <Bot size={18} />
          </div>
          <div>
            <Label className="font-semibold text-sm leading-none cursor-default">Assistant</Label>
            <Label className="text-xs text-muted-foreground mt-0.5 font-normal cursor-default">Always online</Label>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-md">
            <Bot size={28} />
          </div>
          <Label className="text-2xl font-semibold tracking-tight text-foreground">
            Hi, I&apos;m your AI Assistant
          </Label>
          <Label className="text-sm font-normal text-muted-foreground">
            Ask me anything — I&apos;m here to help.
          </Label>
        </div>

        <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 shrink-0">
          <InputSection
            input={input}
            onChange={setInput}
            onSend={sendMessage}
            onCancel={cancelRequest}
            isSending={isSending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
          <Bot size={18} />
        </div>
        <div>
          <Label className="font-semibold text-sm leading-none cursor-default">Assistant</Label>
          <Label className="text-xs text-muted-foreground mt-0.5 font-normal cursor-default">Always online</Label>
        </div>
        <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MessageDashboard messages={messages} isTyping={isTyping} />
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 shrink-0">
        <InputSection
          input={input}
          onChange={setInput}
          onSend={sendMessage}
          onCancel={cancelRequest}
          isSending={isSending}
        />
      </div>
    </div>
  );
}