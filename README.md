# Travel Planer

Web aplikacija za planiranje putovanja. Korisnik može na jednom mjestu da
organizuje sve važne informacije o putovanju: osnovne podatke, destinacije,
dnevni plan aktivnosti, troškove i budžet, checklist, kao i dijeljenje plana
sa drugim korisnicima.

## Tehnologije

### Frontend
- React 19 (Create React App)
- React Router DOM 6
- Bootstrap 5 + Bootstrap Icons
- Recharts (grafikon budžeta)
- React Big Calendar (kalendarski prikaz aktivnosti)
- qrcode.react (QR kod za dijeljenje)
- Context API (upravljanje stanjem autentikacije)
- jwt-decode (dekodiranje JWT tokena)

### Backend (planirano)
- Mikroservisna arhitektura na Microsoft Service Fabric platformi
- Stateless i stateful servisi
- ASP.NET Core Web API u svakom servisu
- Microsoft SQL Server (Entity Framework Core, code-first migracije)
- JWT autentikacija sa potpisom i validacijom isteka

## Struktura repozitorija

```
travel-planer/
├── frontend/                  # React aplikacija
│   ├── public/
│   ├── src/
│   │   ├── components/        # Komponente (svaka u svom folderu)
│   │   ├── pages/             # Stranice
│   │   ├── services/          # HTTP servisi (injektuju se u komponente)
│   │   ├── context/           # AuthContext, PrivateRoute
│   │   └── models/            # Modeli na prednjoj strani sa validacijom
│   ├── .env                   # REACT_APP_API_BASE_URL i REACT_APP_API_PREFIX
│   └── package.json
├── backend/                   # Service Fabric solucija (radi se na Windows-u)
└── README.md
```

## Pokretanje frontenda

Frontend je u potpunosti razvijen i može se pokrenuti na bilo kojoj platformi
(macOS, Linux, Windows).

### Preduslovi
- Node.js 18+ (preporučuje se 20)
- npm 9+

### Instalacija
```bash
cd frontend
npm install
```

### Konfiguracija
Editujte `frontend/.env` da pokazuje na URL backend-a:
```
REACT_APP_API_BASE_URL=http://localhost:5145/
REACT_APP_API_PREFIX=api/
```

### Razvoj
```bash
npm start
```
Aplikacija se otvara na `http://localhost:3000`.

### Produkcijski build
```bash
npm run build
```

## Pokretanje backenda

Backend se razvija na Windows mašini sa instaliranim Service Fabric SDK-om
(`microsoft-service-fabric`, `microsoft-service-fabric-sdk`,
Visual Studio sa Service Fabric Tools-om). Lokalni Service Fabric cluster nije
podržan na macOS-u/Linux-u, te se ovaj dio mora pokretati na Windows-u
(direktno ili u Windows VM-u).

Detaljnija uputstva za podizanje SQL Server-a i deployment Service Fabric
solucije biće dodata u `backend/README.md` kada backend bude implementiran.

## Funkcionalnosti

- Registracija i prijava korisnika (JWT, role User/Admin)
- CRUD nad planovima putovanja
- CRUD nad destinacijama u okviru plana
- CRUD nad aktivnostima sa kalendarskim prikazom
- Evidencija troškova po kategorijama, sa pregledom budžeta i grafikonom
- Checklist / packing lista sa označavanjem završenih stavki
- Dijeljenje plana putovanja preko QR koda (VIEW i EDIT pristup)
- Administratorska stranica za upravljanje korisnicima
- Validacija svih unosa na klijentu (datumi, budžet, obavezna polja)

## Arhitektura prednje strane

- **Komponente** — svaka u svom folderu (`components/<Ime>/<Ime>.js[.css]`)
- **Stranice** — odvojene od komponenti (`pages/<Ime>/<Ime>Page.js`)
- **HTTP pozivi** — isključivo kroz servise iz `services/`. Komponente
  nikada ne pozivaju `fetch` direktno.
- **Modeli** — `models/` sadrži `TravelPlan`, `Destination`, `Activity`,
  `Expense`, `ChecklistItem`, `User` itd. Svaki model ima `fromDto()` factory
  i `validate()` metod (mapiranje DTO ↔ frontend model).
- **State** — `Context API` (`context/authContext.js`) za autentikaciju i
  ulogu; lokalni `useState` u komponentama za UI stanje.
- **Konfiguracija** — `.env` (URL backend-a, REST prefix), čita ga
  `services/urlService/`. Komponente nikada direktno ne čitaju `process.env`.

## Očekivani backend ugovor

Frontend gađa sljedeće rute (REST konvencija — resursi u množini, pluralizovani):

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users
GET    /api/users/me
GET    /api/users/{id}
PUT    /api/users/{id}/role
DELETE /api/users/{id}

GET    /api/travel-plans
GET    /api/travel-plans/{id}
POST   /api/travel-plans
PUT    /api/travel-plans/{id}
DELETE /api/travel-plans/{id}

GET    /api/travel-plans/{planId}/destinations
GET    /api/travel-plans/{planId}/destinations/{id}
POST   /api/travel-plans/{planId}/destinations
PUT    /api/travel-plans/{planId}/destinations/{id}
DELETE /api/travel-plans/{planId}/destinations/{id}

GET    /api/travel-plans/{planId}/activities
GET    /api/travel-plans/{planId}/activities/{id}
POST   /api/travel-plans/{planId}/activities
PUT    /api/travel-plans/{planId}/activities/{id}
DELETE /api/travel-plans/{planId}/activities/{id}

GET    /api/travel-plans/{planId}/expenses
GET    /api/travel-plans/{planId}/expenses/{id}
GET    /api/travel-plans/{planId}/expenses/summary
POST   /api/travel-plans/{planId}/expenses
PUT    /api/travel-plans/{planId}/expenses/{id}
DELETE /api/travel-plans/{planId}/expenses/{id}

GET    /api/travel-plans/{planId}/checklist-items
POST   /api/travel-plans/{planId}/checklist-items
PUT    /api/travel-plans/{planId}/checklist-items/{id}
DELETE /api/travel-plans/{planId}/checklist-items/{id}

GET    /api/travel-plans/{planId}/shares
POST   /api/travel-plans/{planId}/shares
DELETE /api/travel-plans/{planId}/shares/{id}
GET    /api/shared-plans/{token}
```

Login odgovor može biti čist JWT string ili `{ "token": "..." }` —
frontend podržava oba.

## Validacije

- Krajnji datum putovanja/destinacije ne može biti prije početnog
- Budžet i iznos troška ne mogu biti negativni
- Email mora biti u validnom formatu
- Lozinka mora imati najmanje 6 karaktera
- Korisničko ime najmanje 3 karaktera
- Datum aktivnosti mora biti unutar trajanja plana

## Bezbjednost

- Lozinke se moraju heširati na backend-u (ne čuvaju se u plain-text obliku)
- JWT potpis i istek se moraju validirati pri svakom zahtjevu
- `PrivateRoute` štiti rute na klijentskoj strani; backend provjerava token
  kao izvor istine
- Brisanje plana automatski briše sve povezane entitete (kaskadno brisanje)

## Predaja

Pored koda, prilažu se:
- Use Case dijagram (`UseCaseDiagram.svg` ili `.png`)
- Dijagram arhitekture sistema
- Ovaj README

---

Frontend je razvijen na macOS-u, backend (Service Fabric) se razvija na
Windows mašini.