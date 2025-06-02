const PostFeed = () => {
  // Dummy feed array
  const posts = [1, 2, 3];

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {posts.map((_, index) => (
        <div key={index} className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-300" />
            <span className="font-bold">User {index + 1}</span>
          </div>
          <div className="mt-2 h-48 rounded-md bg-gray-200" />
          <div className="mt-2 text-gray-700">❤️ Like</div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
