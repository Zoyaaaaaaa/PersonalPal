
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-white">
          Welcome to Connect Chat
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        PersonalPal is your ultimate platform for engaging and seamless conversations. Whether you’re connecting with friends, collaborating with colleagues, or seeking instant support, our chat system offers an intuitive and dynamic experience. Powered by Gemini, it ensures accurate and helpful responses to all your queries.
        </p>
        
        <Link href="/login">
          <p className="inline-block px-6 py-3 text-lg font-semibold text-black bg-gray-800 rounded-lg shadow-lg animate-bounce hover:bg-blue-600 hover:text-white transition duration-900 transform hover:scale-105 cursor-pointer">
            Let's Chat
          </p>
        </Link>
      </div>
      
      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} PeraonalPal. All rights reserved.</p>
      </footer>
    </main>
  );
}

