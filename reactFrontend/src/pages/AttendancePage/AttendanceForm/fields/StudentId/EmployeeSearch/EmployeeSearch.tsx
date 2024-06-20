import { FC } from "react";

import { useFormikContext } from "formik";

import { List, ListItem } from "components/List";
import Search from "components/Search";

import { AttendanceFormState } from "../../..";

import styles from "./styles.module.scss";

export const EmployeeSearch: FC = () => {
    const { isSubmitting } = useFormikContext<AttendanceFormState>();

    return (
        <div>
            <Search placeholder="Поиск сотрудника..." disabled={isSubmitting} />
            <EmployeesList />
        </div>
    );
};

function EmployeesList() {
    return (
        <List className={styles.employeesList}>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 48824
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 42245
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 32343
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 32343
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 32343
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 32343
                </div>
            </ListItem>
            <ListItem>
                <div className={styles.employeeName}>
                    Леонов Александр Александрович, 32343
                </div>
            </ListItem>
        </List>
    );
}
