import { useState } from 'react';
import IconRenderer from './IconRenderer';

const ChatBox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const chats = [
    { id: 1, user: '@princy30', message: 'Hey !!!' },
    { id: 2, user: '@john123', message: 'Good morning !!!' },
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  const handleSend = () => {
    console.log('Message sent');
  };

  if (selectedChat) {
    return (
      <div className="flex h-full flex-col rounded-l-3xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-pink-600 transition-colors duration-200 hover:text-pink-500"
          >
            <IconRenderer type="back" size="24" isRaw={true} />
          </button>
          <h2 className="text-lg font-semibold text-pink-800">
            {selectedChat.user}
          </h2>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto">
          <style>
            {`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className="rounded-xl bg-pink-100 p-3 text-sm text-gray-800">
            {selectedChat.message}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 rounded-xl border border-pink-200 bg-white/50 p-2 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="text-pink-600 transition-colors duration-200 hover:text-pink-500"
          >
            <IconRenderer type="send" size="24" isRaw={true} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-l-3xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-pink-800">Messages</h2>
      <div className="flex-1 space-y-3 overflow-y-auto">
        <style>
          {`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            className="cursor-pointer rounded-xl bg-pink-50 p-3 transition-all duration-200 hover:bg-pink-100"
          >
            <p className="font-semibold text-pink-800">{chat.user}</p>
            <p className="truncate text-sm text-gray-600">{chat.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
