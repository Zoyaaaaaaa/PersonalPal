'use client';

import { FC, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supaBaseclient";
import Markdown from "../component/markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatHistoryProps {
  userId: string;
}

const ChatHistory: FC<ChatHistoryProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat history:', error);
        return;
      }

      if (data) {
        setMessages(data.map((entry) => ({
          role: entry.role,
          content: entry.content
        })));
      }
    };

    fetchMessages();
  }, [userId]);

  const ChatMessage: FC<{ message: Message }> = ({ message }) => {
    return (
      <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
        <div
          className={`flex items-center ${message.role === "assistant" ? "bg-gray-200 text-gray-900" : "bg-blue-500 text-white"} rounded-2xl px-4 py-2 max-w-[67%] whitespace-pre-wrap`}
          style={{ overflowWrap: "anywhere" }}
        >
          <Markdown text={message.content} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4 p-4 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-lg h-[80vh] overflow-auto">
      <h3 className="text-2xl font-bold mb-4 text-center">Chat History</h3>
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
    </div>
  );
};

export default ChatHistory;

