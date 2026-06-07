-- ============================================================
-- SCH Smart Care Home – Seed complet (DROP → CREATE → INSERT)
-- Rulează o singură dată sau oricând vrei să resetezi datele.
-- ============================================================

SET NOCOUNT ON;

-- ── 1. Drop toate FK constraints din DB, apoi drop tabelele ───
DECLARE @dropFk NVARCHAR(MAX) = N'';
SELECT @dropFk += 'ALTER TABLE ' + QUOTENAME(OBJECT_NAME(parent_object_id))
               + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys;
IF LEN(@dropFk) > 0 EXEC sp_executesql @dropFk;

IF OBJECT_ID('alarme',      'U') IS NOT NULL DROP TABLE alarme;
IF OBJECT_ID('masuratori',  'U') IS NOT NULL DROP TABLE masuratori;
IF OBJECT_ID('senzori',     'U') IS NOT NULL DROP TABLE senzori;
IF OBJECT_ID('dispozitive', 'U') IS NOT NULL DROP TABLE dispozitive;
IF OBJECT_ID('pacienti',    'U') IS NOT NULL DROP TABLE pacienti;
IF OBJECT_ID('utilizatori', 'U') IS NOT NULL DROP TABLE utilizatori;

-- ── 2. CREATE tabele cu schema exactă din entitățile Java ──────

CREATE TABLE utilizatori (
    id_utilizator  INT            IDENTITY(1,1) PRIMARY KEY,
    nume           NVARCHAR(100)  NOT NULL,
    prenume        NVARCHAR(100)  NOT NULL,
    email          NVARCHAR(150)  NOT NULL UNIQUE,
    telefon        NVARCHAR(20)   NULL,
    parola_hash    NVARCHAR(255)  NOT NULL,
    rol            NVARCHAR(50)   NOT NULL,
    data_creare    DATETIME2      NULL
);

CREATE TABLE pacienti (
    id_pacient     INT            IDENTITY(1,1) PRIMARY KEY,
    id_utilizator  INT            NOT NULL UNIQUE,
    cnp            NVARCHAR(13)   NULL,
    varsta         INT            NULL,
    adresa_strada  NVARCHAR(200)  NULL,
    adresa_oras    NVARCHAR(100)  NULL,
    adresa_judet   NVARCHAR(100)  NULL,
    profesie       NVARCHAR(100)  NULL,
    loc_munca      NVARCHAR(100)  NULL,
    CONSTRAINT FK_pacienti_utilizatori FOREIGN KEY (id_utilizator) REFERENCES utilizatori(id_utilizator)
);

CREATE TABLE dispozitive (
    id_dispozitiv  INT            IDENTITY(1,1) PRIMARY KEY,
    id_pacient     INT            NOT NULL UNIQUE,
    tip_dispozitiv NVARCHAR(100)  NULL,
    data_activare  DATETIME2      NULL,
    CONSTRAINT FK_dispozitive_pacienti FOREIGN KEY (id_pacient) REFERENCES pacienti(id_pacient)
);

CREATE TABLE senzori (
    id_senzor             INT           IDENTITY(1,1) PRIMARY KEY,
    id_dispozitiv         INT           NOT NULL,
    tip_senzor            NVARCHAR(50)  NULL,
    unitate_masura        NVARCHAR(20)  NULL,
    valoare_minima        FLOAT         NULL,
    valoare_maxima        FLOAT         NULL,
    interval_esantionare  INT           NULL,
    CONSTRAINT FK_senzori_dispozitive FOREIGN KEY (id_dispozitiv) REFERENCES dispozitive(id_dispozitiv)
);

CREATE TABLE masuratori (
    id_masurare         BIGINT     IDENTITY(1,1) PRIMARY KEY,
    id_senzor           INT        NOT NULL,
    id_pacient          INT        NOT NULL,
    valoare             FLOAT      NULL,
    timestamp_masurare  DATETIME2  NULL,
    CONSTRAINT FK_masuratori_senzori  FOREIGN KEY (id_senzor)  REFERENCES senzori(id_senzor),
    CONSTRAINT FK_masuratori_pacienti FOREIGN KEY (id_pacient) REFERENCES pacienti(id_pacient)
);

CREATE TABLE alarme (
    id_alarma              BIGINT        IDENTITY(1,1) PRIMARY KEY,
    id_pacient             INT           NULL,
    id_senzor              INT           NULL,
    tip_alarma             NVARCHAR(50)  NULL,
    mesaj                  NVARCHAR(255) NULL,
    timestamp_declansare   DATETIME2     NULL,
    rezolvata              BIT           NULL,
    CONSTRAINT FK_alarme_pacienti FOREIGN KEY (id_pacient) REFERENCES pacienti(id_pacient),
    CONSTRAINT FK_alarme_senzori  FOREIGN KEY (id_senzor)  REFERENCES senzori(id_senzor)
);

-- ── 3. INSERT utilizatori ──────────────────────────────────────
INSERT INTO utilizatori (nume, prenume, email, telefon, parola_hash, rol, data_creare) VALUES
  (N'Administrator', N'SCH',      N'admin@sch.ro',             N'0700000001', N'$2b$10$qyEEK3srxaz5OX1i3onTwO1j6tPLUUsj5TNqZbeg5IzzQvLLxe8hi', N'admin',         GETDATE()),
  (N'Ionescu',       N'Ana',      N'medic.ionescu@sch.ro',     N'0700000002', N'$2b$10$pa54mGs7GbjCTGoS4Zh94erwVnJQNpYB72tMgDIVGGH2linW4G59O',  N'medic',         GETDATE()),
  (N'Popa',          N'Radu',     N'medic.popa@sch.ro',        N'0700000003', N'$2b$10$ybLdHr0qW3cNlqhGbHOsc.A0K7TKO9KiiOFriLENcIwzaqSfaGCNy',  N'medic',         GETDATE()),
  (N'Stan',          N'Maria',    N'sup.stan@sch.ro',          N'0700000004', N'$2b$10$GnpOFkvrPZM64SHE1KsIpebGLDH3RlnHJB9xl/GPVLc9UJBaMN5iO',  N'supraveghetor', GETDATE()),
  (N'Dumitrescu',    N'George',   N'ing.dumitru@sch.ro',       N'0700000005', N'$2b$10$XXYLr.tFx7z.VVoCMsmOne4a.xPpkhotsLqSs0GcmDcdl.dX6C0Hi',  N'ingrijitor',    GETDATE()),
  (N'Popescu',       N'Ion',      N'pacient.popescu@sch.ro',   N'0700000006', N'$2b$10$mdrzBZ/UovNipa6Q7nV8quGGd9V5HZPz54tWFr03di1VNxxtRpOdO',  N'pacient',       GETDATE()),
  (N'Gheorghe',      N'Elena',    N'pacient.gheorghe@sch.ro',  N'0700000007', N'$2b$10$HN1Y/YkHPjp/Y4XTAAZ6/Oh1f4kgN/eGcmlBd7Z6wXl4cbzldA3WW',  N'pacient',       GETDATE()),
  (N'David',         N'Mihai',    N'pacient.david@sch.ro',     N'0700000008', N'$2b$10$pwXnznHhFQyB6fxGnQLuleQjVNkf6ClvWu/aXGH/cGmwSk5ueAhoe',  N'pacient',       GETDATE());

-- ── 4. INSERT pacienti ─────────────────────────────────────────
INSERT INTO pacienti (id_utilizator, cnp, varsta, adresa_strada, adresa_oras, adresa_judet, profesie, loc_munca)
SELECT u.id_utilizator, d.cnp, d.varsta, d.strada, d.oras, d.judet, d.profesie, d.loc_munca
FROM utilizatori u
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'1850312034521', 41, N'Str. Lalelelor 12',     N'București',   N'Ilfov', N'Inginer',    N'Politehnica SRL'),
  (N'pacient.gheorghe@sch.ro', N'2780605034522', 48, N'Bd. Unirii 5, Bl. A4',  N'Cluj-Napoca', N'Cluj',  N'Profesoară', N'Școala nr. 3'),
  (N'pacient.david@sch.ro',    N'1680920034523', 58, N'Aleea Trandafirilor 3', N'Timișoara',   N'Timiș', N'Pensionar',  N'–')
) AS d(email, cnp, varsta, strada, oras, judet, profesie, loc_munca) ON u.email = d.email;

-- ── 5. INSERT dispozitive ──────────────────────────────────────
INSERT INTO dispozitive (id_pacient, tip_dispozitiv, data_activare)
SELECT p.id_pacient, d.tip, d.activare
FROM pacienti p
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'SmartBand Pro v2',   '2024-01-15'),
  (N'pacient.gheorghe@sch.ro', N'CardioWatch X1',     '2024-03-20'),
  (N'pacient.david@sch.ro',    N'MediSensor Ultra 3', '2024-05-01')
) AS d(email, tip, activare) ON u.email = d.email;

-- ── 6. INSERT senzori ──────────────────────────────────────────
INSERT INTO senzori (id_dispozitiv, tip_senzor, unitate_masura, valoare_minima, valoare_maxima, interval_esantionare)
SELECT dv.id_dispozitiv, s.tip, s.um, s.vmin, s.vmax, s.interval_sec
FROM dispozitive dv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'Puls',        N'bpm',    55.0, 100.0,  60),
  (N'pacient.popescu@sch.ro',  N'SpO2',        N'%',      94.0, 100.0, 120),
  (N'pacient.popescu@sch.ro',  N'Temperatura', N'°C',     36.0,  37.5, 300),
  (N'pacient.gheorghe@sch.ro', N'Puls',        N'bpm',    55.0, 100.0,  60),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',    N'mmHg',  110.0, 140.0, 180),
  (N'pacient.david@sch.ro',    N'Puls',        N'bpm',    55.0, 100.0,  60),
  (N'pacient.david@sch.ro',    N'Glucoza',     N'mg/dL',  70.0, 140.0, 600),
  (N'pacient.david@sch.ro',    N'Temperatura', N'°C',     36.0,  37.5, 300)
) AS s(email, tip, um, vmin, vmax, interval_sec) ON u.email = s.email;

-- ── 7. INSERT masuratori ───────────────────────────────────────
INSERT INTO masuratori (id_senzor, id_pacient, valoare, timestamp_masurare)
SELECT sz.id_senzor, p.id_pacient, m.valoare, m.ts
FROM senzori sz
JOIN dispozitive dv ON dv.id_dispozitiv = sz.id_dispozitiv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'Puls',         72.0, DATEADD(hour,-6,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'Puls',         75.0, DATEADD(hour,-5,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'Puls',        118.0, DATEADD(hour,-4,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'Puls',        145.0, DATEADD(hour,-2,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'SpO2',         98.0, DATEADD(hour,-6,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'SpO2',         96.0, DATEADD(hour,-3,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'SpO2',         91.0, DATEADD(hour,-1,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'Temperatura',  36.6, DATEADD(hour,-4,GETDATE())),
  (N'pacient.popescu@sch.ro',  N'Temperatura',  37.8, DATEADD(hour,-1,GETDATE())),
  (N'pacient.gheorghe@sch.ro', N'Puls',         68.0, DATEADD(hour,-5,GETDATE())),
  (N'pacient.gheorghe@sch.ro', N'Puls',         80.0, DATEADD(hour,-2,GETDATE())),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',    125.0, DATEADD(hour,-5,GETDATE())),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',    148.0, DATEADD(hour,-2,GETDATE())),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',    172.0, DATEADD(hour,-1,GETDATE())),
  (N'pacient.david@sch.ro',    N'Puls',         65.0, DATEADD(hour,-4,GETDATE())),
  (N'pacient.david@sch.ro',    N'Glucoza',      95.0, DATEADD(hour,-6,GETDATE())),
  (N'pacient.david@sch.ro',    N'Glucoza',     155.0, DATEADD(hour,-3,GETDATE())),
  (N'pacient.david@sch.ro',    N'Glucoza',     220.0, DATEADD(hour,-1,GETDATE()))
) AS m(email, tip_senzor, valoare, ts) ON u.email = m.email AND sz.tip_senzor = m.tip_senzor;

-- ── 8. INSERT alarme ───────────────────────────────────────────
INSERT INTO alarme (id_pacient, id_senzor, tip_alarma, mesaj, timestamp_declansare, rezolvata)
SELECT p.id_pacient, sz.id_senzor, a.tip, a.mesaj, a.ts, a.rez
FROM senzori sz
JOIN dispozitive dv ON dv.id_dispozitiv = sz.id_dispozitiv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'Puls',      N'critica',    N'[CRITICA] Puls 145 bpm – interval normal: 55–100 bpm',          DATEADD(hour,-2,GETDATE()), 0),
  (N'pacient.popescu@sch.ro',  N'SpO2',      N'critica',    N'[CRITICA] SpO2 91% – sub limita minimă admisă (94%)',            DATEADD(hour,-1,GETDATE()), 0),
  (N'pacient.popescu@sch.ro',  N'Temperatura',N'avertizare',N'[AVERTIZARE] Temperatură 37.8 °C – ușor peste limita normală',   DATEADD(hour,-1,GETDATE()), 0),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',  N'critica',    N'[CRITICA] Tensiune 172 mmHg – criză hipertensivă suspectată',    DATEADD(hour,-1,GETDATE()), 0),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',  N'avertizare', N'[AVERTIZARE] Tensiune 148 mmHg – depășit intervalul normal',     DATEADD(hour,-2,GETDATE()), 1),
  (N'pacient.david@sch.ro',    N'Glucoza',   N'critica',    N'[CRITICA] Glucoză 220 mg/dL – valoare semnificativ crescută',    DATEADD(hour,-1,GETDATE()), 0),
  (N'pacient.david@sch.ro',    N'Glucoza',   N'avertizare', N'[AVERTIZARE] Glucoză 155 mg/dL – ușor peste limita normală',     DATEADD(hour,-3,GETDATE()), 1)
) AS a(email, tip_senzor, tip, mesaj, ts, rez) ON u.email = a.email AND sz.tip_senzor = a.tip_senzor;

-- ── Verificare ─────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM utilizatori) AS utilizatori,
  (SELECT COUNT(*) FROM pacienti)    AS pacienti,
  (SELECT COUNT(*) FROM dispozitive) AS dispozitive,
  (SELECT COUNT(*) FROM senzori)     AS senzori,
  (SELECT COUNT(*) FROM masuratori)  AS masuratori,
  (SELECT COUNT(*) FROM alarme)      AS alarme;
