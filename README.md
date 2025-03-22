# GorElectroTrans_commercial
Приложение для управлния расписанием занятий, посещаемостью, работой с конспектами и формированию аналитических отчетов

## info
С этим проектом мы выиграли конкурс Проектной деятельности СПБПУ (200 команд-участников) 
Проект был с реальным заказчиком (система постоянно используется и сегодня, активно). Сейчас проект дорабатывается как домашний.

# Use-case and ER diagram
## ER
![ER](![image](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/ER.png?raw=true))
## USE_CASE
![USE_CASE](![image](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/tree/master/UseCase?raw=true))


## Стек:
Java, Spring (Core, Boot, Data JPA, Spring AOP), React, MariaDb(MySql), JWT, Docker, Liquidbase,Maven,REST API

## Запуск
Создать контейнеры с помощью docker-compose.yaml.
Имея docker, в директории services исполнить команду 'docker compose up':
- Поднимается база данных в докер контейнере на порте localhost:3306 + накатиться схема БД. Данные для входа root и testpass
- Поднимается приложение на localhost:8080
