import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Video, Folder, Users, ChartBar, Plus, Pencil, Trash, SignOut } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  getVideos, createVideo, updateVideo, deleteVideo,
  getCategories, createCategory, updateCategory, deleteCategory,
  getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker,
  getStats
} from '@/lib/api';

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({ videos: 0, categories: 0, speakers: 0, total_views: 0 });

  useEffect(() => {
    getStats().then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div data-testid="admin-dashboard">
      <h2 className="text-2xl font-black mb-8">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Video size={24} weight="bold" />
            <span className="text-3xl font-black">{stats.videos}</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Videos</p>
        </div>
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Folder size={24} weight="bold" />
            <span className="text-3xl font-black">{stats.categories}</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Categorías</p>
        </div>
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} weight="bold" />
            <span className="text-3xl font-black">{stats.speakers}</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Oradores</p>
        </div>
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ChartBar size={24} weight="bold" />
            <span className="text-3xl font-black">{stats.total_views.toLocaleString()}</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Vistas Totales</p>
        </div>
      </div>
    </div>
  );
};

// Videos Management
const VideosAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', video_url: '', thumbnail_url: '',
    duration: '', category_id: '', speaker_id: '', is_featured: false, video_type: 'youtube'
  });

  const fetchData = async () => {
    try {
      const [videosRes, categoriesRes, speakersRes] = await Promise.all([
        getVideos({}), getCategories(), getSpeakers()
      ]);
      setVideos(videosRes.data);
      setCategories(categoriesRes.data);
      setSpeakers(speakersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({
      title: '', description: '', video_url: '', thumbnail_url: '',
      duration: '', category_id: '', speaker_id: '', is_featured: false, video_type: 'youtube'
    });
    setEditingVideo(null);
  };

  const openDialog = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || '',
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url || '',
        duration: video.duration || '',
        category_id: video.category_id || '',
        speaker_id: video.speaker_id || '',
        is_featured: video.is_featured,
        video_type: video.video_type
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (!data.category_id) delete data.category_id;
      if (!data.speaker_id) delete data.speaker_id;

      if (editingVideo) {
        await updateVideo(editingVideo.id, data);
        toast.success('Video actualizado');
      } else {
        await createVideo(data);
        toast.success('Video creado');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Error al guardar video');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este video?')) return;
    try {
      await deleteVideo(id);
      toast.success('Video eliminado');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div data-testid="admin-videos">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black">Videos</h2>
        <Button onClick={() => openDialog()} className="rounded-none" data-testid="add-video-btn">
          <Plus size={16} className="mr-2" /> Agregar Video
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Orador</th>
              <th>Destacado</th>
              <th>Vistas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="font-medium">{video.title}</td>
                <td>{categories.find(c => c.id === video.category_id)?.name || '-'}</td>
                <td>{speakers.find(s => s.id === video.speaker_id)?.name || '-'}</td>
                <td>{video.is_featured ? 'Sí' : 'No'}</td>
                <td>{video.views}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openDialog(video)} className="p-2 hover:bg-gray-100" data-testid={`edit-video-${video.id}`}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(video.id)} className="p-2 hover:bg-gray-100 text-red-600" data-testid={`delete-video-${video.id}`}>
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-none">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Editar Video' : 'Nuevo Video'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="rounded-none" data-testid="video-title-input" />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-none" data-testid="video-description-input" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>URL del Video *</Label>
                <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} required className="rounded-none" data-testid="video-url-input" />
              </div>
              <div>
                <Label>Tipo de Video</Label>
                <Select value={formData.video_type} onValueChange={(v) => setFormData({ ...formData, video_type: v })}>
                  <SelectTrigger className="rounded-none" data-testid="video-type-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="external">Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>URL Thumbnail</Label>
                <Input value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} className="rounded-none" data-testid="video-thumbnail-input" />
              </div>
              <div>
                <Label>Duración (ej: 45:30)</Label>
                <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="rounded-none" data-testid="video-duration-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                  <SelectTrigger className="rounded-none" data-testid="video-category-select"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Orador</Label>
                <Select value={formData.speaker_id} onValueChange={(v) => setFormData({ ...formData, speaker_id: v })}>
                  <SelectTrigger className="rounded-none" data-testid="video-speaker-select"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {speakers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_featured} onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })} data-testid="video-featured-switch" />
              <Label>Video Destacado</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Cancelar</Button>
              <Button type="submit" className="rounded-none" data-testid="save-video-btn">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Categories Management
const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '', type: 'topic' });

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', image_url: '', type: 'topic' });
    setEditingCategory(null);
  };

  const openDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image_url: category.image_url || '',
        type: category.type
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Categoría actualizada');
      } else {
        await createCategory(formData);
        toast.success('Categoría creada');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div data-testid="admin-categories">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black">Categorías</h2>
        <Button onClick={() => openDialog()} className="rounded-none" data-testid="add-category-btn">
          <Plus size={16} className="mr-2" /> Agregar Categoría
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="font-medium">{cat.name}</td>
                <td className="capitalize">{cat.type === 'topic' ? 'Tema' : 'Serie'}</td>
                <td className="max-w-xs truncate">{cat.description || '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openDialog(cat)} className="p-2 hover:bg-gray-100" data-testid={`edit-category-${cat.id}`}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-gray-100 text-red-600" data-testid={`delete-category-${cat.id}`}>
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="rounded-none" data-testid="category-name-input" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger className="rounded-none" data-testid="category-type-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic">Tema</SelectItem>
                  <SelectItem value="series">Serie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-none" data-testid="category-description-input" />
            </div>
            <div>
              <Label>URL de Imagen</Label>
              <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="rounded-none" data-testid="category-image-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Cancelar</Button>
              <Button type="submit" className="rounded-none" data-testid="save-category-btn">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Speakers Management
const SpeakersAdmin = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [formData, setFormData] = useState({ name: '', bio: '', image_url: '' });

  const fetchData = async () => {
    try {
      const res = await getSpeakers();
      setSpeakers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ name: '', bio: '', image_url: '' });
    setEditingSpeaker(null);
  };

  const openDialog = (speaker = null) => {
    if (speaker) {
      setEditingSpeaker(speaker);
      setFormData({
        name: speaker.name,
        bio: speaker.bio || '',
        image_url: speaker.image_url || ''
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSpeaker) {
        await updateSpeaker(editingSpeaker.id, formData);
        toast.success('Orador actualizado');
      } else {
        await createSpeaker(formData);
        toast.success('Orador creado');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este orador?')) return;
    try {
      await deleteSpeaker(id);
      toast.success('Orador eliminado');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div data-testid="admin-speakers">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black">Oradores</h2>
        <Button onClick={() => openDialog()} className="rounded-none" data-testid="add-speaker-btn">
          <Plus size={16} className="mr-2" /> Agregar Orador
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Biografía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((speaker) => (
              <tr key={speaker.id}>
                <td className="font-medium">{speaker.name}</td>
                <td className="max-w-xs truncate">{speaker.bio || '-'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openDialog(speaker)} className="p-2 hover:bg-gray-100" data-testid={`edit-speaker-${speaker.id}`}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(speaker.id)} className="p-2 hover:bg-gray-100 text-red-600" data-testid={`delete-speaker-${speaker.id}`}>
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none">
          <DialogHeader>
            <DialogTitle>{editingSpeaker ? 'Editar Orador' : 'Nuevo Orador'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="rounded-none" data-testid="speaker-name-input" />
            </div>
            <div>
              <Label>Biografía</Label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="rounded-none" data-testid="speaker-bio-input" />
            </div>
            <div>
              <Label>URL de Imagen</Label>
              <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="rounded-none" data-testid="speaker-image-input" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-none">Cancelar</Button>
              <Button type="submit" className="rounded-none" data-testid="save-speaker-btn">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Admin Component
const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: ChartBar },
    { path: '/admin/videos', label: 'Videos', icon: Video },
    { path: '/admin/categories', label: 'Categorías', icon: Folder },
    { path: '/admin/speakers', label: 'Oradores', icon: Users },
  ];

  return (
    <div className="min-h-screen flex" data-testid="admin-page">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black/10 hidden lg:block admin-sidebar">
        <div className="p-6 border-b border-black/10">
          <h1 className="font-black text-lg">Admin Panel</h1>
        </div>
        <nav>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 ${currentPath === path ? 'active' : ''}`}
              data-testid={`admin-nav-${label.toLowerCase()}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-black/10 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors w-full"
          >
            <SignOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 z-50">
        <nav className="flex">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-widest ${
                currentPath === path ? 'text-black' : 'text-gray-400'
              }`}
              data-testid={`mobile-admin-nav-${label.toLowerCase()}`}
            >
              <Icon size={20} weight={currentPath === path ? 'fill' : 'regular'} />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-12 pb-24 lg:pb-12">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="videos" element={<VideosAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="speakers" element={<SpeakersAdmin />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
