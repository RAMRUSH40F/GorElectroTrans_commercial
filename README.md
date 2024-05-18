# LessonTestApp
Приложение для управлния расписаием создано в рамках курса "Проектная деятельность бакалавра" для последующей установки на него системы мониторинга.

Стек:
Java, Spring Framework, MariaDb(MySql), JWT, Docker, Grafana, Prometheus 


## Запуск
Создать контейнеры с помощью docker-compose.yaml.
Имея docker, в директории services исполнить команду 'docker compose up':
- Поднимается база данных в докер контейнере на порте localhost:3306 + накатиться схема БД
- Поднимается Prometheus на localhost:9090
- Поднимается Grafana на localhost:3000


