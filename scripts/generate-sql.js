const bcrypt = require('bcryptjs');

const ROUNDS = 10;

const users = [
  { email: 'admin@sch.ro',           parola: 'Admin1234',  rol: 'admin',         nume: 'Administrator', prenume: 'SCH',      telefon: '0700000001' },
  { email: 'medic.ionescu@sch.ro',   parola: 'Medic1234',  rol: 'medic',         nume: 'Ionescu',       prenume: 'Ana',      telefon: '0700000002' },
  { email: 'medic.popa@sch.ro',      parola: 'Medic1234',  rol: 'medic',         nume: 'Popa',          prenume: 'Radu',     telefon: '0700000003' },
  { email: 'sup.stan@sch.ro',        parola: 'Suprav1234', rol: 'supraveghetor', nume: 'Stan',          prenume: 'Maria',    telefon: '0700000004' },
  { email: 'ing.dumitru@sch.ro',     parola: 'Ingrij1234', rol: 'ingrijitor',    nume: 'Dumitrescu',    prenume: 'George',   telefon: '0700000005' },
  { email: 'pacient.popescu@sch.ro', parola: 'Pacient123', rol: 'pacient',       nume: 'Popescu',       prenume: 'Ion',      telefon: '0700000006' },
  { email: 'pacient.gheorghe@sch.ro',parola: 'Pacient123', rol: 'pacient',       nume: 'Gheorghe',      prenume: 'Elena',    telefon: '0700000007' },
  { email: 'pacient.david@sch.ro',   parola: 'Pacient123', rol: 'pacient',       nume: 'David',         prenume: 'Mihai',    telefon: '0700000008' },
];

async function main() {
  const lines = [];

  lines.push('-- ============================================================');
  lines.push('-- DATE PROVIZORII DE TEST – Smart Care Home');
  lines.push('-- Generat automat cu hash-uri BCrypt reale (cost=10)');
  lines.push('-- ============================================================');
  lines.push('');
  lines.push('SET NOCOUNT ON;');
  lines.push('');

  // ── 1. UTILIZATORI ────────────────────────────────────────────────────────
  lines.push('-- 1. Utilizatori');
  lines.push('DELETE FROM alarme;');
  lines.push('DELETE FROM masuratori;');
  lines.push('DELETE FROM senzori;');
  lines.push('DELETE FROM dispozitive;');
  lines.push('DELETE FROM pacienti;');
  lines.push('DELETE FROM utilizatori;');
  lines.push('');

  const hashes = await Promise.all(users.map(u => bcrypt.hash(u.parola, ROUNDS)));

  lines.push('INSERT INTO utilizatori (nume, prenume, email, telefon, parola_hash, rol, data_creare) VALUES');
  const uRows = users.map((u, i) =>
    `  (N'${u.nume}', N'${u.prenume}', N'${u.email}', N'${u.telefon}', N'${hashes[i]}', N'${u.rol}', GETDATE())`
  );
  lines.push(uRows.join(',\n') + ';');
  lines.push('');

  // ── 2. PACIENTI ───────────────────────────────────────────────────────────
  lines.push('-- 2. Pacienti (leagă de utilizatorii cu rol=pacient)');
  lines.push(`
INSERT INTO pacienti (id_utilizator, cnp, varsta, adresa_strada, adresa_oras, adresa_judet, profesie, loc_munca)
SELECT u.id_utilizator, d.cnp, d.varsta, d.strada, d.oras, d.judet, d.profesie, d.loc_munca
FROM utilizatori u
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'1850312034521', 41, N'Str. Lalelelor 12',    N'București',  N'Ilfov',    N'Inginer',   N'Politehnica SRL'),
  (N'pacient.gheorghe@sch.ro', N'2780605034522', 48, N'Bd. Unirii 5, Bl. A4', N'Cluj-Napoca',N'Cluj',     N'Profesoară',N'Școala nr. 3'),
  (N'pacient.david@sch.ro',    N'1680920034523', 58, N'Aleea Trandafirilor 3',N'Timișoara',  N'Timiș',    N'Pensionar', N'–')
) AS d(email, cnp, varsta, strada, oras, judet, profesie, loc_munca)
  ON u.email = d.email;
`);

  // ── 3. DISPOZITIVE ────────────────────────────────────────────────────────
  lines.push('-- 3. Dispozitive (câte unul per pacient)');
  lines.push(`
INSERT INTO dispozitive (id_pacient, tip_dispozitiv, data_activare)
SELECT p.id_pacient, d.tip, d.activare
FROM pacienti p
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  (N'pacient.popescu@sch.ro',  N'SmartBand Pro v2',   '2024-01-15'),
  (N'pacient.gheorghe@sch.ro', N'CardioWatch X1',     '2024-03-20'),
  (N'pacient.david@sch.ro',    N'MediSensor Ultra 3', '2024-05-01')
) AS d(email, tip, activare)
  ON u.email = d.email;
`);

  // ── 4. SENZORI ────────────────────────────────────────────────────────────
  lines.push('-- 4. Senzori (2-3 per dispozitiv)');
  lines.push(`
INSERT INTO senzori (id_dispozitiv, tip_senzor, unitate_masura, valoare_minima, valoare_maxima, interval_esantionare)
SELECT dv.id_dispozitiv, s.tip, s.um, s.vmin, s.vmax, s.interval_sec
FROM dispozitive dv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  -- Pacient 1 – Popescu
  (N'pacient.popescu@sch.ro',  N'Puls',          N'bpm',   55.0, 100.0, 60),
  (N'pacient.popescu@sch.ro',  N'SpO2',          N'%',     94.0, 100.0, 120),
  (N'pacient.popescu@sch.ro',  N'Temperatura',   N'°C',    36.0,  37.5, 300),
  -- Pacient 2 – Gheorghe
  (N'pacient.gheorghe@sch.ro', N'Puls',          N'bpm',   55.0, 100.0, 60),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',      N'mmHg', 110.0, 140.0, 180),
  -- Pacient 3 – David
  (N'pacient.david@sch.ro',    N'Puls',          N'bpm',   55.0, 100.0, 60),
  (N'pacient.david@sch.ro',    N'Glucoza',       N'mg/dL', 70.0, 140.0, 600),
  (N'pacient.david@sch.ro',    N'Temperatura',   N'°C',    36.0,  37.5, 300)
) AS s(email, tip, um, vmin, vmax, interval_sec)
  ON u.email = s.email;
`);

  // ── 5. MASURATORI ─────────────────────────────────────────────────────────
  lines.push('-- 5. Masuratori (istorice + valori ce vor declanșa alarme)');
  lines.push(`
INSERT INTO masuratori (id_senzor, id_pacient, valoare, timestamp_masurare)
SELECT sz.id_senzor, p.id_pacient, m.valoare, m.ts
FROM senzori sz
JOIN dispozitive dv ON dv.id_dispozitiv = sz.id_dispozitiv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  -- Popescu – Puls (normal → ridicat)
  (N'pacient.popescu@sch.ro', N'Puls',        72.0,  DATEADD(hour,-6, GETDATE())),
  (N'pacient.popescu@sch.ro', N'Puls',        75.0,  DATEADD(hour,-5, GETDATE())),
  (N'pacient.popescu@sch.ro', N'Puls',       118.0,  DATEADD(hour,-4, GETDATE())), -- AVERTIZARE
  (N'pacient.popescu@sch.ro', N'Puls',       145.0,  DATEADD(hour,-2, GETDATE())), -- CRITICA
  -- Popescu – SpO2 (scade critic)
  (N'pacient.popescu@sch.ro', N'SpO2',        98.0,  DATEADD(hour,-6, GETDATE())),
  (N'pacient.popescu@sch.ro', N'SpO2',        96.0,  DATEADD(hour,-3, GETDATE())),
  (N'pacient.popescu@sch.ro', N'SpO2',        91.0,  DATEADD(hour,-1, GETDATE())), -- CRITICA
  -- Popescu – Temperatura
  (N'pacient.popescu@sch.ro', N'Temperatura', 36.6,  DATEADD(hour,-4, GETDATE())),
  (N'pacient.popescu@sch.ro', N'Temperatura', 37.8,  DATEADD(hour,-1, GETDATE())), -- AVERTIZARE
  -- Gheorghe – Puls
  (N'pacient.gheorghe@sch.ro',N'Puls',        68.0,  DATEADD(hour,-5, GETDATE())),
  (N'pacient.gheorghe@sch.ro',N'Puls',        80.0,  DATEADD(hour,-2, GETDATE())),
  -- Gheorghe – Tensiune
  (N'pacient.gheorghe@sch.ro',N'Tensiune',   125.0,  DATEADD(hour,-5, GETDATE())),
  (N'pacient.gheorghe@sch.ro',N'Tensiune',   148.0,  DATEADD(hour,-2, GETDATE())), -- AVERTIZARE
  (N'pacient.gheorghe@sch.ro',N'Tensiune',   172.0,  DATEADD(hour,-1, GETDATE())), -- CRITICA
  -- David – Puls
  (N'pacient.david@sch.ro',   N'Puls',        65.0,  DATEADD(hour,-4, GETDATE())),
  -- David – Glucoza
  (N'pacient.david@sch.ro',   N'Glucoza',     95.0,  DATEADD(hour,-6, GETDATE())),
  (N'pacient.david@sch.ro',   N'Glucoza',    155.0,  DATEADD(hour,-3, GETDATE())), -- AVERTIZARE
  (N'pacient.david@sch.ro',   N'Glucoza',    220.0,  DATEADD(hour,-1, GETDATE()))  -- CRITICA
) AS m(email, tip_senzor, valoare, ts)
  ON u.email = m.email AND sz.tip_senzor = m.tip_senzor;
`);

  // ── 6. ALARME ─────────────────────────────────────────────────────────────
  lines.push('-- 6. Alarme (4 nerezolvate + 2 rezolvate)');
  lines.push(`
INSERT INTO alarme (id_pacient, id_senzor, tip_alarma, mesaj, timestamp_declansare, rezolvata)
SELECT p.id_pacient, sz.id_senzor, a.tip, a.mesaj, a.ts, a.rez
FROM senzori sz
JOIN dispozitive dv ON dv.id_dispozitiv = sz.id_dispozitiv
JOIN pacienti p ON p.id_pacient = dv.id_pacient
JOIN utilizatori u ON u.id_utilizator = p.id_utilizator
JOIN (VALUES
  -- Alarme pacient Popescu
  (N'pacient.popescu@sch.ro', N'Puls',
   N'critica',    N'[CRITICA] Puls 145 bpm – interval normal: 55–100 bpm',
   DATEADD(hour,-2, GETDATE()), 0),
  (N'pacient.popescu@sch.ro', N'SpO2',
   N'critica',    N'[CRITICA] SpO2 91% – sub limita minimă admisă (94%)',
   DATEADD(hour,-1, GETDATE()), 0),
  (N'pacient.popescu@sch.ro', N'Temperatura',
   N'avertizare', N'[AVERTIZARE] Temperatură 37.8 °C – ușor peste limita normală',
   DATEADD(hour,-1, GETDATE()), 0),
  -- Alarme pacient Gheorghe
  (N'pacient.gheorghe@sch.ro', N'Tensiune',
   N'critica',    N'[CRITICA] Tensiune 172 mmHg – criză hipertensivă suspectată',
   DATEADD(hour,-1, GETDATE()), 0),
  (N'pacient.gheorghe@sch.ro', N'Tensiune',
   N'avertizare', N'[AVERTIZARE] Tensiune 148 mmHg – depășit intervalul normal',
   DATEADD(hour,-2, GETDATE()), 1), -- rezolvata
  -- Alarme pacient David
  (N'pacient.david@sch.ro', N'Glucoza',
   N'critica',    N'[CRITICA] Glucoză 220 mg/dL – valoare semnificativ crescută',
   DATEADD(hour,-1, GETDATE()), 0),
  (N'pacient.david@sch.ro', N'Glucoza',
   N'avertizare', N'[AVERTIZARE] Glucoză 155 mg/dL – ușor peste limita normală',
   DATEADD(hour,-3, GETDATE()), 1)  -- rezolvata
) AS a(email, tip_senzor, tip, mesaj, ts, rez)
  ON u.email = a.email AND sz.tip_senzor = a.tip_senzor;
`);

  // ── Verificare ─────────────────────────────────────────────────────────────
  lines.push('-- ── Verificare rapidă ──────────────────────────────────────');
  lines.push('SELECT (SELECT COUNT(*) FROM utilizatori) AS utilizatori,');
  lines.push('       (SELECT COUNT(*) FROM pacienti)    AS pacienti,');
  lines.push('       (SELECT COUNT(*) FROM dispozitive) AS dispozitive,');
  lines.push('       (SELECT COUNT(*) FROM senzori)     AS senzori,');
  lines.push('       (SELECT COUNT(*) FROM masuratori)  AS masuratori,');
  lines.push('       (SELECT COUNT(*) FROM alarme)      AS alarme;');

  const sql = lines.join('\n');
  require('fs').writeFileSync('test-data.sql', sql, 'utf8');
  console.log('SQL generat in test-data.sql');
  console.log('\n=== CREDENTIALE UTILIZATORI ===');
  users.forEach(u => console.log(`  ${u.rol.padEnd(14)} ${u.email.padEnd(36)} parola: ${u.parola}`));
}

main().catch(console.error);
