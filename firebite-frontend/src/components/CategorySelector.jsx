const categories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Sandwitch", icon: "🥪" },
  { name: "Shake", icon: "🥤" },
  { name: "Ice-Cream", icon: "🍨" },
  { name: "Dessert", icon: "🍩" },
];

export default function CategorySelector({ selected, onSelect }) {
  return (
    <div className="flex justify-center gap-6 my-6">
      {categories.map((cat) => (
        <div
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`cursor-pointer text-center ${selected === cat.name ? 'text-yellow-400' : 'text-white'}`}
        >
          <div className="text-3xl">{cat.icon}</div>
          <div className="text-sm mt-1">{cat.name.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}
