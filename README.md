# LessonTestApp
Приложение для управлния расписаием создано в рамках курса "Проектная деятельность бакалавра" для последующей установки на него системы мониторинга.

Стек:
Java, Spring Framework, MariaDb(MySql), JWT, Docker, Grafana, Prometheus 

## Возможности 
Авторизоваться и response header получить jwt-token:
POST localhost:8082/auth/login
{
"username": "LolsaF",
"password": "125125"
}

Создать урок (header Authorization положить jwt token)
POST localhost:8082/dep_1/work_plan/data
{
"topic": "Тема занятия",
"duration": 4.5,
"date": "2024-04-02",
"teacher": "Комисаржевский Л.М.",
"teacherPost": "Специалист",
"peoplePlanned": 45
}
Также можно изменять, удалять, получать уроки.


## Запуск
Создать контейнеры с помощью docker-compose.yaml.
Имея docker, в директории services исполнить команду 'docker compose up':
- Поднимается база данных в докер контейнере на порте localhost:3306 + накатиться схема БД. Данные для входа root и testpass
- Поднимается Prometheus на localhost:9090
- Поднимается Grafana на localhost:3000 (Учетка admin admin)

Подтяните зависимости, используя maven(чаще всего ide автоматически их подтягивает)
В мониторинг системе пока что нет данных, потому что приложение Application.java не запущено. Запустите java-приложение, используя ваше IDE.





