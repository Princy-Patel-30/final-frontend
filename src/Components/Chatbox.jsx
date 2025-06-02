const ChatBox = () => {
  const messages = ['Alice', 'Bob', 'Charlie'];

  return (
    <div className="flex w-72 flex-col overflow-y-auto border-l bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">My Messages</h2>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="cursor-pointer rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
