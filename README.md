# jsramverkBackend

## Specifikation

### Säkerhetshål
När vi kör 'npm audit' i Backenden hittar vi 11 säkerhetshål från olika paket.
De flesta paketen tappar sin säkerhet på grund av ReDOS (Regular expression Denial of Service).
Vilket är en attack på en servern via regex.
Vi fixar detta genom att använda kommandot 'npm audit fix', som uppdaterar paketen åt oss.

### Hur vi fick applikationen att fungera
För att få applikationen att fungera var det egentligen bara två saker som behövde göras.
Det första var att skaffa en API-nyckel då vi av förklarliga skäl inte hade tillgång till
Emils, som läses in som en global variabel från .env-filen i projektroten.

Efter att ha skapat denna på Trafikverkets hemsida så hårdkodade vi in den i
trains-modellen, som är en av de första filer att läsas in av trains.js.
Detta var mest för att snabbt se att allt fungerade som det skulle.
När detta visade sig fungera så var det helt enkelt bara att "göra om och göra rätt"
och istället skapa .env-filen och istället lägga nyckeln där.

Den andra saken some behövde göras var att köra bash-skriptet reset_db i db-foldern.
Detta gör så att tickets-tabellen skapas i databasen trains.sqlite.
Utan denna så kraschar applikationen när man klickar på ett av de försenade tågen
i listan. Det beror på att när denna vy skapas så försöker den hämta befintliga ärenden
från tickets-tabellen från databasen, vilket ju blir svårt om en sådan tabell inte finns.

### Val av ramverk
För ramverk har vi valt att arbeta med Svelte.
Vi valde Svelte för att den har samma funktionaliteter som React (reactive states, conditional logic),
men liknar mera html + vanilla JS i syntax.
Desutom har vi inte arbetat med Svelte förr, så det kommer förstärka våran anpassningsförmåga.