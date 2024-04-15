import React from "react";

import cn from "classnames";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import styles from "./styles.module.scss";

type Props = NumericFormatProps;

const InputNumber: React.FC<Props> = ({ className, ...rest }) => {
    return <NumericFormat {...rest} className={cn(styles.input, className)} />;
};

export default InputNumber;
