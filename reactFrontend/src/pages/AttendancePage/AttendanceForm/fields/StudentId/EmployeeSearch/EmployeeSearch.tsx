import { FC } from "react";

import classNames from "classnames";
import { useGate, useUnit } from "effector-react";
import { useFormikContext } from "formik";
import { useParams } from "react-router-dom";

import { List, ListItem } from "components/List";
import Loader from "components/Loader";
import Search from "components/Search";

import { AttendanceFormState } from "../../..";

import {
    $debouncedSearch,
    $employees,
    $error,
    $isFetching,
    $isLoading,
    $isSuccess,
    $search,
    employeeSearchGate,
    searchChanged,
} from "./model";

import styles from "./styles.module.scss";

export const EmployeeSearch: FC = () => {
    const { divisionId = "" } = useParams();

    const { isSubmitting } = useFormikContext<AttendanceFormState>();

    const searchValue = useUnit($search);

    useGate(employeeSearchGate, { depId: divisionId });

    return (
        <div className={styles.container}>
            <Search
                value={searchValue}
                onChange={(event) => searchChanged(event.target.value)}
                placeholder="Поиск сотрудника..."
                disabled={isSubmitting}
            />
            <EmployeesList />
            <EmployeesSearchMessage />
            <EmployeesSearchError />
            <EmployeesLoader />
        </div>
    );
};

function EmployeesList() {
    const [employees, isSuccess, isFetching] = useUnit([
        $employees,
        $isSuccess,
        $isFetching,
    ]);

    if (!employees.length || !isSuccess) return null;

    return (
        <List className={styles.employeesList}>
            {employees.map((employee) => (
                <ListItem key={employee.studentId} disabled={isFetching}>
                    <div className={styles.employeeName}>
                        {employee.fullName}, {employee.studentId}
                    </div>
                </ListItem>
            ))}
        </List>
    );
}

function EmployeesSearchMessage() {
    const [search, debouncedSearch, employees, isSuccess] = useUnit([
        $search,
        $debouncedSearch,
        $employees,
        $isSuccess,
    ]);

    let message: string | null = null;

    if (!search || (search && !debouncedSearch)) {
        message = "Введите имя для поиска";
    }

    if (search && debouncedSearch && isSuccess && !employees.length) {
        message = "Сотрудник не найден";
    }

    return message ? <div className={styles.listMessage}>{message}</div> : null;
}

function EmployeesSearchError() {
    const [error] = useUnit([$error]);

    if (!error) return null;

    return (
        <div className={classNames(styles.listMessage, styles.errorMessage)}>
            {error}
        </div>
    );
}

function EmployeesLoader() {
    const isLoading = useUnit($isLoading);

    if (!isLoading) return null;

    return (
        <div className={styles.loaderContainer}>
            <Loader className={styles.loader} />
        </div>
    );
}
