# MPA toolkit

## Requirements

- Postgres
- yarn

## Getting started

1. Fill out `.env` file (see `.env.example` for keys)

2. Install dependencies
```
yarn
```

3. Set up database
```
npx prisma migrate dev
```

4. Run dev server

```
yarn dev
```

## VSCode settings

Install following extensions:
- EditorConfig for VS Code (to make use of the `.editorconfig` file)
- ESLint
- Prettier
- Svelte for VS Code
- Prisma (provides syntax highlighting for prisma schema)
