"use client";

import React from "react";
import { Bot, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Message } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  messages: Message[];
  isTyping: boolean;
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
      <Bot size={14} />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
      <User size={14} />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <BotAvatar />}

      <div className="flex flex-col gap-1">
        <Label
          className={`text-[10px] font-medium text-muted-foreground ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? "You" : "Assistant"}
        </Label>
        <div
          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
      </div>

      {isUser && <UserAvatar />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <BotAvatar />
      <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
        <span className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

// ─── Class Component ─────────────────────────────────────────────────────────

class MessageDashboard extends React.Component<Props> {
  private bottomRef = React.createRef<HTMLDivElement>();

  private scrollToBottom() {
    this.bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps: Props) {
    const { messages, isTyping } = this.props;
    if (prevProps.messages !== messages || prevProps.isTyping !== isTyping) {
      this.scrollToBottom();
    }
  }

  render() {
    const { messages, isTyping } = this.props;

    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={this.bottomRef} />
      </div>
    );
  }
}

export default MessageDashboard;
