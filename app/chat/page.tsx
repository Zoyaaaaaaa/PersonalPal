'use client';
import { useState, useRef, useEffect, FC, KeyboardEvent } from "react";
import { supabase } from "@/utils/supabase/supaBaseclient";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { Loader2, Send } from "lucide-react";
import Markdown from "../component/markdown";
import ChatHistory from "../history/page"; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; 
import { Button } from "@/components/ui/button";
import router from "next/router";
import { logout } from "../logout/actions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const googleGenerativeAI = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  
});

interface HomeProps {
  userId: string;
}

const Home: FC<HomeProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await logout(); 
      // router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const fetchRecipe = async (prompt: string) => {
    try {
      setLoading(true);
      console.log("Generating text...");
      
      const response = await generateText({
        model: googleGenerativeAI("models/gemini-pro"),
        prompt,
      });
  
      console.log("API Response:", response);
  
      if (response && typeof response === "object" && response.text) {
        setRecipe(response.text);
        const assistantMessage: Message = { role: "assistant", content: response.text };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
  
        // Log before insert
        console.log("Inserting user message:", prompt);
        const { data: userInsertData, error: userInsertError } = await supabase
          .from('chat_history')
          .insert([{ user_id: userId, role: 'user', content: prompt }]);
        if (userInsertError) {
          console.error('Error inserting user message:', userInsertError);
        } else {
          console.log('User message inserted:', userInsertData);
        }
  
        // Log before insert-- testing purpose
        console.log("Inserting assistant message:", response.text);
        const { data: assistantInsertData, error: assistantInsertError } = await supabase
          .from('chat_history')
          .insert([{ user_id: userId, role: 'assistant', content: response.text }]);
        if (assistantInsertError) {
          console.error('Error inserting assistant message:', assistantInsertError);
        } else {
          console.log('Assistant message inserted:', assistantInsertData);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setError((error as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input) {
      alert("Please enter a message");
      return;
    }
    const newMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    fetchRecipe(input);
    setInput("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

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

  const ChatLoader: FC = () => {
    return (
      <div className="flex justify-start">
        <div
          className="flex items-center bg-gray-200 text-gray-900 rounded-2xl px-4 py-2"
          style={{ overflowWrap: "anywhere" }}
        >
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  };

  const ChatInput: FC<{ onSend: (message: Message) => void }> = ({ onSend }) => {
    const [content, setContent] = useState<string>("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length > 4000) {
        alert("Message limit is 4000 characters");
        return;
      }

      setContent(value);
    };

    const handleSend = () => {
      if (!content) {
        alert("Please enter a message");
        return;
      }
      onSend({ role: "user", content });
      setContent("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [content]);

    return (
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          className="min-h-[44px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
          style={{ resize: "none" }}
          placeholder="Type a message..."
          value={content}
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>
          <Send className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-blue-500 text-white hover:opacity-80" />
        </button>
      </div>
    );
  };

  return (
    <div className="container">

      <div className="home-container">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Chat with PersonalPal</h2>

        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={handleLogout}>Logout</Button>
          <Sheet>
            <SheetTrigger>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Open Chat History
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat History</SheetTitle>
              </SheetHeader>
              <ChatHistory userId={userId} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-col max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4 h-[80vh] overflow-hidden mb-6">
          <div className="flex-1 overflow-auto space-y-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {loading && <ChatLoader />}
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="flex flex-row items-center space-x-2 p-4 bg-gray-50 rounded-lg shadow-inner"
          >
            <input
              type="text"
              placeholder={loading ? "Generating . . ." : "Ask something . . . "}
              value={input}
              disabled={loading}
              onChange={handleInputChange}
              className="flex-1 border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
            />
            <button
              type="submit"
              className="rounded-full shadow-md border bg-blue-500 text-white p-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-500">Error loading text: {error}</p>
          )}
        </div>
     
      </div>
     
    </div>
  );
};

export default Home;
