-- =====================================================================
-- Grant Service Fabric service identity access to TravelPlaner databases
--
-- Service Fabric services run as 'NT AUTHORITY\NETWORK SERVICE' by default,
-- but databases are created by the user who ran 'dotnet ef database update'.
-- This script grants NETWORK SERVICE db_owner on both databases.
--
-- Run this once after the databases have been created.
--
-- Usage in SSMS:
--   Open file, press F5 to execute.
--
-- Usage from PowerShell:
--   sqlcmd -S localhost\SQLEXPRESS -E -i grant-sf-permissions.sql
-- =====================================================================

-- 1. Create server-level login for NETWORK SERVICE (if not exists)
USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'NT AUTHORITY\NETWORK SERVICE')
BEGIN
    CREATE LOGIN [NT AUTHORITY\NETWORK SERVICE] FROM WINDOWS;
    PRINT 'Created server login: NT AUTHORITY\NETWORK SERVICE';
END
ELSE
BEGIN
    PRINT 'Server login already exists: NT AUTHORITY\NETWORK SERVICE';
END
GO

-- 2. Grant access to TravelPlanerAuth database
USE TravelPlanerAuth;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'NT AUTHORITY\NETWORK SERVICE')
BEGIN
    CREATE USER [NT AUTHORITY\NETWORK SERVICE] FOR LOGIN [NT AUTHORITY\NETWORK SERVICE];
    PRINT 'Created database user in TravelPlanerAuth';
END
ALTER ROLE db_owner ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];
PRINT 'Granted db_owner on TravelPlanerAuth';
GO

-- 3. Grant access to TravelPlanerCore database
USE TravelPlanerCore;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'NT AUTHORITY\NETWORK SERVICE')
BEGIN
    CREATE USER [NT AUTHORITY\NETWORK SERVICE] FOR LOGIN [NT AUTHORITY\NETWORK SERVICE];
    PRINT 'Created database user in TravelPlanerCore';
END
ALTER ROLE db_owner ADD MEMBER [NT AUTHORITY\NETWORK SERVICE];
PRINT 'Granted db_owner on TravelPlanerCore';
GO

-- 4. Verification — list role memberships
SELECT
    'TravelPlanerAuth' AS DatabaseName,
    p.name AS RoleName
FROM sys.database_principals m
INNER JOIN sys.database_role_members rm ON m.principal_id = rm.member_principal_id
INNER JOIN sys.database_principals p ON p.principal_id = rm.role_principal_id
WHERE m.name = N'NT AUTHORITY\NETWORK SERVICE';
GO

USE TravelPlanerCore;
GO

SELECT
    'TravelPlanerCore' AS DatabaseName,
    p.name AS RoleName
FROM sys.database_principals m
INNER JOIN sys.database_role_members rm ON m.principal_id = rm.member_principal_id
INNER JOIN sys.database_principals p ON p.principal_id = rm.role_principal_id
WHERE m.name = N'NT AUTHORITY\NETWORK SERVICE';
GO