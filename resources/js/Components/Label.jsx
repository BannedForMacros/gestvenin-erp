export default function Label({ htmlFor, value, required = false, className = '', children }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {value || children}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
    );
}