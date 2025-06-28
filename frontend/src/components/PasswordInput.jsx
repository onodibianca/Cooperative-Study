import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  hasError,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full max-w-[400px]">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-10 py-1 rounded border ${
          hasError ? "border-red-500" : "border-lime-100"
        } outline-none focus:border-lime-400`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
        className={`absolute top-1/2 right 5 -translate-y-1/2 px-2 py-1 text-gray-600 hover:text-gray-900 focus:outline-none ${
          hasError ? "text-red-500" : ""
        }`}
      >
        {visible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
      </button>
    </div>
  );
}
