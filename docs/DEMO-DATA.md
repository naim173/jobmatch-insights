# Fachliche Demo-Daten

Alle Inhalte dieses Datenpakets sind vollständig erfunden. Personen,
Organisationen, Orte, Tätigkeiten und Stellenanzeigen haben keinen Bezug zur
privaten Originalversion. Es existieren bewusst keine externen Stellen-URLs.

## Hauptprofil

**Alex Berger** ist ein fiktives Einstiegs- bis frühes Professional-Profil für
Business Analysis und digitale Projektkoordination. Das Profil verbindet:

- zwei Jahre fiktive Erfahrung in Digitalisierungsprojekten
- Anforderungsworkshops und Stakeholder-Abstimmung
- Prozessanalyse und BPMN
- Projektkoordination und agile Grundlagen
- ein fiktives Wirtschaftsinformatikstudium
- klar benannte Grenzen bei Budget, Führung, SAP, SQL und Power BI

Damit lässt sich demonstrieren, dass der Jobkompass nur belegte Kompetenzen als
erfüllt bewertet und fehlende Informationen nicht erfindet.

## Vier Matching-Fälle

| Job | Fall | Score | Demonstrationsziel |
| --- | --- | ---: | --- |
| Business Analyst Digitale Prozesse | Sehr guter Match | 92 | Viele direkte Profilbelege, nur eine kleine SQL-Lücke |
| Junior IT-Projektmanager | Guter Match mit Lücken | 78 | Übertragbare Erfahrung, aber fehlende Budgetpraxis und nur Jira-Grundlagen |
| Requirements Engineer Technische Systeme | Mittelmäßiger Match | 61 | Passende Basiskompetenzen, aber deutliche technische und methodische Lücken |
| Senior SAP Program Manager | Klar ungeeignet | 24 | Muss-Anforderungen werden nachvollziehbar nicht erfüllt |

## Fachliche Abdeckung

Die Szenarien enthalten jeweils:

- Gesamt- und Teil-Scores
- Datenqualität als Confidence-Wert
- einzelne Anforderungsbewertungen
- `FULFILLED`, `PARTIALLY_FULFILLED`, `NOT_FULFILLED` und `UNKNOWN`
- konkrete Verknüpfungen zu fiktiven Profilbelegen
- Stärken und Lücken
- vorhandene und fehlende ATS-Keywords
- passende Hinweise für die Interviewvorbereitung

## Dateien

- `lib/demo-data/candidate-profile.json`: fiktives Hauptprofil und Profilbelege
- `lib/demo-data/jobs.json`: vier fiktive Stellenanzeigen ohne URLs
- `lib/demo-data/matching-scenarios.json`: erwartete fachliche Bewertungen

Diese Dateien definieren zunächst nur die Fachdaten. Sie enthalten noch keine
übernommene Matching- oder Anwendungstechnik.
