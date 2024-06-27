import React, { useRef, useState } from "react";

import cn from "classnames";
import { EnumType } from "typescript";

import useClickOutside from "../../../hooks/useClickOutside";

import styles from "./styles.module.scss";

type DropdownValue = string | number | EnumType;
type DropdownLabel = string | number;

export interface DropdownOption<
    V extends DropdownValue = string,
    L extends DropdownLabel = string,
> {
    label: L;
    value: V;
}

type SelectProps<
    V extends DropdownValue = string,
    L extends DropdownLabel = string,
> = {
    options: DropdownOption<V, L>[];
    initialOption: DropdownOption<V, L>;
    onChange: (option: DropdownOption<V, L>) => void;
    name?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

const Dropdown = <V extends DropdownValue, L extends DropdownLabel>({
    initialOption,
    options,
    placeholder,
    onChange,
    className,
    disabled,
    name,
}: SelectProps<V, L>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<DropdownLabel>(
        initialOption.label,
    );
    const selectRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(selectRef, () => setIsOpen(false));

    const handleSelect = (option: DropdownOption<V, L>) => {
        setSelected(option.label);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div
            className={cn(
                styles.select,
                disabled && styles.disabled,
                className,
            )}
            ref={selectRef}
        >
            <select
                className="visually-hidden"
                name={name}
                disabled={disabled}
            ></select>
            <div
                className={cn(styles.header, isOpen && styles.open)}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className={cn(
                        styles.headerValue,
                        !selected && styles.empty,
                    )}
                >
                    {selected ?? placeholder ?? "Выберите..."}
                </div>
                <div className={cn(styles.icon, isOpen && styles.open)} />
            </div>
            <ul className={cn(styles.options, isOpen && styles.open)}>
                {options.map((option) => (
                    <li
                        className={cn(
                            styles.option,
                            option.label === selected && styles.selected,
                        )}
                        key={String(option.value)}
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