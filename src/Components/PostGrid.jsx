const PostGrid = () => {
  const posts = Array.from({ length: 8 });

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
        {posts.map((_, idx) => (
          <div
            key={idx}
            className="aspect-square w-full rounded-md bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
