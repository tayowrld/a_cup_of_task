"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SelectProps {
    options: Array<{ value: string, color?: string }>;
    color?: string;
    onChange: ( value: string, color: string ) => void;
    value?: string;
    placeholder?: string;
}

interface Option {
    value: string;
    color?: string;
}

const Select = (
    {
        options,
        color,
        onChange,
        placeholder,
    } = {} as SelectProps
) => {
    const [selectedOption, setSelectedOption] = useState(" ");
    const [selectedColor, setSelectedColor] = useState(color);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: Option) => {
        setSelectedOption(option.value)
        setSelectedColor(option.color || '')
        setIsOpen(false)
        onChange( option.value, option.color || '') // 💥 ВАЖНО
      }
      
    return (
        <div className="relative" onClick={() => setIsOpen(!isOpen)}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-${selectedColor ?? color ?? 'white'}-200 text-white py-2 px-4 cursor-pointer hover:scale-105 transition duration-300  w-[124px]`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
            >
            {selectedOption !== " " ? selectedOption : placeholder}
            </motion.button>

            {isOpen && (
                <ul className="absolute top-[-50%] translate-y-[-100%] translate-x-[-50%] left-1/2 bg-white border shadow-lg mt-2 w-[max-content] z-100">
                    {options.map((option) => (
                        <li key={option.value} onClick={() => handleSelect(option)} className="py-2 px-4 hover:bg-gray-200 cursor-pointer">
                            {option.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Select;

