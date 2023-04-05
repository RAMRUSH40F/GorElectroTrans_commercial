import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import cn from "classnames";

import "./styles.scss";

type Props = NumericFormatProps;

const InputNumber: React.FC<Props> = ({ className, ...rest }) => {
    return <NumericFormat {...rest} className={cn("input-number", className)} />;
};

export default InputNumber;
