-- =============================================================================
-- Demo seed za travel-planer
-- =============================================================================
-- Kako pokrenuti:
--   1) Registruj jednog korisnika kroz UI (frontend → /registration).
--   2) U SSMS-u otvori bazu TravelPlanerAuth i pronadji svoj UserId:
--        SELECT Id, UserName, Email FROM TravelPlanerAuth.dbo.Users;
--   3) Upisi taj broj u @OwnerId ispod.
--   4) Pokreni cijeli script (F5).
--   5) Otvori frontend → ulogovan korisnik vidi novi demo plan na home stranici.
--
-- Ovaj script je idempotentan u smislu da kreira NOVE redove svaki put kad
-- ga pokrenes (ne brise postojece). Ako vise puta pokrenes, dobices vise kopija.
-- =============================================================================

USE TravelPlanerCore;
GO

DECLARE @OwnerId BIGINT = 1;  -- <<< PROMIJENI NA SVOJ UserId

-- ---------- TravelPlan ----------
INSERT INTO TravelPlans (OwnerId, Name, Description, StartDate, EndDate, Budget, Notes, CreatedAt)
VALUES (
    @OwnerId,
    'Putovanje po Evropi',
    'Dve nedelje kroz cetiri grada: Bec, Prag, Berlin i Amsterdam.',
    '2026-07-01',
    '2026-07-15',
    2500.00,
    'Voziti vozom izmedju gradova. Proveriti osiguranje.',
    SYSUTCDATETIME()
);

DECLARE @PlanId BIGINT = SCOPE_IDENTITY();

-- ---------- Destinations ----------
INSERT INTO Destinations (TravelPlanId, Name, Location, ArrivalDate, DepartureDate, Description)
VALUES
    (@PlanId, 'Bec',       'Bec, Austrija',      '2026-07-01', '2026-07-04', 'Schonbrunn, Stephansdom, kafici'),
    (@PlanId, 'Prag',      'Prag, Ceska',        '2026-07-04', '2026-07-08', 'Karlov most, dvorac, Stari grad'),
    (@PlanId, 'Berlin',    'Berlin, Njemacka',   '2026-07-08', '2026-07-12', 'Brandenburska kapija, East Side Gallery'),
    (@PlanId, 'Amsterdam', 'Amsterdam, Holandija','2026-07-12', '2026-07-15', 'Kanali, Anne Frank kuca, Van Gogh muzej');

DECLARE @DestBec   BIGINT = (SELECT Id FROM Destinations WHERE TravelPlanId = @PlanId AND Name = 'Bec');
DECLARE @DestPrag  BIGINT = (SELECT Id FROM Destinations WHERE TravelPlanId = @PlanId AND Name = 'Prag');
DECLARE @DestBerlin BIGINT = (SELECT Id FROM Destinations WHERE TravelPlanId = @PlanId AND Name = 'Berlin');
DECLARE @DestAms   BIGINT = (SELECT Id FROM Destinations WHERE TravelPlanId = @PlanId AND Name = 'Amsterdam');

-- ---------- Activities ----------
-- ActivityStatus: 1=Planned, 2=Booked, 3=Completed, 4=Cancelled
INSERT INTO Activities (TravelPlanId, DestinationId, Name, Date, Time, Location, Description, EstimatedCost, Status)
VALUES
    (@PlanId, @DestBec,    'Obilazak Schonbrunna',  '2026-07-02', '10:00', 'Schonbrunn Palace',     'Vodjeni obilazak na engleskom',   25.00, 2),
    (@PlanId, @DestBec,    'Vecera u Naschmarktu',  '2026-07-03', '19:30', 'Naschmarkt',            'Probati austrijsku kuhinju',      40.00, 1),
    (@PlanId, @DestPrag,   'Karlov most pri zalasku','2026-07-05','19:00','Karluv most',            'Setnja i fotografisanje',          0.00, 1),
    (@PlanId, @DestPrag,   'Praski dvorac',         '2026-07-06', '11:00', 'Prazsky hrad',          'Kupiti kombinovanu kartu',        18.00, 2),
    (@PlanId, @DestBerlin, 'Reichstag — kupola',    '2026-07-09', '14:00', 'Reichstag',             'Rezervisati slot online',          0.00, 2),
    (@PlanId, @DestBerlin, 'East Side Gallery',     '2026-07-10', '11:00', 'East Side Gallery',     'Najduzi sacuvani dio Berlinskog zida', 0.00, 1),
    (@PlanId, @DestAms,    'Kanal kruzni tour',     '2026-07-13', '15:00', 'Centraal Station',      'Brod sa audio vodicem',           22.00, 2),
    (@PlanId, @DestAms,    'Anne Frank kuca',       '2026-07-14', '10:30', 'Prinsengracht 263',     'Karte se moraju kupiti online unapred', 16.00, 2);

-- ---------- Expenses ----------
-- ExpenseCategory: 1=Transport, 2=Accommodation, 3=Food, 4=Tickets, 5=Shopping, 6=Other
INSERT INTO Expenses (TravelPlanId, Name, Category, Amount, Date, Description)
VALUES
    (@PlanId, 'Avio karta Beograd-Bec',     1, 180.00, '2026-06-15', 'One-way, Wizzair'),
    (@PlanId, 'Vlak Bec-Prag',               1,  45.00, '2026-07-04', 'RegioJet, business class'),
    (@PlanId, 'Vlak Prag-Berlin',            1,  55.00, '2026-07-08', 'EC vlak'),
    (@PlanId, 'Vlak Berlin-Amsterdam',       1,  90.00, '2026-07-12', 'ICE Direct'),
    (@PlanId, 'Hotel Bec — 3 noci',          2, 360.00, '2026-07-01', 'Booking.com, doruchak ukljucen'),
    (@PlanId, 'Hostel Prag — 4 noci',        2, 200.00, '2026-07-04', 'Privatna soba'),
    (@PlanId, 'Hotel Berlin — 4 noci',       2, 480.00, '2026-07-08', 'Mitte district'),
    (@PlanId, 'Airbnb Amsterdam — 3 noci',   2, 420.00, '2026-07-12', 'U blizini Centraal'),
    (@PlanId, 'Karte Schonbrunn',            4,  25.00, '2026-07-02', 'Imperial Tour'),
    (@PlanId, 'Suvenir magneti',             5,  15.00, '2026-07-13', 'Po jedan iz svakog grada'),
    (@PlanId, 'Putno osiguranje',            6,  35.00, '2026-06-20', 'Pokriva 15 dana');

-- ---------- ChecklistItems ----------
INSERT INTO ChecklistItems (TravelPlanId, Text, Completed)
VALUES
    (@PlanId, 'Pasos (proveriti rok vazenja)', 1),
    (@PlanId, 'Putno osiguranje',                1),
    (@PlanId, 'Odstampati avio kartu',           0),
    (@PlanId, 'Odstampati hotel rezervacije',    0),
    (@PlanId, 'Punjac telefona + adapter',       0),
    (@PlanId, 'Eura u gotovini (~200 EUR)',      0),
    (@PlanId, 'Kreditna kartica (proveriti limit)', 0),
    (@PlanId, 'Lijekovi i first-aid kit',        0),
    (@PlanId, 'Kisobran ili kabanica',           0),
    (@PlanId, 'Power bank',                      0);

-- ---------- Provera ----------
PRINT '====================================';
PRINT 'Demo plan kreiran. Id: ' + CAST(@PlanId AS NVARCHAR);
PRINT 'Owner Id: ' + CAST(@OwnerId AS NVARCHAR);
PRINT '  Destinations: 4';
PRINT '  Activities:   8';
PRINT '  Expenses:     11';
PRINT '  Checklist:    10';
PRINT '====================================';

-- =============================================================================
-- Za brisanje demo plana (cascade delete brise i sve povezane redove):
--   DELETE FROM TravelPlans WHERE Id = <id koji je gore odstampan>;
-- ili sve demo planove ovog vlasnika:
--   DELETE FROM TravelPlans WHERE OwnerId = <UserId> AND Name = 'Putovanje po Evropi';
-- =============================================================================
