# SolarCheck - PV-Ertragsrechner

Ein vollständiger Photovoltaik-Ertragsrechner zur Berechnung von Solarerträgen, Amortisationszeiten und Umweltauswirkungen.

## Inhaltsverzeichnis

- [Über das Projekt](#über-das-projekt)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [Berechnungsgrundlagen](#berechnungsgrundlagen)
- [API-Dokumentation](#api-dokumentation)
- [Projektstruktur](#projektstruktur)
- [Tests](#tests)
- [Deployment](#deployment)

## Über das Projekt

SolarCheck ist ein interaktiver Rechner, der potenzielle Photovoltaik-Anlagenbetreiber bei der Entscheidungsfindung unterstützt. Die Anwendung berechnet basierend auf individuellen Gebäude- und Verbrauchsdaten:

- Jährlichen Stromertrag
- Finanzielle Einsparungen und Amortisationszeit
- CO₂-Ersparnis
- Eigenverbrauchsquote und Autarkiegrad
- Praktische Vergleichswerte (E-Auto/E-Bike Reichweite, Homeoffice-Abdeckung)

## Features

- **Benutzerfreundliche Multi-Step-Form**: Schrittweise Erfassung aller relevanten Daten
- **Präzise Berechnungen**: Berücksichtigung von Ausrichtung, Neigung, Verschattung und Degradation
- **Umfassende Ergebnisse**: Finanzielle, ökologische und praktische Kennzahlen
- **Responsive Design**: Optimiert für Desktop und Mobile
- **MongoDB Integration**: Persistente Speicherung von Benutzerdaten
- **RESTful API**: Saubere Backend-Architektur mit Spring Boot

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
- **Spring Data MongoDB**
- **Maven**
- **JUnit & Embedded MongoDB** für Tests

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **Axios**

### DevOps & Tools
- **Docker**
- **SonarCloud** (Code Quality)
- **JaCoCo** (Code Coverage)

## Voraussetzungen

- **Java 21** oder höher
- **Node.js 18+** und npm
- **MongoDB** (lokal oder Cloud-Instanz)
- **Maven 3.6+**

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/dlmmr/SolarCheck-CapstoneProject.git
cd SolarCheck-CapstoneProject
```

### 2. Backend Setup

```bash
cd backend

# MongoDB Connection String konfigurieren
# Erstelle eine application.properties Datei in src/main/resources/
echo "spring.data.mongodb.uri=mongodb://localhost:27017/solarcheck" > src/main/resources/application.properties

# Dependencies installieren und Build
mvn clean install

# Backend starten
mvn spring-boot:run
```

Das Backend läuft nun auf `http://localhost:8080`

### 3. Frontend Setup

```bash
cd ../frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Das Frontend läuft nun auf `http://localhost:5173`

## Verwendung

1. **Startseite**: Klicke auf "Ertragsrechner starten"
2. **Benutzerdaten**: Gib deinen Stromverbrauch und Strompreis ein
3. **Anlagendaten**: Wähle deine PV-Module und Montagebedingungen
4. **Ergebnisse**: Erhalte detaillierte Berechnungen zu deiner geplanten Anlage

## Berechnungsgrundlagen

### Jahresertrag

```
Jahresertrag = Anlagenleistung (kWp) 
             × Ausrichtungsfaktor 
             × Neigungsfaktor 
             × (1 - Verschattungsfaktor) 
             × Solarstrahlung (1000 W/m²) 
             × Clipping-Faktor
```

### Faktoren

- **Ausrichtung**: Süd (1.0), Südost/Südwest (0.95), Ost/West (0.8), Nord (0.5)
- **Neigung**: Optimal bei 30° (1.0), Abweichung reduziert Ertrag um 1% pro Grad
- **Degradation**: 0.5% pro Jahr über 25 Jahre Systemlebensdauer
- **CO₂-Ersparnis**: 0.4 kg CO₂ pro kWh Solarstrom
- **Solarstrahlung**: in Deutschland: ca. 1000 kWh/m²/Jahr (typischer Bereich: 950–1200 kWh/m²)

### Eigenverbrauch

Die Eigenverbrauchsquote wird dynamisch berechnet basierend auf dem Verhältnis von PV-Ertrag zu Stromverbrauch:
- ≤30% Überdeckung: 70% Eigenverbrauch
- ≤70% Überdeckung: 50% Eigenverbrauch
- ≤100% Überdeckung: 35% Eigenverbrauch
- >150% Überdeckung: 20% Eigenverbrauch

## API-Dokumentation

### Endpoints

#### POST `/api/home`
Erstellt einen neuen Benutzer mit UUID.

**Response:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userInfo": null,
  "userConditions": null,
  "userResult": null
}
```

#### PUT `/api/home/{userId}/info`
Aktualisiert Benutzerinformationen.

**Request Body:**
```json
{
  "userElectricityConsumption": 4000,
  "userRateOfElectricity": 35.5
}
```

#### PUT `/api/home/{userId}/conditions`
Aktualisiert Anlagenbedingungen.

**Request Body:**
```json
{
  "userPvConfig": {
    "moduleType": "STANDARD",
    "moduleCount": 4,
    "inverterWatt": 800
  },
  "montageDirection": "SOUTH",
  "montageAngle": 30,
  "montageShadeFactor": 0.1
}
```

#### POST `/api/home/{userId}/result`
Berechnet das Ergebnis basierend auf gespeicherten Daten.

**Response:**
```json
{
  "possibleElectricity": 5200,
  "savings": 1846,
  "amortisationTime": 8.7,
  "lifetimeYield": 122500.5,
  "co2SavingsKgPerYear": 2080.0,
  "selfConsumptionRate": 0.35,
  "autarkyRate": 0.45,
  "dailyYield": 14.2,
  "dailySavings": 5.1,
  "homeofficeCoverageRate": 100.0,
  "dailyEBikeRangeKm": 946.7,
  "dailyECarRangeKm": 83.5
}
```

## Projektstruktur

```
SolarCheck-CapstoneProject/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/org/example/backend/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   ├── model/         # Domain Models
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── mapper/        # DTO Mapper
│   │   │   │   └── repo/          # MongoDB Repositories
│   │   │   └── resources/
│   │   └── test/                  # Unit & Integration Tests
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── page/                  # Page Components
│   │   ├── assets/                # Static Assets
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Tests

### Backend Tests ausführen

```bash
cd backend
mvn test

# Mit Coverage Report
mvn clean test jacoco:report
```

Coverage Reports werden in `target/site/jacoco/index.html` generiert.

### Frontend Tests

```bash
cd frontend
npm run lint
npm run build
```

## Deployment

Das Projekt kann mit Docker deployed werden:

```bash
# Backend Docker Image bauen
cd backend
docker build -t solarcheck-backend .

# Frontend Docker Image bauen
cd ../frontend
docker build -t solarcheck-frontend .
```

Oder nutze `docker-compose` für lokales Deployment mit allen Services.

## Autor

**DLMMR**
- GitHub: [@dlmmr](https://github.com/dlmmr)

## Acknowledgments

- Spring Boot Community
- React Team
- Alle Contributors, die dieses Projekt unterstützen

---

Wenn dir dieses Projekt gefällt, gib ihm einen Stern auf GitHub!
