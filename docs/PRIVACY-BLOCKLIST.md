# Datenschutz- und Veröffentlichungs-Sperrliste

Diese Regeln gelten verbindlich für die öffentliche Demo. Eine Datei auf dieser
Liste darf nicht allein deshalb veröffentlicht werden, weil sie technisch nicht
von `.gitignore` ausgeschlossen wurde.

## Niemals aus der privaten Originalversion übernehmen

- den vorhandenen `.git`-Ordner oder Teile seiner Historie
- private Hosting-Konfigurationen, Projekt-IDs und private URLs
- produktive Datenbanken oder Datenbankkopien
- echte Lebensläufe und daraus übernommene Textpassagen
- echte Namen, Initialen, E-Mail-Adressen oder Benutzer-IDs
- Wohnadressen, Postleitzahlen, Suchradien oder persönliche Suchorte
- echte Arbeitgeber- und Beschäftigungshistorien aus Kandidatenprofilen
- echte Bewerbungen, Statusverläufe, Notizen oder Ansprechpartner
- Gehaltsvorstellungen oder persönliche Gehaltsinformationen
- echte Suchhistorien, Suchprotokolle oder importierte private Jobdaten
- private Stellenlinks, interne IDs oder private Seitenadressen
- Screenshots, Vorschaubilder oder PDFs aus der privaten Anwendung
- Logs, Exporte, Backups, Archive oder temporäre Arbeitsdateien
- `.env`-Dateien, API-Schlüssel, Tokens, Passwörter oder Zugangsdaten
- persönliche absolute Dateipfade

## Standardmäßig lokal ausgeschlossen

Die `.gitignore` blockiert insbesondere:

- Abhängigkeiten, Caches und Build-Ausgaben
- Umgebungsvariablen und Schlüsseldateien
- Datenbanken, Uploads, Exporte und Arbeitsordner
- Lebensläufe und Bewerbungsdokumente
- private Screenshots und Anhänge
- Archive, Backups und Logdateien
- lokale Hosting- und Editorzustände

## Erlaubte Demo-Inhalte

Nur vollständig neu erstellte und fiktive Inhalte dürfen verwendet werden:

- fiktive Personen und Initialen
- fiktive Lebensläufe und Kompetenzen
- fiktive Arbeitgeber und Stellenanzeigen
- neutrale Orte oder klar erfundene Standortdaten
- fiktive Bewerbungsstatus und Notizen
- Demo-Suchergebnisse ohne Bezug zur privaten Nutzung
- neu erstellte Screenshots, die ausschließlich Demo-Daten zeigen

## Pflichtprüfung vor dem ersten Commit und Push

1. Liste aller vorgesehenen Dateien anzeigen.
2. Personenbezogene Begriffe und private URLs suchen.
3. Nach Secrets, Tokens und Zugangsdaten suchen.
4. Bilder und Dokumente einzeln visuell prüfen.
5. Sicherstellen, dass keine Datenbank oder Historie enthalten ist.
6. Erst nach gemeinsamer Freigabe Git initialisieren oder veröffentlichen.
