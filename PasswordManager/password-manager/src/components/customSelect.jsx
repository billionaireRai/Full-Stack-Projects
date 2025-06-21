import React from 'react'
import Select from 'react-select'
import useThemeToggler from '../state/themeState'

const CustomSelect = ({ options = [], value, onChange, placeholder }) => {
  const { theme } = useThemeToggler()

  const isDark = theme === 'dark'

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? (isDark ? "#4B5563" : "#D1D5DB") : (isDark ? "#374151" : "var(--tw-border)"),
      boxShadow: state.isFocused ? (isDark ? "0 0 0 2px rgba(99,102,241,0.5)" : "0 0 0 2px rgba(99,102,241,0.5)") : "none",
      backgroundColor: isDark ? "#1F2937" : "#ffffff",
      width: '100%',
      "&:hover": {
        borderColor: "#6366f1",
        cursor: 'pointer'
      },
      minHeight: "38px",
      borderRadius: '5px',
      paddingLeft: "4px",
      paddingRight: "4px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1F2937" : "var(--tw-bg)",
      borderRadius: "0.5rem",
      zIndex: 50,
      marginTop: "4px",
      boxShadow: isDark
        ? "0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -4px rgba(0,0,0,0.7)"
        : "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      borderRadius: '5px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#6366f1"
        : state.isFocused
          ? (isDark ? "#374151" : "#E0E0E0")
          : (isDark ? "#111827" : "#ffffff"),
      color: state.isSelected ? "#ffffff" : (isDark ? "#D1D5DB" : "var(--tw-text)"),
      padding: "10px 14px",
      fontSize: "0.875rem",
      borderRadius:'5px',
      fontWeight: "500",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#D1D5DB" : "var(--tw-text)",
      fontWeight: "500",
      fontSize: "0.875rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#6B7280" : "#9ca3af", // text-gray-500 for dark, text-gray-400 for light
      fontSize: "0.875rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? "#6B7280" : "#9ca3af",
      "&:hover": {
        color: "#6366f1",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  }

  // handling switching of selected option...
  const handleChange = (selected) => {
    onChange(selected)
  }

  return (
    <div className="min-w-[180px]">
      <Select
        instanceId="custom-select"
        onChange={handleChange}
        value={value}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        className='w-full border-none outline-none'
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: isDark ? "#4B5563" : "#e0e7ff", // indigo-700 for dark, indigo-100 for light
            primary: "#6366f1", // indigo-500
          },
        })}
      />
    </div>
  )
}

export default CustomSelect
