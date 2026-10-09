# VTSAA Enterprises

A native React Native / Expo mobile app with a Java Spring Boot 4 API and PostgreSQL database.

## Mobile app

Requirements: Node.js 20.19+ and npm.

1. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` for the device or emulator you are using.
2. Install packages with `npm install`.
3. Start Expo with `npm start`, then open the project in Expo Go or a development build.

The sample Android emulator URL uses `10.0.2.2`. For a physical phone, set the API URL to the development computer's local network address. The app displays a connection error instead of substituting made-up figures when it cannot reach the API.

The four bottom-bar items are visual placeholders only. Their destination screens will be added when their requirements are provided.

## Spring Boot API and PostgreSQL

Requirements: JDK 21, Maven, and PostgreSQL.

1. Create a PostgreSQL database named `vtsaa_enterprises`.
2. Set the connection details in the shell; do not put database credentials in source control.
3. From the project root, start the API:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/vtsaa_enterprises"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "<your local PostgreSQL password>"
$env:SAMPLE_DATA_ENABLED = "true"
Set-Location backend
mvn spring-boot:run
```

The database schema is created by Flyway at startup. The API listens at `http://localhost:8080/api`.

`SAMPLE_DATA_ENABLED=true` inserts six months of clearly marked sample records into an empty database for development only. It defaults to `false`; do not enable it in a production environment. The monthly profit demo currently uses income minus the four listed expense categories. Replace this demo calculation with the company's confirmed accounting rule before loading real financial records.

### Dashboard endpoint

`GET /api/dashboard?month=YYYY-MM` returns the selected month's INR totals, the four expense-category totals, and a six-month expense trend. Omitting `month` selects the current month. Invalid month values return HTTP 400.

## Validation

```powershell
npm run lint
npx expo export --platform android
Set-Location backend
mvn test
```
