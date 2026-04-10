interface InputProps {
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl w-full"
    />
  );
}