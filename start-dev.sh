#!/bin/bash
# start-dev.sh — corre frontend y backend en paralelo para desarrollo local

echo "▶ Iniciando backend..."
cd backend
python -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn server:app --reload --port 8001 &
BACKEND_PID=$!
cd ..

echo "▶ Iniciando frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Listo:"
echo "   Frontend → http://localhost:5173"
echo "   Backend  → http://localhost:8001"
echo "   API Docs → http://localhost:8001/docs"
echo ""
echo "Presiona Ctrl+C para detener todo"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
