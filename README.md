# Travel Planer

Web aplikacija za planiranje putovanja sa mikroservisnom arhitekturom na **Microsoft Service Fabric** platformi i React frontend-om. Korisnik može da organizuje putovanje od početne ideje do detaljnog plana po danima, troškovima, checklist-i i dijeljenju plana sa drugima.

## Arhitektura

```
travel-planer/
├── frontend/                React aplikacija
│
└── TravelPlanerSF/          Service Fabric solution
    ├── TravelPlanerSF/      .sfproj (application package)
    ├── Common/              Shared library: DTOs, enums, Remoting interfaces
    ├── AuthService/         Stateless ASP.NET Core — auth + users
    ├── TravelPlanService/   Stateless ASP.NET Core — plans, destinations,
    │                        activities, expenses, checklist, sharing
    └── NotificationService/ Stateful — share tokens (Reliable Dictionary)
                             + audit log (Reliable Queue) via Remoting
```

### Mapiranje na vežbe

| Vežba | Pokriva |
|---|---|
| **V3** Stateless servisi + Remoting | AuthService i TravelPlanService kao stateless ASP.NET Core; TravelPlanService poziva NotificationService preko `ServiceProxy.Create<INotificationService>` |
| **V4** Stateful servisi + Reliable Collections | NotificationService čuva share tokene u `IReliableDictionary<string, ShareLinkDTO>` |
| **V5** EDA + Reliable Queue | Audit eventovi se publikuju u `IReliableQueue<AuditEventDTO>` koji se obrađuje u `RunAsync` background petlji |

### Tehnologije

**Frontend** — React 19 (CRA), React Router 6, Bootstrap 5, recharts (budget chart), react-big-calendar (activity calendar), qrcode.react (sharing), Context API, jwt-decode.

**Backend** — .NET 8, Microsoft Service Fabric SDK 11.x, ASP.NET Core 8, Entity Framework Core 9 (code-first), SQL Server Express, JWT (HS256), BCrypt.

## Pokretanje

### Preduslovi (Windows)
- Visual Studio 2022 (Azure development workload)
- Microsoft Service Fabric SDK + Runtime
- Local Service Fabric cluster (1-Node mode dovoljan za dev)
- SQL Server Express
- Node.js 20+ za frontend
- `dotnet ef` global tool: `dotnet tool install --global dotnet-ef`

### Backend (Windows)

1. Otvori **Visual Studio kao Administrator**
2. Otvori `TravelPlanerSF/TravelPlanerSF.sln`
3. Provjeri da je **Service Fabric Local Cluster** pokrenut (status u SF Tray-u ili http://localhost:19080/Explorer)
4. Provjeri connection string-ove u `AuthService/appsettings.json` i `TravelPlanService/appsettings.json` — pokazuju na `localhost\SQLEXPRESS`. Baze se kreiraju automatski (auto-migrate na startup-u).
5. Postavi `TravelPlanerSF` (.sfproj) kao **Startup Project**
6. **F5** za debug — VS će packagirati i deployati aplikaciju u local cluster

Servisi će biti dostupni na:
- AuthService: http://localhost:8839/
- TravelPlanService: http://localhost:8596/
- NotificationService: interno preko Remoting-a (`fabric:/TravelPlanerSF/NotificationService`)
- SF Explorer: http://localhost:19080/Explorer

#### Ručno pokretanje EF migracija (ako auto-migrate ne radi)

```powershell
cd TravelPlanerSF\AuthService
dotnet ef migrations add Initial
dotnet ef database update

cd ..\TravelPlanService
dotnet ef migrations add Initial
dotnet ef database update
```

#### Dozvole za Service Fabric (NETWORK SERVICE)

Service Fabric servisi se izvršavaju pod `NT AUTHORITY\NETWORK SERVICE` Windows korisnikom,
koji po defaultu nema pristup novokreiranim bazama. Pokreni skriptu **`TravelPlanerSF/scripts/grant-sf-permissions.sql`**
jednom u SSMS-u (otvori i F5) ili preko terminala:

```powershell
sqlcmd -S localhost\SQLEXPRESS -E -i TravelPlanerSF\scripts\grant-sf-permissions.sql
```

### Frontend (bilo koji OS)

```bash
cd frontend
npm install
npm start
```

`.env` već pokazuje na lokalne SF portove:
```
REACT_APP_AUTH_BASE_URL=http://localhost:8839/
REACT_APP_TRAVEL_BASE_URL=http://localhost:8596/
REACT_APP_API_PREFIX=api/
```

Aplikacija se otvara na http://localhost:3000.

## Backend ugovor (REST rute)

```
POST   /api/auth/login                                            (AuthService)
POST   /api/auth/register                                         (AuthService)
GET    /api/users                  [Admin]                        (AuthService)
GET    /api/users/me                                              (AuthService)
PUT    /api/users/{id}/role        [Admin]                        (AuthService)
DELETE /api/users/{id}             [Admin]                        (AuthService)

GET    /api/travel-plans                                          (TravelPlanService)
GET    /api/travel-plans/{id}                                     (TravelPlanService)
POST   /api/travel-plans                                          (TravelPlanService)
PUT    /api/travel-plans/{id}                                     (TravelPlanService)
DELETE /api/travel-plans/{id}                                     (TravelPlanService)

GET    /api/travel-plans/{planId}/destinations                    (TravelPlanService)
POST   /api/travel-plans/{planId}/destinations
PUT    /api/travel-plans/{planId}/destinations/{id}
DELETE /api/travel-plans/{planId}/destinations/{id}

GET    /api/travel-plans/{planId}/activities                      (TravelPlanService)
POST   /api/travel-plans/{planId}/activities
PUT    /api/travel-plans/{planId}/activities/{id}
DELETE /api/travel-plans/{planId}/activities/{id}

GET    /api/travel-plans/{planId}/expenses                        (TravelPlanService)
POST   /api/travel-plans/{planId}/expenses
PUT    /api/travel-plans/{planId}/expenses/{id}
DELETE /api/travel-plans/{planId}/expenses/{id}

GET    /api/travel-plans/{planId}/checklist-items                 (TravelPlanService)
POST   /api/travel-plans/{planId}/checklist-items
PUT    /api/travel-plans/{planId}/checklist-items/{id}
DELETE /api/travel-plans/{planId}/checklist-items/{id}

GET    /api/travel-plans/{planId}/shares                          (TravelPlanService → Remoting → NotificationService)
POST   /api/travel-plans/{planId}/shares
DELETE /api/travel-plans/{planId}/shares/{id}

GET    /api/shared-plans/{token}    [Anonymous]                   (TravelPlanService → Remoting → NotificationService)
```

## Bezbjednost

- Lozinke se heširaju **BCrypt**-om prije čuvanja
- JWT potpis (HMAC SHA256) i istek se validiraju na svakom zahtjevu (`ValidateLifetime=true`)
- `[Authorize]` štiti sve rute osim `/api/auth/*`, `/api/shared-plans/{token}`
- `[Authorize(Roles = "Admin")]` štiti administracijske akcije

## Validacije

- Krajnji datum (plana, destinacije) ne može biti prije početnog
- Budžet i iznos troška ne mogu biti negativni
- Email mora biti u validnom formatu
- Lozinka najmanje 6 karaktera
- Korisničko ime najmanje 3 karaktera
- Cascading delete — brisanje plana automatski briše destinacije, aktivnosti, troškove, checklist stavke (`OnDelete(DeleteBehavior.Cascade)`) i opoziva sve share tokene

## Funkcionalnosti

- Registracija + login (JWT)
- CRUD planovi putovanja
- CRUD destinacije unutar plana
- CRUD aktivnosti sa kalendarskim prikazom
- CRUD troškova + grafikon budžeta po kategorijama
- Checklist / packing lista
- Dijeljenje plana preko QR koda (VIEW / EDIT pristup)
- Admin panel za upravljanje korisnicima

## Razvoj

- Frontend razvijen na macOS-u
- Backend razvijen i debugiran na Windows-u (Service Fabric SDK je Windows-only)
- Repozitorijum koristi Git za sinhronizaciju, sve commite ide preko Mac-a (jedinstveni autor)