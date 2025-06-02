import ChatBox from '../Components/Chatbox';
import PostFeed from '../Components/Postfeed';
import Sidebar from '../Components/Sidebar';

const Feed = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-gray-100">
      <Sidebar />
      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-1 overflow-y-auto">
          <PostFeed />
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Feed;
