// 'use client';
// import { useEffect, useState } from "react";
// import { supabase } from "@/utils/supabase/supaBaseclient";

// interface ChatHistoryProps {
//   userId: string;
// }

// const ChatHistory = ({ userId }: ChatHistoryProps) => {
//   const [history, setHistory] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('chat_history')
//           .select('*')
//           .eq('user_id', userId)
//           .order('created_at', { ascending: true });

//         if (error) {
//           throw error;
//         }

//         console.log("Fetched Data:", data); // Log data to check
//         setHistory(data || []);
//       } catch (error) {
//         setError((error as Error).message || "Failed to fetch history");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [userId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="history-container p-4 bg-gray-100 rounded-lg shadow-inner">
//       <h2 className="text-lg font-bold mb-2">Chat History</h2>
//       {history.length === 0 ? (
//         <p>No chat history available.</p>
//       ) : (
//         <ul>
//           {history.map((entry, index) => (
//             <li key={index} className={`p-2 ${entry.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'} rounded-lg mb-2`}>
//               <strong>{entry.role === 'user' ? 'You' : 'Assistant'}:</strong> {entry.content}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ChatHistory;

// // 'use client'
// // import { useEffect, useState } from "react";
// // import { supabase } from "@/utils/supabase/supaBaseclient";
// // import {
// //   Sheet,
// //   SheetContent,
// //   SheetDescription,
// //   SheetHeader,
// //   SheetTitle,
// //   SheetTrigger,
// // } from "@/components/ui/sheet";

// // interface ChatHistoryProps {
// //   userId: string;
// // }

// // const ChatHistory = ({ userId }: ChatHistoryProps) => {
// //   const [history, setHistory] = useState<any[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchHistory = async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from('chat_history')
// //           .select('*')
// //           .eq('user_id', userId)
// //           .order('created_at', { ascending: true });

// //         if (error) throw error;

// //         setHistory(data || []);
// //       } catch (error) {
// //         setError((error as Error).message || "Failed to fetch history");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchHistory();
// //   }, [userId]);

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;

// //   return (
// //     <Sheet>
// //       <SheetTrigger>Open Chat History</SheetTrigger>
// //       <SheetContent>
// //         <SheetHeader>
// //           <SheetTitle>Chat History</SheetTitle>
// //           <SheetDescription>
// //             Here is the history of your chat interactions.
// //           </SheetDescription>
// //         </SheetHeader>
// //         <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
// //           {history.length === 0 ? (
// //             <p>No chat history available.</p>
// //           ) : (
// //             <ul>
// //               {history.map((entry, index) => (
// //                 <li key={index} className={`p-2 ${entry.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'} rounded-lg mb-2`}>
// //                   <strong>{entry.role === 'user' ? 'You' : 'Assistant'}:</strong> {entry.content}
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </div>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // };

// // export default ChatHistory;
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
