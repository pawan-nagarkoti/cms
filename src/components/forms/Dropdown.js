export default function Dropdown({ label, items = [], handleChange = () => {}, name, value = "" }) {
  return (
    <>
      {label && <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>} <br />
      <select
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="w-full text-center py-[9px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
      >
        <option value="" disabled>
          Select Value
        </option>
        {items?.map((v, i) => (
          <option value={v?.value} key={i}>
            {v?.label}
          </option>
        ))}
      </select>
    </>
  );
}
