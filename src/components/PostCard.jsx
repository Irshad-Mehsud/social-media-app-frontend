import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(25); // demo count
  const [commentsCount, setCommentsCount] = useState(8);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // local comment list

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, comment]);
    setComment("");
    setCommentsCount(commentsCount + 1);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 transition hover:shadow-lg">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={post.user?.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg"}
          alt={post.user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{post.user?.name}</h3>
          <p className="text-xs text-gray-500">Just now</p>
        </div>
      </div>

      {/* Caption */}
      <p className="text-gray-700 mt-3">{post.caption}</p>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="rounded-xl mt-3 w-full object-cover max-h-96"
        />
      )}

      {/* Like / Comment buttons */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition"
        >
          <Heart
            size={20}
            className={`${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
          />
          <span>{likesCount} Likes</span>
        </button>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500 transition"
        >
          <MessageCircle size={20} />
          <span>{commentsCount} Comments</span>
        </button>
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <div className="mt-4 animate-fadeIn">
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Display Comments */}
          <div className="mt-3 space-y-2">
            {comments.map((c, i) => (
              <p key={i} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-semibold">{post.user?.name || "User"}:</span> {c}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
