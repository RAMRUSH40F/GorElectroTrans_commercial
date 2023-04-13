import React from "react";
import DropDown, { ReactDropdownProps } from "react-dropdown";
import cn from "classnames";

import "react-dropdown/style.css";
import "./styles.scss";

type Props = ReactDropdownProps;

const Select: React.FC<Props> = ({ options, className, ...rest }) => {
    return <DropDown className={cn("drop-down", className)} options={options} {...rest} />;
};

export default Select;
