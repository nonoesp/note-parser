# Note Parser

A plain-text parser proof-of-concept.

At the moment, this app parses dates, weights, and currency in euros.

Here's a sample note.

```
2022

Aug

18

63.5kg

19

65kg
62.50€/2 #food @supermarket

23

23€ #food @gusto
```

## Usage

Clone this repository locally.

```sh
https://github.com/nonoesp/note-parser && cd note-parser
```

Install NPM dependencies

```sh
npm install
```

Start the development server (with esbuild).

```sh
npm start
```