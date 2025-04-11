# GorElectroTrans_commercial
Приложение для управлния расписанием занятий, посещаемостью, работой с конспектами и формированию аналитических отчетов

## Функциональные требования
* Создаваемая система позволяет согласовывать планы по обучению сотрудников, 
* Отмечать результаты занятий, 
* Формировать отчеты(аггрегировать данные в excel), 
* Обмениваться изменениями в планах 
* Возможность прикреплять учебные материалы(файлы) к занятия
* Система может быть расширена для решения многих задач похожего типа в других компаниях.

## info
С этим проектом мы выиграли конкурс Проектной деятельности СПБПУ (200 команд-участников) 
Проект был с реальным заказчиком (система постоянно используется и сегодня, активно). Сейчас проект дорабатывается как домашний.

# Use-case and ER diagram
## ER
![ER](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/ER.png?raw=true)

## Видео-демонстарция и скринщоты интерфейса

https://disk.yandex.ru/i/znwMAeVWQqhYWg
https://disk.yandex.ru/i/7pEqwAfsOMliEQ

## USE_CASE_STUDENT
![USE_CASES_lesson](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/lesson.png?raw=true)
![USE_CASES_STUDENT](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/student.png?raw=true)
![USE_CASES_ATTENDANCE](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/attendance.png?raw=true)
![USE_CASES_data_export](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/data_export.png?raw=true)
![USE_CASES_lesson_content](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/lesson_content.png?raw=true)
![USE_CASES_accounts](https://github.com/RAMRUSH40F/GorElectroTrans_commercial/blob/master/UseCase/accpunts.png?raw=true)

## USE_CASE_ALL
[USE_CASES_ALL](https://gitverse.ru/ramrush/GorElectroTrans_commercial/content/master/UseCase)

## Стек:
Java, Spring (Core, Boot, Data JPA, Spring AOP), React, MariaDb(MySql), JWT, Docker, Liquidbase,Maven,REST API

## Запуск
Создать контейнеры с помощью docker-compose.yaml.
Имея docker, в директории services исполнить команду 'docker compose up':
- Поднимается база данных в докер контейнере на порте localhost:3306 + накатиться схема БД. Данные для входа root и testpass
- Поднимается приложение на localhost:8080
