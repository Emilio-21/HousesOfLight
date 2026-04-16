#!/bin/bash
# build.sh — genera el build de producción y lo deja listo para subir al servidor

set -e

echo "▶ Instalando dependencias del frontend..."
cd frontend
npm install
echo "▶ Generando build de producción..."
npm run build
cd ..

echo ""
echo "✅ Build listo en frontend/dist/"
echo ""
echo "Para correr en producción:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn server:app --host 0.0.0.0 --port 8001"
