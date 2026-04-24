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

A frontend a `/api` relatív útvonalon keresztül kommunikál a backenddel. Lokális teszteléshez ugyanígy használhatod a `http://localhost/api/lookup` URL-t, ha a backend és a frontend ugyanazon a hoston érhető el.

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
kubectl apply -f k8s/ingress.yaml
```

A frontend szolgáltatás alapértelmezett portja `80`.

## Ingress

A projekt `k8s/ingress.yaml` fájlja egy Ingress-t definiál a `kulacs-beadando.jcloud.jedlik.cloud` hostra.

- `/` útvonal a frontend szolgáltatásra irányít
- `/api` útvonal a backend szolgáltatásra irányít

> Az Ingress controllernek telepítve kell lennie a klaszterben, és az `nginx` ingress class-ot kell használnia.

## GitHub Actions

A projekt tartalmaz egy GitHub Actions workflow-t a `.github/workflows/ci.yml` fájlban.

Ez a workflow a `main` ágra történő push esetén, illetve manuális indításkor:

- lekéri a repository tartalmát
- telepíti a backend függőségeit
- felépíti és feltölti a backend és frontend Docker képeket a GitHub Container Registry-be
- telepíti a Kubernetes manifesteket a klaszterre
- beállítja a deploymentekhez a legfrissebb image-eket

### Szükséges titkok

A GitHub repository titkai között add hozzá:

- `KUBE_CONFIG_DATA` – base64 kódolt kubeconfig fájl a klaszteredhez
- `GHCR_PAT` – személyes hozzáférési token a GitHub Container Registry-hez, `read:packages` és `write:packages` jogosultsággal

A workflow `GHCR_PAT` titkot fog használni Docker image push-hoz. Ha nincs beállítva, a beépített `GITHUB_TOKEN` lesz az alapértelmezett.

A `KUBE_CONFIG_DATA`-nak NEM szabad `localhost:8080`-ra mutatnia, mert a GitHub Actions futtató környezetből ez a cím nem érhető el. Használj olyan kubeconfiget, amely egy valóban elérhető Kubernetes API szerverhez csatlakozik.

Ha a klasztered és az ingress működik, a frissített alkalmazás az `https://kulacs-beadando.jcloud.jedlik.cloud` címen lesz elérhető.
