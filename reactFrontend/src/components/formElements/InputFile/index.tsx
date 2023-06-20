import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    file?: File | null;
    fileNameLabel?: string;
    labelText?: string;
}

const InputFile: React.FC<Props> = ({
    className,
    labelText,
    file,
    fileNameLabel,
    disabled,
    ...rest
}) => {
    return (
        <div className={className}>
            {labelText && <p className={styles.text}>{labelText}</p>}
            <div className={styles.wrapper}>
                <span
                    className={cn(
                        styles.field,
                        (file || fileNameLabel) && styles.active
                    )}
                >
                    {file?.name ?? fileNameLabel ?? "Выберите файл"}
                </span>
                <label
                    className={cn(styles.label, disabled && styles.disabled)}
                    onClick={(event) => event.stopPropagation()}
                >
                    <span>Обзор...</span>
                    <input
                        className="visually-hidden"
                        value={""}
                        type="file"
                        disabled={disabled}
                        {...rest}
                    />
                </label>
            </div>
        </div>
    );
};

export default InputFile;
