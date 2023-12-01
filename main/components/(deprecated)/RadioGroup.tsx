import { useState } from "react";

interface RadioGroupProps {
    options: string[];
    value: string;
    onChange: (newValue: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    onChange,
}) => {
    return (
        <div className="button-group">
            {options.map((option) => (
                <button
                    key={option}
                    className={`toggle-button ${
                        value === option ? "active" : ""
                    }`}
                    onClick={() => onChange(option)}
                >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
            ))}
            <style jsx>{`
                .button-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .toggle-button {
                    padding: 5px 10px;
                    border: 1px solid #ccc;
                    background-color: #f5f5f5;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .toggle-button.active {
                    background-color: #ddd;
                }
                .toggle-button:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default RadioGroup;
