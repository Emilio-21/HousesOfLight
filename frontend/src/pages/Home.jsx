import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Video } from '@phosphor-icons/react';
import VideoCard from '@/components/VideoCard';
import CategoryCard from '@/components/CategoryCard';
import SpeakerCard from '@/components/SpeakerCard';
import { getRecentVideos, getFeaturedVideos, getCategories, getSpeakers } from '@/lib/api';

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes, categoriesRes, speakersRes] = await Promise.all([
          getFeaturedVideos(),
          getRecentVideos(8),
          getCategories(),
          getSpeakers(),
        ]);
        setFeaturedVideos(featuredRes.data);
        setRecentVideos(recentRes.data);
        setCategories(categoriesRes.data);
        setSpeakers(speakersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid="home-page">

      {/* 1 — Hero */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center bg-white overflow-hidden" data-testid="hero-section">
        <div className="px-6 sm:px-12 lg:px-24 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 opacity-0 animate-fade-in">
                Biblioteca de Videos
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.9] mb-6 opacity-0 animate-fade-in stagger-1">
                Siempre podemos ir<br />
                <span style={{ color: '#3767ac' }}>más allá en el amor</span><br />
                <span className="text-gray-400">a Dios y a los demás.</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-600 max-w-xl mb-10 opacity-0 animate-fade-in stagger-2">
                Accede a una colección de videos de enseñanzas bíblicas, adoración y testimonios de Houses of Light.
              </p>
              <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in stagger-3">
                <a
                  href="https://housesoflight.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium transition-colors rounded-full"
                  style={{ backgroundColor: '#3767ac' }}
                >
                  Iglesia local
                </a>
                <a
                  href="https://housesoflight.churchcenter.com/giving"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium transition-colors rounded-full"
                  style={{ backgroundColor: '#dc853c' }}
                >
                  Apoyar al ministerio
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 opacity-0 animate-fade-in stagger-2">
              <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Houses of Light Worship"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-black/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Conócenos / Ama Mejor */}
      <section style={{ backgroundColor: '#2a2725' }} className="text-white" data-testid="vision-section">

        {/* Bienvenida */}
        <div className="py-20 sm:py-28 px-6 sm:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#dc853c' }}>Conócenos</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-8">
              Bienvenido a Ama Mejor
            </h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: '#c9b99a' }}>
              Existimos para formar una generación cimentada en la verdad, que ama mejor a través del encuentro con Jesús y de un entendimiento más profundo de las Escrituras. Encuentra recursos bíblicos diseñados para fortalecer tu relación con Dios, con tu familia e iglesia; para comprender nuestros tiempos y responder adecuadamente. Te invitamos a explorar y compartir estas enseñanzas con quienes las necesitan.
            </p>
          </div>
        </div>

        {/* Espacio para video */}
        <div className="px-6 sm:px-12 lg:px-24 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-sm uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Video próximamente</p>
            </div>
          </div>
        </div>

        {/* Generosidad */}
        <div className="py-20 sm:py-28 px-6 sm:px-12 lg:px-24" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: '#dc853c' }}>Dona</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                Tu generosidad hace esto posible
              </h2>
            </div>
            <div>
              <p className="leading-relaxed mb-8" style={{ color: '#c9b99a' }}>
                Creemos que la verdad de las Escrituras debe ser accesible para todos. Al unirte con tu donativo, no solo sostienes este ministerio, sino que te conviertes en un sembrador para seguir generando recursos que equipan a la iglesia y fortalecen a la familia. Gracias por ser parte de esta labor.
              </p>
              <a
                href="https://housesoflight.org/give"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-widest font-medium transition-opacity hover:opacity-90 rounded-full text-white"
                style={{ backgroundColor: '#dc853c' }}
              >
                Apoyar al ministerio
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* 3 — Categorías */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24" data-testid="categories-section">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Explorar</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Categorías</h2>
            </div>
            <Link
              to="/categories"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium hover:underline"
              data-testid="categories-see-all"
            >
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <div key={category.id} className={`stagger-${index + 1}`}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4 — Highlights */}
      {featuredVideos.length > 0 && (
        <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24 bg-black text-white" data-testid="highlights-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Lo Más Destacado</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Highlights</h2>
              </div>
              <Link
                to="/videos?featured=true"
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors"
                data-testid="highlights-see-all"
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>

            {featuredVideos[0] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Link to={`/videos/${featuredVideos[0].id}`} className="group" data-testid="highlight-main">
                  <div className="aspect-video overflow-hidden relative rounded-xl">
                    <img
                      src={featuredVideos[0].thumbnail_url}
                      alt={featuredVideos[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                        <Play size={32} weight="fill" className="text-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{featuredVideos[0].duration}</p>
                    <h3 className="text-xl lg:text-2xl font-bold group-hover:underline underline-offset-4">{featuredVideos[0].title}</h3>
                    <p className="text-gray-400 mt-2 line-clamp-2">{featuredVideos[0].description}</p>
                  </div>
                </Link>

                <div className="space-y-6">
                  {featuredVideos.slice(1, 4).map((video) => (
                    <Link key={video.id} to={`/videos/${video.id}`} className="flex gap-4 group" data-testid={`highlight-${video.id}`}>
                      <div className="w-40 sm:w-48 flex-shrink-0 aspect-video overflow-hidden relative rounded-lg">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={20} weight="fill" className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{video.duration}</p>
                        <h4 className="font-bold text-sm sm:text-base group-hover:underline underline-offset-2 line-clamp-2">{video.title}</h4>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1 hidden sm:block">{video.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5 — Oradores */}
      {speakers.length > 0 && (
        <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24" data-testid="speakers-section">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Nuestros</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">Oradores</h2>
            </div>
            <Link
              to="/speakers"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium hover:underline"
              data-testid="speakers-see-all"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {speakers.slice(0, 6).map((speaker, index) => (
              <div key={speaker.id} className={`stagger-${index + 1}`}>
                <SpeakerCard speaker={speaker} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6 — Recursos / Libros */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: '#f1e9de' }} data-testid="resources-section">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: '#dc853c' }}>Recursos</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900">Libros</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Imagen del libro */}
            <div className="flex items-center justify-center">
              <div
                className="w-full max-w-sm aspect-[3/4] rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.08)', border: '1px dashed rgba(0,0,0,0.15)' }}
              >
                <p className="text-sm uppercase tracking-widest text-gray-400">Imagen del libro</p>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-6">
                Ama Mejor
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                A lo largo de este libro conocerás de una manera más clara cómo funciona tu pareja en las áreas más importantes, permitiéndote tratarla y amarla como necesita para experimentar una cercanía y armonía que reavivará tu matrimonio, aun si la relación se ha deteriorado.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Con el fundamento de la Palabra de Dios, verdades, principios, testimonios, ejemplos y reflexiones prácticas este libro te guiará a entender las grandes diferencias que existen en la forma en la que el hombre y la mujer reaccionan, se relacionan, se comunican, resuelven sus diferencias, manejan su dinero, entienden el romanticismo y la sexualidad.
              </p>
              <a
                href="https://a.co/d/0btLlJzH"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#3767ac' }}
              >
                Adquirir
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 7 — Acerca del Pastor */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 lg:px-24 bg-white" data-testid="pastor-section">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: '#dc853c' }}>Conócelo</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900">Acerca del P. Netz Gómez</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Foto */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <img
                src="https://cdn-lhilp.nitrocdn.com/YkdZMcTSNiYrSvcwFaBpeBdfhRfuJFIK/assets/images/optimized/rev-4384e4a/turningheartsacademy.com/wp-content/uploads/2025/01/Png_tha-946x1024.png"
                alt="Pastor Netz Gómez"
                className="w-full max-w-sm object-contain"
              />
            </div>

            {/* Texto */}
            <div className="order-2 lg:order-1">
              <p className="text-gray-600 leading-relaxed mb-4">
                Originario de la Ciudad de México, el P. Netz Gómez cuenta con más de 40 años de trayectoria ministerial y más de dos décadas dedicado a la consejería matrimonial. Posee un Doctorado en Psicología Clínica Pastoral, formación que integra con su labor ministerial.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Actualmente reside en Los Angeles, CA junto a su esposa Lourdes; sirve como pastor principal de la iglesia Houses of Light Church en Northridge. Su misión se centra en la restauración de la familia y en proclamar con claridad el mensaje de salvación en tiempos de crisis.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Empty State */}
      {!loading && recentVideos.length === 0 && categories.length === 0 && (
        <section className="py-24 px-6 sm:px-12 lg:px-24 text-center" data-testid="empty-state">
          <div className="max-w-md mx-auto">
            <Video size={64} weight="thin" className="mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-black mb-4">Bienvenido a Ama Mejor</h2>
            <p className="text-gray-500 mb-8">
              La biblioteca está vacía. Comienza agregando videos, categorías y oradores desde el panel de administración.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#3767ac' }}
              data-testid="empty-state-cta"
            >
              Ir al Admin
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;