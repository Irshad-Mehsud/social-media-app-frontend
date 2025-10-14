const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">SocialApp</h1>
      <div className="flex items-center gap-4">
        <button>Home</button>
        <button>Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;
