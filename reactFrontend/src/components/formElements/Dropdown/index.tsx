import React, { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import cn from "classnames";

import "./styles.scss";

export interface DropdownOption {
    label: string;
    value: string;
}

type SelectProps = {
    options: DropdownOption[];
    initialOption: DropdownOption;
    onChange: (option: DropdownOption) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

const Dropdown: React.FC<SelectProps> = ({ initialOption, options, placeholder, onChange, className, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string>(initialOption.label);
    const selectRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(selectRef, () => setIsOpen(false));

    const handleSelect = (option: DropdownOption) => {
        setSelected(option.label);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div className={cn("select", disabled && "select--disabled", className)} ref={selectRef}>
            <div className={cn("select__header", isOpen && "select__header--open")} onClick={() => setIsOpen(!isOpen)}>
                <div className="select__placeholder">{selected || placeholder}</div>
                <div className={cn("select__icon", isOpen && "select__icon--open")}></div>
            </div>
            <ul className={cn("select__options", isOpen && "select__options--open")}>
                {options.map((option) => (
                    <li
                        className={cn("select__option", option.label === selected && "select__option--selected")}
                        key={option.value}
                        onClick={() => handleSelect(option)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
