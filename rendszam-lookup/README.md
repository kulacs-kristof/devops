# Rendszám lekérdező alkalmazás

Ez a projekt egy egyszerű, frontend/backendre bontható rendszám-kereső alkalmazást tartalmaz.
A frontend lehetővé teszi egy rendszám bevitelét, a backend pedig visszaadja a hozzátartozó nevet 10 minta adat alapján.

## Tartalom

- `backend/` - Express.js API a rendszámok lekérdezésére
- `frontend/` - statikus HTML/JavaScript felület
- `k8s/` - Kubernetes deployment és service manifest fájlok

## Használat Dockerrel

### Backend build és futtatás

1. Nyisd meg a `backend` mappát.
2. Futtasd:
   ```bash
   docker build -t rendszam-backend ./backend
   docker run -p 3000:3000 rendszam-backend
   ```

### Frontend build és futtatás

1. Nyisd meg a `frontend` mappát.
2. Futtasd:
   ```bash
   docker build -t rendszam-frontend ./frontend
   docker run -p 80:80 rendszam-frontend
   ```

A frontend alapértelmezés szerint a Kubernetes `backend-service` nevű backend szolgáltatásra hivatkozik. Lokális teszteléshez a `frontend/app.js` fájlban módosíthatod a `BACKEND_URL` változót `http://localhost:3000` értékre.

## Kubernetes telepítés

A `k8s/` könyvtárban két deployment és két service található:

- `backend-deployment.yaml`
- `backend-service.yaml`
- `frontend-deployment.yaml`
- `frontend-service.yaml`

Telepítés:
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

A frontend szolgáltatás alapértelmezett portja `80`.
## GitHub Actions

A projekt tartalmaz egy GitHub Actions workflow-t a `.github/workflows/ci.yml` fájlban.

Ez a workflow a `main` ágra történő push esetén, illetve manuális indításkor:

- lekéri a repository tartalmát
- telepíti a backend függőségeit
- felépíti a backend és frontend Docker képeket

A workflow futtatása után a CI állapotot a GitHub Actions felületén láthatod.
