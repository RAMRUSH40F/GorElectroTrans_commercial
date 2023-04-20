import React, { useState } from "react";
import cn from "classnames";
import Input from "../formElements/Input";
import { useSearchParams } from "react-router-dom";
import { useDeboucedCallback } from "../../hooks/useDebouncedCallback";

import "./styles.scss";

type Props = {
    className?: string;
};

const Search: React.FC<Props> = ({ className }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setValue] = useState(searchParams.get("key") || "");

    const debouncedSearch = useDeboucedCallback((value) => {
        value ? searchParams.set("key", value) : searchParams.delete("key");
        setSearchParams(searchParams);
    }, 600);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value);
        setValue(event.target.value);
    };

    return (
        <div className={cn("search", className)}>
            <Input className="search__input" value={value} onChange={handleChange} placeholder="Поиск" />
            <svg
                className="search__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="30px"
                height="30px"
            >
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
            </svg>
        </div>
    );
};

export default Search;
