import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const productImages = [
    { src: "/images/ravioles-img.jpg", alt: "Ravioles artesanales" },
    { src: "/images/gnoccis-img.jpeg", alt: "Ñoquis de papa" },
    { src: "/images/sorrentinos-img.webp", alt: "Sorrentinos rellenos" },
    { src: "/images/tortellini-img.jpg", alt: "Tortellini frescos" },
    { src: "/images/pastas-varias-img.jpg", alt: "Variedad de pastas" },
    { src: "/images/penne-rigate.jpg", alt: "Penne rigate" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll('.animate-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all sections and animated elements
    const sections = document.querySelectorAll('section');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    sections.forEach((section) => observer.observe(section));
    animatedElements.forEach((element) => observer.observe(element));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      animatedElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      setMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleKeyDown = (e) => {
    if (modalOpen) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Close mobile menu on escape key and prevent body scroll when open
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      // Check if screen width is greater than 768px (desktop breakpoint)
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration
      const templateParams = {
        from_name: formData.name,
        business_name: formData.businessName,
        business_type: formData.businessType,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        to_email: 'ventas@belmangiare.com'
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      console.log('Email sent successfully:', result);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        businessType: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      
      // Reset error status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <img src="/images/bel-mangiare-logo.png" alt="Bel Mangiare" style={{height: '40px'}} />
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <ul>
              <li><a href="#home" onClick={() => scrollToSection('home')}>Inicio</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')}>Nosotros</a></li>
              <li><a href="#products" onClick={() => scrollToSection('products')}>Productos</a></li>
              <li><a href="#clients" onClick={() => scrollToSection('clients')}>Clientes</a></li>
              <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
              <li><a href="#faq" onClick={() => scrollToSection('faq')}>FAQ</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')}>Pedidos</a></li>
            </ul>
          </nav>

        </div>
      </header>

      {/* Mobile Navigation - Moved outside header */}
      <nav 
        className={`mobile-nav ${mobileMenuOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setMobileMenuOpen(false);
          }
        }}
      >
        <ul>
          <li><a href="#home" onClick={() => scrollToSection('home')}>Inicio</a></li>
          <li><a href="#about" onClick={() => scrollToSection('about')}>Nosotros</a></li>
          <li><a href="#products" onClick={() => scrollToSection('products')}>Productos</a></li>
          <li><a href="#clients" onClick={() => scrollToSection('clients')}>Clientes</a></li>
          <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonios</a></li>
          <li><a href="#faq" onClick={() => scrollToSection('faq')}>FAQ</a></li>
          <li><a href="#contact" onClick={() => scrollToSection('contact')}>Pedidos</a></li>
        </ul>
      </nav>

      <main>
        <section id="home" className="hero">
          <img src="/images/pastas-hero-banner.webp" alt="Bel Mangiare pasta production" className="hero-background" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-centered">
              <h2>Pasta fresca artesanal con sabor casero para tu negocio</h2>
              <p>En Bel Mangiare elaboramos cada día pastas hechas como en casa, con ingredientes seleccionados y recetas tradicionales. Entregamos a comercios, residenciales y restaurantes que valoran el verdadero sabor.</p>

              <div className="hero-actions">
                <div className="hero-cta-row">
                  <button className="cta-button hero-button primary" onClick={() => scrollToSection('contact')}>Solicitá tu presupuesto sin compromiso</button>
                </div>
                <div className="hero-location-row">
                  <div className="hero-location">
                    <span className="location-icon">📍</span>
                    <span>Montevideo, Uruguay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about-modern">
          <div className="container">
            <div className="about-header-modern animate-on-scroll">
              <div className="about-badge-modern animate-item">
                <span className="badge-icon">🍝</span>
                <span>Más de 15 años elaborando</span>
              </div>
              <h2 className="animate-item">¿Quiénes somos?</h2>
              <p className="about-subtitle-modern animate-item">Una familia dedicada a la pasta artesanal de calidad</p>
            </div>
            
            <div className="about-content-modern">
              <div className="about-image-section animate-on-scroll animate-item">
                <div className="about-image-container-modern">
                  <img src="/images/fabricasdepastas.jpg" alt="Fábrica Bel Mangiare" />
                  <div className="image-overlay-modern">
                    <div className="overlay-content-modern">
                      <h4>15+ años</h4>
                      <p>Elaborando pasta artesanal con tradición familiar</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="about-text-modern">
                <div className="about-story-modern animate-on-scroll">
                  <div className="story-item-modern animate-item">
                    <div className="story-number">01</div>
                    <div className="story-content-modern">
                      <h3>Nuestro propósito</h3>
                      <p>
                        En Bel Mangiare abrimos nuestras puertas hace más de 15 años con un único propósito: elaborar pastas frescas artesanales con la misma dedicación que en casa, pero pensadas para negocios que necesitan volumen, calidad y cumplimiento.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">02</div>
                    <div className="story-content-modern">
                      <h3>Tradición familiar</h3>
                      <p>
                        Fundado por una familia con vocación por la gastronomía, Bel Mangiare nació como una fábrica con alma de cocina familiar. Creemos que el sabor casero no debería perderse, incluso cuando se produce en escala.
                      </p>
                    </div>
                  </div>
                  
                  <div className="story-item-modern animate-item">
                    <div className="story-number">03</div>
                    <div className="story-content-modern">
                      <h3>Compromiso comercial</h3>
                      <p>
                        Nos especializamos en la venta al por mayor, atendiendo a diversos tipos de negocios. Nuestra fábrica está equipada para responder con agilidad y cumplimiento, manteniendo el corazón de una cocina familiar.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="about-quote-modern animate-on-scroll animate-item">
                  <div className="quote-icon">“</div>
                  <blockquote>
                    Comer bien es nuestro nombre. Y también nuestra misión. Después de más de 15 años, seguimos elaborando con la misma pasión: pasta fresca como en casa, pero para tu negocio.
                  </blockquote>
                </div>
                
                <div className="about-actions-modern animate-on-scroll animate-item">
                  <button className="cta-button primary" onClick={() => scrollToSection('contact')}>Solicitá tu cotización</button>
                  <button className="cta-button secondary" onClick={() => scrollToSection('products')}>Ver productos</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="facilities">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Nuestros productos</h2>
            <p className="facilities-intro animate-on-scroll animate-item">Elaboramos pasta fresca todos los días, con materia prima de primera y recetas italianas que combinan tradición con el paladar local. Nuestras opciones más solicitadas por comercios y restaurantes:</p>
            <div className="facilities-features animate-on-scroll">
              <div className="feature-item animate-item">
                <span className="feature-icon">🥟</span>
                <span>Ñoquis de papa (tradicionales o rellenos)</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🥟</span>
                <span>Ravioles: verdura, ricota, carne, jamón y queso</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🍜</span>
                <span>Tallarines y cintas</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🧀</span>
                <span>Sorrentinos: jamón y queso, panceta y queso, caprese</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">🌿</span>
                <span>Opciones integrales o sin sal (bajo pedido)</span>
              </div>
              <div className="feature-item animate-item">
                <span className="feature-icon">📦</span>
                <span>Pasta cocida al vacío, ideal para residenciales</span>
              </div>
            </div>
            <div className="gallery-grid animate-on-scroll">
              {productImages.map((image, index) => (
                <div key={index} className="gallery-item animate-item" onClick={() => openModal(index)}>
                  <img src={image.src} alt={image.alt} />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-note animate-on-scroll animate-item">
              <p><em>Cada bocado tiene historia, textura y sabor real. También desarrollamos recetas personalizadas para clientes frecuentes.</em></p>
            </div>
          </div>
        </section>

        <section id="clients" className="services">
          <div className="container">
            <div className="services-content">
              <div className="services-text animate-on-scroll">
                <h2 className="animate-item">¿A quiénes vendemos?</h2>
                <p className="services-intro animate-item">Aunque somos una fábrica, nuestro espíritu sigue siendo casero. Nos especializamos en venta al por mayor, brindando calidad y cumplimiento a diferentes tipos de negocios:</p>
                <ul>
                  <li><span className="service-icon">🏥</span> Residenciales y hogares de adultos mayores</li>
                  <li><span className="service-icon">👥</span> Consumidor final</li>
                  <li><span className="service-icon">🍽️</span> Restaurantes y rotiserías</li>
                  <li><span className="service-icon">🛒</span> Almacenes y supermercados</li>
                  <li><span className="service-icon">🧊</span> Tiendas de congelados y productos gourmet</li>
                  <li><span className="service-icon">🚛</span> Distribuidores y revendedores</li>
                </ul>
                <p className="services-quote">"Nuestros clientes eligen Bel Mangiare porque saben que el sabor, la textura y la presentación importan. Proveemos a negocios, pero cocinamos como si fuera para nuestra familia."</p>
              </div>
              <div className="services-image">
                <img src="/images/pastas-maquina.jpg" alt="Producción de pastas" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Testimonios</h2>
            <div className="testimonials-grid animate-on-scroll">
              <div className="testimonial-item animate-item">
                <p>"Las pastas de Bel Mangiare son exactamente lo que buscábamos: sabor casero y calidad constante. Nuestros huéspedes siempre quedan satisfechos."</p>
                <cite>— Carmen, Directora de Residencial San José</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"Trabajamos con Bel Mangiare hace 3 años. Su cumplimiento en entrega y la frescura de sus productos nos permite confiar completamente."</p>
                <cite>— Roberto, Dueño de Restaurante Il Forno</cite>
              </div>
              <div className="testimonial-item animate-item">
                <p>"La diferencia se nota en cada bocado. Los ravioles y ñoquis tienen esa textura y sabor que solo se logra con experiencia artesanal."</p>
                <cite>— Lucía, Distribuidora Gourmet</cite>
              </div>
            </div>
          </div>
        </section>

        <section className="why-choose-us">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">¿Por qué elegirnos?</h2>
            <h3 className="animate-on-scroll animate-item">Por qué elegir Bel Mangiare</h3>
            <div className="benefits-grid animate-on-scroll">
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Producción artesanal con maquinaria adaptada</span>
              </div>
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Sabor casero garantizado</span>
              </div>
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Ingredientes frescos y de alta calidad</span>
              </div>
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Cumplimiento en tiempo y forma</span>
              </div>
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Atención personalizada y directa</span>
              </div>
              <div className="benefit-item animate-item">
                <span className="benefit-icon">✅</span>
                <span>Pedidos flexibles y sin complicaciones</span>
              </div>
            </div>
            <p className="tagline">"Proveemos a negocios, pero cocinamos como si fuera para nuestra familia."</p>
          </div>
        </section>

        <section id="faq" className="faq">
          <div className="container">
            <h2 className="animate-on-scroll animate-item">Preguntas frecuentes</h2>
            <div className="faq-content animate-on-scroll">
              <div className="faq-text">
                <div className="faq-item animate-item">
                  <h3>¿Venden al público particular?</h3>
                  <p>Sí. Puedes encontrarnos en Montevideo, José Serrato 3647 o enviar un mensaje al WhatsApp, si estás en nuestra zona de envíos podemos enviártelo a tu hogar.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Tienen mínimo de pedido?</h3>
                  <p>Sí, pero adaptamos según zona y frecuencia. Consultá sin compromiso.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Puedo elegir el tipo de relleno o tamaño?</h3>
                  <p>Sí, producimos recetas personalizadas para clientes frecuentes.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Tienen precios online?</h3>
                  <p>No. Cotizamos según volumen y destino. Enviamos propuesta detallada por WhatsApp o mail.</p>
                </div>
                <div className="faq-item animate-item">
                  <h3>¿Cuál es el proceso de pedido?</h3>
                  <p>Contactános por WhatsApp o formulario, definimos productos y cantidades, acordamos entrega y facturación. Simple y directo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-background">
            <img src="/images/pastas-varias-img.jpg" alt="Contact Background" className="contact-bg-image" />
            <div className="contact-overlay"></div>
          </div>
          <div className="container">
            <div className="contact-header animate-on-scroll">
              <h2 className="animate-item">¿Querés sumar pastas artesanales de verdad a tu negocio?</h2>
              <p className="contact-intro animate-item">Contactános y te enviamos una propuesta clara, rápida y adaptada a tus necesidades.</p>
            </div>
            
            <div className="contact-content-centered">
              <div className="contact-info-centered animate-on-scroll">
                <div className="contact-info-grid">
                  <div className="contact-item animate-item">
                    <div className="contact-icon">📍</div>
                    <h4>Producción</h4>
                    <p>Montevideo, Uruguay</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">📞</div>
                    <h4>WhatsApp Pedidos</h4>
                    <p>094 xxx xxx</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">🕒</div>
                    <h4>Horarios</h4>
                    <p>Lunes a viernes de 8 a 16 hs</p>
                  </div>
                  
                  <div className="contact-item animate-item">
                    <div className="contact-icon">✉️</div>
                    <h4>Email</h4>
                    <p>ventas@belmangiare.com</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-centered">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3>Solicitá tu cotización</h3>
                  
                  {submitStatus === 'success' && (
                    <div className="form-message success">
                      <span>✅ ¡Gracias! Tu solicitud fue enviada exitosamente. Te enviaremos una cotización personalizada pronto.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="form-message error">
                      <span>❌ Hubo un error al enviar tu solicitud. Por favor, intentá nuevamente.</span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Nombre del contacto" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="businessName"
                      placeholder="Nombre del negocio/empresa" 
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Tipo de negocio</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="residencial">Residencial/Hogar</option>
                      <option value="almacen">Almacén/Supermercado</option>
                      <option value="rotiseria">Rotisería</option>
                      <option value="distribuidor">Distribuidor</option>
                      <option value="gourmet">Tienda Gourmet</option>
                      <option value="particular">Consumidor Final</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Teléfono/WhatsApp" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      name="message"
                      placeholder="Cuéntanos sobre tu negocio y qué productos te interesan..." 
                      rows="5" 
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span>Enviando...</span>
                        <span className="btn-icon">⏳</span>
                      </>
                    ) : (
                      <>
                        <span>Solicitá cotización</span>
                        <span className="btn-icon">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Bel Mangiare</h3>
              <p>📍 Producción: Montevideo</p>
              <p>📞 WhatsApp: 094 xxx xxx</p>
              <p>🕒 Lunes a viernes de 8 a 16 hs</p>
            </div>
            <div className="footer-contact">
              <p>&copy; 2024 Bel Mangiare. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <button className="modal-nav modal-prev" onClick={prevImage}>‹</button>
            <button className="modal-nav modal-next" onClick={nextImage}>›</button>
            <div className="modal-image-container">
              <img 
                src={productImages[currentImageIndex].src} 
                alt={productImages[currentImageIndex].alt} 
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <span className="modal-counter">
                {currentImageIndex + 1} / {productImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;