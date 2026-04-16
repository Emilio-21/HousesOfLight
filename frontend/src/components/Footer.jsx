import { Link } from 'react-router-dom';
import { InstagramLogo, YoutubeLogo, FacebookLogo, EnvelopeSimple } from '@phosphor-icons/react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 sm:py-24" data-testid="footer">
      <div className="px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">
              HOUSES OF LIGHT
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Una biblioteca de videos dedicada a compartir enseñanzas, adoración y testimonios que transforman vidas.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-youtube">
                <YoutubeLogo size={24} weight="fill" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-instagram">
                <InstagramLogo size={24} weight="fill" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-facebook">
                <FacebookLogo size={24} weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Navegar</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/videos" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="footer-videos">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="footer-categories">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="text-gray-400 hover:text-white transition-colors text-sm" data-testid="footer-speakers">
                  Oradores
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6">Contacto</h3>
            <div className="flex items-center gap-3 text-gray-400">
              <EnvelopeSimple size={20} />
              <a href="mailto:contact@housesoflight.org" className="text-sm hover:text-white transition-colors" data-testid="footer-email">
                contact@housesoflight.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs text-center uppercase tracking-widest">
            © {new Date().getFullYear()} Houses of Light. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
