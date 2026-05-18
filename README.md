# Travel Planer

Web aplikacija za planiranje putovanja. Mikroservisni backend na Service Fabric platformi i React frontend.

## Struktura

```
travel-planer/
├── frontend/                React aplikacija
└── TravelPlanerSF/          Service Fabric solution (Common + 3 servisa)
```

## Pokretanje

### Preduslovi
- Visual Studio 2022 (Azure development workload)
- Microsoft Service Fabric SDK + Runtime
- Local Service Fabric cluster (1-Node)
- SQL Server Express
- SSMS
- Node.js 20+
- `dotnet ef`: `dotnet tool install --global dotnet-ef`

### Backend

1. Otvori Visual Studio kao Administrator.
2. Otvori `TravelPlanerSF/TravelPlanerSF.sln`.
3. Otvori PowerShell terminal u VS-u (View → Terminal):
   ```powershell
   cd TravelPlanerSF\AuthService
   dotnet ef migrations add Initial
   dotnet ef database update

   cd ..\TravelPlanService
   dotnet ef migrations add Initial
   dotnet ef database update
   ```
4. U SSMS-u pokreni skriptu `TravelPlanerSF/scripts/grant-sf-permissions.sql` (daje pristup `NETWORK SERVICE` korisniku).
5. Postavi `TravelPlanerSF` (.sfproj) kao Startup Project.
6. F5.

Servisi:
- AuthService: http://localhost:8839
- TravelPlanService: http://localhost:8596
- SF Explorer: http://localhost:19080/Explorer

### Frontend

```bash
cd frontend
npm install
npm start
```

Otvara se na http://localhost:3000.

### Connection string

U `AuthService/appsettings.json` i `TravelPlanService/appsettings.json`. Default je `localhost\SQLEXPRESS`. Promeni ako ti je instanca drugačija.

## Tehnologije

- Frontend: React 19, React Router, Bootstrap 5, recharts, react-big-calendar, qrcode.react
- Backend: .NET 8, Service Fabric 8.x, ASP.NET Core, Entity Framework Core 9, SQL Server Express, BCrypt, JWT

## Dijagrami

- [Use Case dijagram](UseCaseDiagram.svg)
- [Arhitektura sistema](ArchitectureDiagram.svg)