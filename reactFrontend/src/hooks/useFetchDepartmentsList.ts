import { useEffect, useState } from "react";
import { IDepartment } from "../models/Department";
import axios from "axios";
import DepartmentService from "../services/DepartmentService";

export const useFetchDepartmentsList = (depId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    // const { logout } = useUserContext();

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        setDepartments([]);

        const cancelToken = axios.CancelToken.source();

        const fetchDepartments = async () => {
            try {
                const response = await DepartmentService.fetch(depId, {
                    cancelToken: cancelToken.token,
                });
                setDepartments(response.data);
            } catch (error) {
                const err = error as any;
                if (err.response.status === 401) {
                    // logout();
                } else {
                    setError(err?.response?.data?.message ?? "Не удалось получить данные с сервера");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();

        return () => cancelToken.cancel();
    }, [depId]);

    return { departments, isLoading, error };
};
