# Микросервисная архитектура для системы учета тренировок стрелков

## Описание проекта

Система предназначена для учета тренировок стрелков-спортсменов, включая свободные и квалификационные (зачетные) тренировки, серии, выстрелы и заметки. Система построена на микросервисной архитектуре с использованием Node.js, Express, TypeScript, PostgreSQL и RabbitMQ для асинхронной коммуникации между сервисами.

## Документация

#### Общие пакеты (`packages/`)

- **common**: Клиент RabbitMQ и типы для межсервисного взаимодействия
- **dto**: Объекты передачи данных (DTO) для API

#### Микросервисы

- **auth-service**: Аутентификация и управление пользователями
- **training-service**: Управление тренировками, сериями и выстрелами
- **reference-service**: Справочные данные (мишени, оружие, упражнения)
- **notes-service**: Заметки к тренировкам и сериям

### Архитектурная документация

#### Микросервисы

### API Gateway

- Маршрутизация запросов к соответствующим микросервисам
- Единая точка входа для клиентов
- Реализован на Nginx
- Порт: 80

### Auth Service (Сервис аутентификации)

- Регистрация и аутентификация пользователей
- Управление пользователями
- Проверка JWT токенов
- Порт: 8001
- База данных: PostgreSQL (authdb)
- RabbitMQ: Публикация событий о создании/обновлении/удалении пользователей

### Training Service (Сервис тренировок)

- Управление свободными и квалификационными тренировками
- Управление сериями и выстрелами
- Управление спортсменами и тренерами
- Порт: 8002
- База данных: PostgreSQL (trainingdb)
- RabbitMQ: Публикация событий о создании/обновлении/удалении тренировок и обновлении прогресса

### Reference Service (Сервис справочных данных)

- Управление мишенями
- Управление типами оружия
- Управление упражнениями
- Порт: 8003
- База данных: PostgreSQL (referencedb)

### Notes Service (Сервис заметок)

- Управление заметками к тренировкам
- Управление заметками к сериям
- Порт: 8004
- База данных: PostgreSQL (notesdb)
- RabbitMQ: Подписка на события о создании/обновлении/удалении тренировок

## RabbitMQ

### Очереди

- `training.created` - событие создания тренировки
- `training.updated` - событие обновления тренировки
- `training.deleted` - событие удаления тренировки
- `training.progress` - событие обновления прогресса тренировки
- `user.created` - событие создания пользователя
- `user.updated` - событие обновления пользователя
- `user.deleted` - событие удаления пользователя

### Мониторинг

- Веб-интерфейс RabbitMQ: http://localhost:15672
- Логин: admin
- Пароль: admin

## Запуск проекта

### Предварительные требования

- Docker и Docker Compose
- Node.js и npm (для разработки)

### Шаги для запуска

1. Клонировать репозиторий:

```bash
git clone <repository-url>
cd <repository-folder>
```

2. Создать файлы .env для каждого сервиса в соответствующих директориях (auth-service, training-service, reference-service, notes-service)

3. Установить зависимости и собрать контейнеры:

```bash
# Установка зависимостей
npm install

# Сборка контейнеров
docker-compose build

# Запуск проекта
docker-compose up -d
```

4. Проверить работоспособность:

- API Gateway: http://localhost:80
- Swagger UI для Auth Service: http://localhost:80/api-docs/auth
- Swagger UI для Training Service: http://localhost:80/api-docs/training
- Swagger UI для Reference Service: http://localhost:80/api-docs/reference
- Swagger UI для Notes Service: http://localhost:80/api-docs/notes
- Prometheus: http://localhost:80/prometheus
- Grafana: http://localhost:80/grafana (логин: admin, пароль: admin)
- RabbitMQ Management: http://localhost:15672 (логин: guest, пароль: guest)

### Проверка RabbitMQ

1. Создание тренировки:

```bash
curl -X POST http://localhost:8002/trainings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "athleteId": 1,
    "start_ts": "2024-03-20T10:00:00Z",
    "weaponTypeId": 1,
    "targetId": 1
  }'
```

2. Обновление прогресса тренировки:

```bash
curl -X PATCH http://localhost:8002/trainings/1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "progress": 85
  }'
```

3. Удаление тренировки:

```bash
curl -X DELETE http://localhost:8002/trainings/1 \
  -H "Authorization: Bearer <your-token>"
```

## Структура проекта

```
.
├── api-gateway/
│   ├── Dockerfile
│   └── nginx.conf
├── auth-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   └── ...
├── training-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   └── ...
├── reference-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   └── ...
├── notes-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   └── ...
├── prometheus/
│   └── prometheus.yml
├── monitoring/
│   └── grafana/
│       ├── dashboards/
│       └── provisioning/
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
└── README.md
```

## API Endpoints

### Auth Service

- `POST /api/auth/register` - Регистрация нового пользователя
- `
