package project.dataSource;

import java.util.Date;

public class DynamicDataSourceContextHolder {

    private static final ThreadLocal<String> dataSourceHolder = new ThreadLocal<>();

    public static void setCurrentDataSource(String dataSource) {
        dataSourceHolder.set(dataSource);
    }

    public static String getCurrentDataSource() {
        if (dataSourceHolder.get() == null) {
            throw new IllegalArgumentException("Запрос без определенной базы данных: " + new Date());
        }
        return dataSourceHolder.get();
    }

    public static void clearDatasourceInfo() {
        dataSourceHolder.remove();
    }
}
