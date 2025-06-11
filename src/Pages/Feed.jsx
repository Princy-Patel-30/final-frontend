// import ChatBox from '../Components/ChatBox';
import PostFeed from '../Components/Postfeed';

const Feed = () => {
  return (
    <div className="bg-pink-25 flex h-full w-full">
      <div className="h-screen flex-1 overflow-hidden p-2 md:p-4">
        <PostFeed />
      </div>
      {/* <div className="w-90 bg-white shadow-inner hidden md:flex flex-col rounded-l-2xl">
        <ChatBox />
      </div> */}
    </div>
  );
};

export default Feed;
