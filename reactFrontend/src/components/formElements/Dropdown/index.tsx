import React, { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import cn from "classnames";

import styles from "./styles.module.scss";

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

const Dropdown: React.FC<SelectProps> = ({
    initialOption,
    options,
    placeholder,
    onChange,
    className,
    disabled,
}) => {
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
        <div
            className={cn(
                styles.select,
                disabled && styles.disabled,
                className
            )}
            ref={selectRef}
        >
            <div
                className={cn(styles.header, isOpen && styles.open)}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.placeholder}>
                    {selected || placeholder}
                </div>
                <div className={cn(styles.icon, isOpen && styles.open)}></div>
            </div>
            <ul className={cn(styles.options, isOpen && styles.open)}>
                {options.map((option) => (
                    <li
                        className={cn(
                            styles.option,
                            option.label === selected && styles.selected
                        )}
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
