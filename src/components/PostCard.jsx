import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
dayjs.extend(relativeTime);

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const createdAt = post.createdAt;
  const timeAgo = dayjs(createdAt).fromNow();
  const currentUserId = localStorage.getItem("userId");

  const handleLike = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/likes`,
        { userId: currentUserId }
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { user: { name: "You" }, text: comment }]);
    setComment("");
    setCommentsCount(commentsCount + 1);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 transition hover:shadow-lg">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={
            post.user?.profilePicture ||
            "https://randomuser.me/api/portraits/men/32.jpg"
          }
          alt={post.user?.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{post.user?.name}</h3>
          <p className="text-xs text-gray-500">{timeAgo}</p>
        </div>
      </div>

      {/* Caption */}
      <p className="text-gray-700 mt-3">{post.desc}</p>

      {/* Media */}
      {post.mediaUrl && (
        post.mediaType === "video" ? (
          <video
            src={post.mediaUrl}
            controls
            className="rounded-xl mt-3 w-full max-h-96 object-cover"
          />
        ) : (
          <img
            src={post.mediaUrl}
            alt="Post"
            className="rounded-xl mt-3 w-full max-h-96 object-cover"
          />
        )
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
              <p
                key={i}
                className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="font-semibold">{c.user?.name || "User"}:</span>{" "}
                {c.text || c}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
