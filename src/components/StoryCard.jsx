const StoryCard = ({ image, name }) => {
  return (
    <div className="flex flex-col items-center">
      <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
      <p className="text-sm mt-1">{name}</p>
    </div>
  );
};

export default StoryCard;
