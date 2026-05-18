# Travel Planer

Web aplikacija za planiranje putovanja. Service Fabric backend + React frontend.

## Preduslovi

- Visual Studio 2022 (Azure development workload), Service Fabric SDK + Runtime, Local SF cluster (1-Node)
- SQL Server Express + SSMS
- Node.js 20+
- `dotnet tool install --global dotnet-ef`

## Backend

```powershell
cd TravelPlanerSF\AuthService
dotnet ef migrations add Initial
dotnet ef database update

cd ..\TravelPlanService
dotnet ef migrations add Initial
dotnet ef database update
```

U SSMS pokreni `TravelPlanerSF/scripts/grant-sf-permissions.sql`.

Otvori `TravelPlanerSF/TravelPlanerSF.sln` u VS-u (kao Admin) → postavi `TravelPlanerSF` (.sfproj) kao Startup → F5.

Servisi: AuthService `http://localhost:8839`, TravelPlanService `http://localhost:8596`, SF Explorer `http://localhost:19080/Explorer`.

Connection string: `AuthService/appsettings.json` i `TravelPlanService/appsettings.json` (default `localhost\SQLEXPRESS`).

## Frontend

```bash
cd frontend
npm install
npm start
```

Otvara se na `http://localhost:3000`.

## Admin nalog

Registruj se kao običan korisnik, pa u SSMS-u (baza `AuthDb`):

```sql
UPDATE Users SET Role = 2 WHERE UserName = 'tvoje_korisnicko_ime';
```

Izloguj se i ponovo prijavi.

## Dijagrami

- [Use Case dijagram](UseCaseDiagram.svg)
- [Arhitektura sistema](ArchitectureDiagram.svg)