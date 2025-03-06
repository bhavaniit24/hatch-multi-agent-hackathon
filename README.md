# Client Setup

## Navigate to the client folder

```bash
cd client
```

## Install the client

```bash
npm install
```

or use yarn / pnpm instead of npm

## Run the client

```bash
npm dev
```

# Server Setup

## Navigate to the server folder

```bash
cd server
```

## Create a virtual environment

```bash
python3 -m venv venv
```

## Activate the virtual environment

```bash
source venv/bin/activate
```

for Windows:

```bash
venv\Scripts\activate
```

## Install dependencies

```bash
pip3 install poetry
````

```bash
poetry install
```

## Run the server

```bash
poetry run python src/main.py
```