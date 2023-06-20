import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = NumericFormatProps;

const InputNumber: React.FC<Props> = ({ className, ...rest }) => {
    return <NumericFormat {...rest} className={cn(styles.input, className)} />;
};

export default InputNumber;
