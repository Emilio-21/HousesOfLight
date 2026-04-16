# Houses of Light — Biblioteca de Videos

Stack limpio, sin dependencias propietarias.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Base de datos:** SQLite (archivo local, cero configuración)

---

## Desarrollo local (VS Code)

Abre 2 terminales en VS Code (`Ctrl+\`` y luego `+`):

### Terminal 1 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

API disponible en: http://localhost:8001  
Documentación: http://localhost:8001/docs

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en: http://localhost:5173

> El frontend tiene proxy configurado hacia el backend, así que no hay problemas de CORS en desarrollo.

---

## Deploy en HostGator (o cualquier VPS con Python)

HostGator VPS tiene acceso SSH. El proceso es:

### 1. Subir el proyecto

```bash
# Desde tu máquina local
scp -r housesoflight/ usuario@tudominio.com:/home/usuario/
```

O usa FileZilla/cPanel File Manager para subir el ZIP.

### 2. Generar el build del frontend (en tu máquina local)

```bash
cd frontend
npm install
npm run build
```

Esto genera la carpeta `frontend/dist/` — esa es la que necesitas en el servidor.

### 3. En el servidor (SSH)

```bash
cd housesoflight/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Correr el servidor (sirve frontend + API juntos)
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 4. Configurar el dominio (cPanel → Apache proxy)

En HostGator con cPanel, crea un archivo `.htaccess` en `public_html/`:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:8001/$1 [P,L]
```

O usa la opción **"Apache as Reverse Proxy"** en cPanel.

### 5. Mantenerlo corriendo (con PM2 o systemd)

```bash
# Opción simple con nohup
nohup uvicorn server:app --host 0.0.0.0 --port 8001 &

# Opción recomendada con PM2 (si está disponible)
pip install uvicorn[standard]
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name housesoflight
pm2 save
pm2 startup
```

---

## Alternativas de hosting más simples

Si HostGator da problemas con Python, estas opciones son más fáciles:

| Servicio | Costo | Facilidad |
|---|---|---|
| **Railway** | Gratis (500h/mes) | Conectas el repo y listo |
| **Render** | Gratis | Deploy automático desde GitHub |
| **Fly.io** | Gratis (hobby) | Requiere CLI |

Para Railway/Render: solo sube el repo, apunta el root a `backend/`, y agrega la variable de entorno si necesitas.

---

## Variables de entorno

El proyecto funciona sin variables de entorno. Opcionales:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8001` | Puerto del servidor |
| `VITE_API_URL` | `` (vacío) | URL del backend en producción |

---

## Estructura del proyecto

```
housesoflight/
├── backend/
│   ├── server.py          ← API FastAPI + sirve el frontend
│   ├── requirements.txt   ← 5 dependencias solamente
│   └── db.sqlite3         ← se crea automáticamente
├── frontend/
│   ├── src/
│   │   ├── pages/         ← Home, Videos, Admin, etc.
│   │   ├── components/    ← Header, Footer, cards
│   │   └── lib/api.js     ← llamadas al backend
│   ├── dist/              ← build de producción (generado)
│   └── vite.config.js
├── start-dev.sh           ← script para desarrollo
└── build.sh               ← script para build
```
