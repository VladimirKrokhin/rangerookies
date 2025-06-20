# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем корневой package.json и package-lock.json
COPY package.json package-lock.json ./

# Копируем package.json каждого воркспейса
COPY auth-service/package.json ./auth-service/
COPY notes-service/package.json ./notes-service/
COPY reference-service/package.json ./reference-service/
COPY training-service/package.json ./training-service/
COPY packages/common/package.json ./packages/common/
COPY packages/dto/package.json ./packages/dto/

# Устанавливаем все зависимости, включая зависимости воркспейсов
RUN npm install

# Копируем все исходные файлы
COPY . .

# Собираем все воркспейсы
RUN npm run build

# Этап выполнения
FROM node:20-alpine

RUN apk --no-cache add curl

WORKDIR /app

# Копируем скомпилированные файлы из этапа сборки
COPY --from=builder /app/notes-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/notes-service/package.json ./package.json

# Копируем общие пакеты, необходимые для module-alias
COPY --from=builder /app/packages/dto/dist ./packages/dto/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist

EXPOSE 8004

# Запускаем приложение
CMD ["node", "-r", "module-alias/register", "dist/app.js"]