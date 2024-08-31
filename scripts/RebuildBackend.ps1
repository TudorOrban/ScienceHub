
Push-Location -Path "sciencehub-backend"

docker build -t tudoraorban/sciencehub-backend:latest -f ./sciencehub-backend/Dockerfile .

Pop-Location
