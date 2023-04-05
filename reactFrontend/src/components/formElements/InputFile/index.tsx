import React from "react";
import cn from "classnames";

import "./styles.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    file?: File | null;
    fileNameLabel?: string;
    labelText?: string;
}

const InputFile: React.FC<Props> = ({ className, labelText, file, fileNameLabel, ...rest }) => {
    return (
        <div className={cn("input-file", className)}>
            {labelText && <p className="input-file__label-text">{labelText}</p>}
            <div className="input-file__wrapper">
                <span className={cn("input-file__field", { "input-file__field--active": file || fileNameLabel })}>
                    {file?.name ?? fileNameLabel ?? "Выберите файл"}
                </span>
                <label className="input-file__btn" onClick={(event) => event.stopPropagation()}>
                    <span>Обзор...</span>
                    <input className="visually-hidden" value={""} type="file" {...rest} />
                </label>
            </div>
        </div>
    );
};

export default InputFile;
