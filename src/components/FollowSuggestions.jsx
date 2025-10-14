const FollowSuggestions = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="font-semibold mb-2">People You May Know</h3>
      <ul className="space-y-2">
        <li className="flex items-center justify-between">
          <span>User 1</span>
          <button className="text-blue-500 text-sm">Follow</button>
        </li>
        <li className="flex items-center justify-between">
          <span>User 2</span>
          <button className="text-blue-500 text-sm">Follow</button>
        </li>
      </ul>
    </div>
  );
};

export default FollowSuggestions;
