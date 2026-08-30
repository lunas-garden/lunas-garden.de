# transcendingwomen.de

Statische Website von Tanja Sauer. **Dies ist der einzige gültige Arbeitsort.**

- **Live:** https://transcendingwomen.de
- **Repo:** `lunas-garden/lunas-garden.de` (öffentlich), Branch **`Main-New-V2`**
- **Hosting:** GitHub Pages, `CNAME` zeigt auf transcendingwomen.de.
  **Push auf `Main-New-V2` geht sofort live.**
- Kein Build, keine Abhängigkeiten. `python3 -m http.server 8765` genügt.

## Niemals löschen

| Datei | Warum |
|---|---|
| `intro.jpg`, `next.jpg`, `projekt.jpg`, `soma.jpg` | Newsletter-Bilder, aus Brevo verlinkt, in keiner HTML referenziert |
| `google60f8922561689841.html` | Google-Search-Console-Verifikation |
| `CNAME` | ohne sie fällt die Domain zurück auf github.io |
| `images/` | alter Bildersatz, noch nicht abgelöst |
| `robots.txt`, `sitemap.xml` | SEO; Sitemap **ergänzen**, nicht überschreiben |

## Layout ist eingefroren (Stand 30.08.2026)

Von Marcel abgenommen. Nur Inhalte und ganze Sections ändern — keine Layoutregeln.

- `--content: calc(var(--max) - 2 * var(--pad))` — **jede** Section liegt auf
  dieser Breite, identisch mit der Inhaltsbreite der Navigationsleiste.
  Neue Sections bekommen denselben Wrapper.
- `--article: 720px` — Breadcrumb, Kopf, Bild und Fließtext der Blogartikel.
- Kopfzeile: `.main-nav { flex: 1 1 0 }` + `ul { justify-content: space-between;
  flex-wrap: nowrap }`, Aktionsgruppe rechts per `margin-left: auto`.
  Burger-Menü ab 1259 px, CTA-Pill unter 768 px ausgeblendet.
  **Abstände nie an `vw` hängen** — das verursachte den Zwei-Zeilen-Umbruch.
  Reserve bei 1260 px nur noch ~30 px: ein achter Menüpunkt kippt die Zeile.
- Bilder in Zweispaltern: `aspect-ratio: 3 / 4`.
- **Kein `loading="lazy"`** — damit wurde reproduzierbar kein Bild unterhalb
  des Sichtbereichs nachgeladen.
- Mindestschriftgröße **10 pt = 13,33 px** (`0.8333rem`).
- Schriften liegen lokal in `fonts/`. **Keine Google Fonts einbinden** (DSGVO).

## Zweisprachigkeit

Jedes Textelement trägt `data-lang-de` und `data-lang-en`, der deutsche Text
steht zusätzlich als sichtbarer Inhalt. Fehlt `data-lang-en`, bleibt das
Element beim Umschalten deutsch stehen.

## FAQ und JSON-LD

Wird das sichtbare FAQ geändert, **muss** das `FAQPage`-JSON-LD am Seitenende
wortgleich mitgezogen werden — sonst ist es ein Structured-Data-Verstoß.

## Preise

1:1 und The Space Within haben **bewusst keine Preise** auf der Seite; der Preis
fällt im Kennenlerngespräch. Einzige öffentliche Preisangabe ist der Love Letter
(24,99 €/Monat, bestellbar im Studio-Lila-Shop).
