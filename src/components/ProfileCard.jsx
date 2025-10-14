const ProfileCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      {/* Cover Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80"
          alt="Cover"
          className="w-full h-28 object-cover"
        />

        {/* Profile Image */}
        <img
          src="https://i.dawn.com/primary/2020/12/5fec3217120cc.jpg"
          alt="Profile"
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-24 h-24 rounded-full border-4 border-white object-cover"
        />
      </div>

      {/* User Info */}
      <div className="mt-12 text-center px-4 pb-4">
        <h2 className="font-semibold text-lg">Irshad Ahmad</h2>
        <p className="text-gray-500 text-sm">Web Developer • React & MUI Expert</p>

        {/* Bio */}
        <p className="text-gray-600 text-sm mt-3">
          Passionate front-end developer crafting clean, interactive, and
          responsive user interfaces with React, Tailwind, and Material UI.
        </p>

        {/* Stats */}
        <div className="flex justify-around mt-4 text-sm text-gray-700">
          <div>
            <span className="font-bold block text-lg">1.2K</span>
            Followers
          </div>
          <div>
            <span className="font-bold block text-lg">980</span>
            Following
          </div>
          <div>
            <span className="font-bold block text-lg">35</span>
            Posts
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
