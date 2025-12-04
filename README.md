# Brando Call Center — Zadarma & Telegram Integration

Интеграция входящих звонков через **Zadarma** и отправка заказов мастерам через **Telegram бот**.

## Реализовано

### 1. Входящие звонки (Zadarma)
- **Zadarma Service** (`server/zadarma-service.ts`) обрабатывает входящие звонки
- **Webhook** (`GET /api/zadarma/webhook`) получает события от Zadarma
- **WebSocket** отправляет события в браузер (OperatorPanel) в реальном времени
- Оператор видит всплывающее уведомление о входящем звонке и может принять/отклонить

### 2. Заказы → Telegram (мастеру)
- **Tickets Service** (`server/tickets-service.ts`) управляет заказами
- **Telegram Service** (`server/telegram-service.ts`) отправляет заказы в Telegram мастеру
- Мастер получает сообщение с кнопками **Qabul qilaman** (Принять) и **Rad etaman** (Отклонить)
- При нажатии кнопки заказ обновляется в системе и все клиенты видят изменение через WebSocket

## Переменные окружения (.env)

```bash
# Zadarma (входящие звонки)
ZADARMA_API_KEY=your_api_key
ZADARMA_SECRET_KEY=your_secret_key

# Telegram (отправка заказов мастерам)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MASTER_TELEGRAM_MAP={"master1":"123456789","master2":"987654321"}

# База данных
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Сервер
SESSION_SECRET=change_this_secret
PORT=5000
NODE_ENV=development
```

## Настройка Zadarma

1. Зарегистрируйтесь на https://my.zadarma.com/
2. Получите API ключи: Settings → API Key Management
3. Настройте webhook в Dashboard:
   - **Webhook URL**: `https://your-server.com/api/zadarma/webhook`
   - **Events**: выберите `inbound_call`
4. При входящем звонке Zadarma отправит:
   ```
   GET /api/zadarma/webhook?event=inbound_call&caller=%2B998...&call_id=123&signature=...
   ```

## Настройка Telegram бота

1. Напишите @BotFather в Telegram
2. Создайте нового бота командой `/newbot`
3. Скопируйте полученный token
4. Установите webhook:
   ```bash
   curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook \
     -H "Content-Type: application/json" \
     -d '{"url":"https://your-server.com/api/telegram/webhook"}'
   ```
5. Найдите chat_id мастеров:
   - Напишите боту `/start`
   - Скопируйте `chat_id` из ответа
6. Добавьте в .env:
   ```
   MASTER_TELEGRAM_MAP={"master1":"123456789","master2":"987654321"}
   ```

## API Endpoints

### Заказы (Tickets)
- `POST /api/tickets` — создать заказ (если указан masterId, отправляет в Telegram)
- `GET /api/tickets` — получить все заказы

### Звонки (Calls)
- `GET /api/zadarma/webhook` — webhook от Zadarma для входящих звонков
- `POST /api/calls/:callId/accept` — принять звонок (отправляет operatorId)
- `POST /api/calls/:callId/reject` — отклонить звонок
- `POST /api/calls/:callId/end` — завершить звонок (отправляет duration)
- `GET /api/calls` — получить список всех звонков

### Telegram
- `POST /api/telegram/webhook` — webhook от Telegram для обработки callback_query (нажатия кнопок)

## Локальная проверка с ngrok

```bash
npm install
npm run dev

# В другом терминале
npx ngrok http 5000
```

Скопируйте полученный ngrok URL и используйте его в настройках Zadarma и Telegram webhook:
```
https://<YOUR_NGROK_URL>/api/zadarma/webhook
https://<YOUR_NGROK_URL>/api/telegram/webhook
```

## Тестирование

### 1. Создание заказа (отправка мастеру в Telegram)
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "number": "#001",
    "customerName": "John Doe",
    "customerPhone": "+998901234567",
    "customerAddress": "Tashkent, Uzbekistan",
    "deviceType": "Smartphone",
    "issueDescription": "Screen broken",
    "masterId": "master1"
  }'
```

Мастер должен получить сообщение в Telegram с кнопками.

### 2. Входящий звонок (через Zadarma)
Позвоните на ваш Zadarma номер — оператор должен увидеть всплывающее уведомление в браузере (OperatorPanel).

### 3. Обработка ответа мастера
Когда мастер нажимает кнопку в Telegram, сервер:
- Получает callback_query от Telegram на `/api/telegram/webhook`
- Обновляет статус заказа
- Отправляет обновление через WebSocket всем клиентам

## Примечания

- Для продакшена используйте HTTPS и WSS (WebSocket Secure)
- Проверяйте логи сервера для отладки webhook-событий
- Zadarma поддерживает узбекские номера (+998) и международные номера
- Telegram webhook может быть установлен несколько раз, переписав предыдущий
- При необходимости добавьте запись разговоров или переадресацию на SIP-клиент оператора

