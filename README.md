# Regneflyt

* Regneflyt er et mattespill som tar for seg de fire regneartene (addisjon, subtraksjon, multiplikasjon, divisjon).
* Som spiller blir du presentert for oppgaver, én etter én. Oppgavene blir automatisk generert basert på en *definisjon*.
* Målet er å besvare så mange oppgaver som mulig innenfor en gitt tidsramme.
* Når tiden er ute presenteres et resultat med antall oppgaver besvart, hvilke som ble besvart korrekt, og hvor lang tid det ble brukt på hver oppgave. 

## Ontologi

* Definisjon (Definition)
    * Utgangspunktet for generering av oppgaver
    * Angir regneart, interval for svaret (f.eks at svaret kan være mellom 0 og 100) samt hvorvidt hvilken del som er ukjent kan randomiseres
* Sesjon (Session)
    * En "runde" av spillet
    * Er tilknyttet en definisjon
    * Er tidsbegrenset i minutter
    * 
* Oppgave (Puzzle)
    * Er knyttet til en definisjon og en sesjon
