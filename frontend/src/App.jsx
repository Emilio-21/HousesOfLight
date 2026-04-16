import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminGuard from '@/components/AdminGuard'
import Home from '@/pages/Home'
import Videos from '@/pages/Videos'
import VideoDetail from '@/pages/VideoDetail'
import Categories from '@/pages/Categories'
import CategoryDetail from '@/pages/CategoryDetail'
import Speakers from '@/pages/Speakers'
import SpeakerDetail from '@/pages/SpeakerDetail'
import Admin from '@/pages/Admin'
import AdminLogin from '@/pages/AdminLogin'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          {/* Admin login — sin Header ni Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protegido */}
          <Route path="/admin/*" element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          } />

          {/* Rutas públicas */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/videos/:id" element={<VideoDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:id" element={<CategoryDetail />} />
                  <Route path="/speakers" element={<Speakers />} />
                  <Route path="/speakers/:id" element={<SpeakerDetail />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </div>
  )
}

export default App
