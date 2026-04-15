from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import uuid
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext

# ─── Setup ───────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / '.env')

DB_PATH = BASE_DIR / "db.sqlite3"
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

# ─── Auth Config ─────────────────────────────────────────────────────────────

SECRET_KEY = os.environ.get("SECRET_KEY", "changeme-use-a-long-random-string-in-production")
ALGORITHM = "HS256"
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)

app = FastAPI(title="Houses of Light API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Database ─────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            type TEXT DEFAULT 'topic',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS speakers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            bio TEXT,
            image_url TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS videos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            video_url TEXT NOT NULL,
            thumbnail_url TEXT,
            duration TEXT,
            category_id TEXT,
            speaker_id TEXT,
            is_featured INTEGER DEFAULT 0,
            video_type TEXT DEFAULT 'youtube',
            views INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()

init_db()

# ─── Models ───────────────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    type: str = "topic"

class Category(CategoryCreate):
    id: str
    created_at: str

class SpeakerCreate(BaseModel):
    name: str
    bio: Optional[str] = None
    image_url: Optional[str] = None

class Speaker(SpeakerCreate):
    id: str
    created_at: str

class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category_id: Optional[str] = None
    speaker_id: Optional[str] = None
    is_featured: bool = False
    video_type: str = "youtube"

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    category_id: Optional[str] = None
    speaker_id: Optional[str] = None
    is_featured: Optional[bool] = None
    video_type: Optional[str] = None

class Video(VideoCreate):
    id: str
    views: int
    created_at: str

class LoginRequest(BaseModel):
    username: str
    password: str

# ─── Helpers ──────────────────────────────────────────────────────────────────

def row_to_dict(row):
    return dict(row) if row else None

def rows_to_list(rows):
    return [dict(r) for r in rows]

def now():
    return datetime.utcnow().isoformat()

# ─── Admin Auth ───────────────────────────────────────────────────────────────

@app.post("/api/admin/login")
def admin_login(data: LoginRequest):
    if data.username != ADMIN_USER or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = jwt.encode({"sub": data.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/admin/verify")
def admin_verify(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No autorizado")
    try:
        jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return {"valid": True}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ─── Categories ───────────────────────────────────────────────────────────────

@app.get("/api/categories", response_model=List[Category])
def get_categories(type: Optional[str] = None):
    conn = get_db()
    if type:
        rows = conn.execute("SELECT * FROM categories WHERE type=? ORDER BY created_at DESC", (type,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM categories ORDER BY created_at DESC").fetchall()
    conn.close()
    return rows_to_list(rows)

@app.get("/api/categories/{category_id}", response_model=Category)
def get_category(category_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM categories WHERE id=?", (category_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Category not found")
    return row_to_dict(row)

@app.post("/api/categories", response_model=Category)
def create_category(data: CategoryCreate):
    cat = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": now()}
    conn = get_db()
    conn.execute(
        "INSERT INTO categories VALUES (:id,:name,:description,:image_url,:type,:created_at)",
        cat
    )
    conn.commit()
    conn.close()
    return cat

@app.put("/api/categories/{category_id}", response_model=Category)
def update_category(category_id: str, data: CategoryCreate):
    conn = get_db()
    conn.execute(
        "UPDATE categories SET name=?,description=?,image_url=?,type=? WHERE id=?",
        (data.name, data.description, data.image_url, data.type, category_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM categories WHERE id=?", (category_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Category not found")
    return row_to_dict(row)

@app.delete("/api/categories/{category_id}")
def delete_category(category_id: str):
    conn = get_db()
    conn.execute("DELETE FROM categories WHERE id=?", (category_id,))
    conn.commit()
    conn.close()
    return {"message": "Category deleted"}

# ─── Speakers ─────────────────────────────────────────────────────────────────

@app.get("/api/speakers", response_model=List[Speaker])
def get_speakers():
    conn = get_db()
    rows = conn.execute("SELECT * FROM speakers ORDER BY created_at DESC").fetchall()
    conn.close()
    return rows_to_list(rows)

@app.get("/api/speakers/{speaker_id}", response_model=Speaker)
def get_speaker(speaker_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM speakers WHERE id=?", (speaker_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Speaker not found")
    return row_to_dict(row)

@app.post("/api/speakers", response_model=Speaker)
def create_speaker(data: SpeakerCreate):
    speaker = {**data.model_dump(), "id": str(uuid.uuid4()), "created_at": now()}
    conn = get_db()
    conn.execute(
        "INSERT INTO speakers VALUES (:id,:name,:bio,:image_url,:created_at)",
        speaker
    )
    conn.commit()
    conn.close()
    return speaker

@app.put("/api/speakers/{speaker_id}", response_model=Speaker)
def update_speaker(speaker_id: str, data: SpeakerCreate):
    conn = get_db()
    conn.execute(
        "UPDATE speakers SET name=?,bio=?,image_url=? WHERE id=?",
        (data.name, data.bio, data.image_url, speaker_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM speakers WHERE id=?", (speaker_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Speaker not found")
    return row_to_dict(row)

@app.delete("/api/speakers/{speaker_id}")
def delete_speaker(speaker_id: str):
    conn = get_db()
    conn.execute("DELETE FROM speakers WHERE id=?", (speaker_id,))
    conn.commit()
    conn.close()
    return {"message": "Speaker deleted"}

# ─── Videos ───────────────────────────────────────────────────────────────────

@app.get("/api/videos/featured", response_model=List[Video])
def get_featured_videos():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM videos WHERE is_featured=1 ORDER BY created_at DESC LIMIT 10"
    ).fetchall()
    conn.close()
    return rows_to_list(rows)

@app.get("/api/videos/recent", response_model=List[Video])
def get_recent_videos(limit: int = 8):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM videos ORDER BY created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return rows_to_list(rows)

@app.get("/api/videos", response_model=List[Video])
def get_videos(
    category_id: Optional[str] = None,
    speaker_id: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0,
):
    query = "SELECT * FROM videos WHERE 1=1"
    params = []
    if category_id:
        query += " AND category_id=?"
        params.append(category_id)
    if speaker_id:
        query += " AND speaker_id=?"
        params.append(speaker_id)
    if featured is not None:
        query += " AND is_featured=?"
        params.append(1 if featured else 0)
    if search:
        query += " AND (title LIKE ? OR description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    conn = get_db()
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return rows_to_list(rows)

@app.get("/api/videos/{video_id}", response_model=Video)
def get_video(video_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM videos WHERE id=?", (video_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")
    return row_to_dict(row)

@app.post("/api/videos/{video_id}/view")
def increment_view(video_id: str):
    conn = get_db()
    conn.execute("UPDATE videos SET views=views+1 WHERE id=?", (video_id,))
    conn.commit()
    conn.close()
    return {"message": "View counted"}


def extract_youtube_thumbnail(url: str):
    """Extrae la URL del thumbnail de un video de YouTube."""
    import re
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\s?/]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            return f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
    return None

@app.post("/api/videos", response_model=Video)
def create_video(data: VideoCreate):
    thumbnail = data.thumbnail_url
    if not thumbnail and data.video_type == "youtube":
        thumbnail = extract_youtube_thumbnail(data.video_url)
    video = {
        **data.model_dump(),
        "id": str(uuid.uuid4()),
        "views": 0,
        "created_at": now(),
        "is_featured": 1 if data.is_featured else 0,
        "thumbnail_url": thumbnail,
    }
    conn = get_db()
    conn.execute(
        """INSERT INTO videos
           VALUES (:id,:title,:description,:video_url,:thumbnail_url,:duration,
                   :category_id,:speaker_id,:is_featured,:video_type,:views,:created_at)""",
        video
    )
    conn.commit()
    conn.close()
    video["is_featured"] = bool(video["is_featured"])
    return video

@app.put("/api/videos/{video_id}", response_model=Video)
def update_video(video_id: str, data: VideoUpdate):
    # Auto-fill thumbnail from YouTube if not provided
    dump = data.model_dump()
    if not dump.get("thumbnail_url") and dump.get("video_url") and dump.get("video_type") == "youtube":
        dump["thumbnail_url"] = extract_youtube_thumbnail(dump["video_url"])
    updates = {k: v for k, v in dump.items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No data provided")
    if "is_featured" in updates:
        updates["is_featured"] = 1 if updates["is_featured"] else 0
    set_clause = ", ".join(f"{k}=?" for k in updates)
    conn = get_db()
    conn.execute(
        f"UPDATE videos SET {set_clause} WHERE id=?",
        [*updates.values(), video_id]
    )
    conn.commit()
    row = conn.execute("SELECT * FROM videos WHERE id=?", (video_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")
    result = row_to_dict(row)
    result["is_featured"] = bool(result["is_featured"])
    return result

@app.delete("/api/videos/{video_id}")
def delete_video(video_id: str):
    conn = get_db()
    conn.execute("DELETE FROM videos WHERE id=?", (video_id,))
    conn.commit()
    conn.close()
    return {"message": "Video deleted"}

# ─── Stats ────────────────────────────────────────────────────────────────────

@app.get("/api/stats")
def get_stats():
    conn = get_db()
    videos = conn.execute("SELECT COUNT(*) FROM videos").fetchone()[0]
    categories = conn.execute("SELECT COUNT(*) FROM categories").fetchone()[0]
    speakers = conn.execute("SELECT COUNT(*) FROM speakers").fetchone()[0]
    total_views = conn.execute("SELECT COALESCE(SUM(views),0) FROM videos").fetchone()[0]
    conn.close()
    return {"videos": videos, "categories": categories, "speakers": speakers, "total_views": total_views}

@app.get("/api/health")
def health():
    return {"status": "ok"}

# ─── Serve Frontend (SPA) ─────────────────────────────────────────────────────

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        index = FRONTEND_DIST / "index.html"
        return FileResponse(index)
