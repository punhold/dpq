import { productsData } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categoryTabs = document.getElementById('categoryTabs');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const currentYearSpan = document.getElementById('currentYear');
  
  // Modal Elements
  const productModal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalBody = document.getElementById('modalBody');

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  const btnWhatsappDirect = document.getElementById('btnWhatsappDirect');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  // Set Current Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Initial Product Render
  renderProducts();

  // Category Tab Click Handler
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-filter');
        renderProducts();
      }
    });
  }

  // Global function for category triggers
  window.filterCategory = function(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('data-filter') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderProducts();
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (currentSearchQuery.length > 0) {
        clearSearchBtn.style.display = 'block';
      } else {
        clearSearchBtn.style.display = 'none';
      }
      renderProducts();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderProducts();
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking nav links
    mainNav.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        mainNav.classList.remove('active');
      }
    });
  }

  // Render Function
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = productsData.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchesSearch = currentSearchQuery === '' ||
        item.name.toLowerCase().includes(currentSearchQuery) ||
        item.code.toLowerCase().includes(currentSearchQuery) ||
        item.tagline.toLowerCase().includes(currentSearchQuery) ||
        item.uses.toLowerCase().includes(currentSearchQuery) ||
        item.dilutions.toLowerCase().includes(currentSearchQuery) ||
        item.badges.some(b => b.toLowerCase().includes(currentSearchQuery));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;" class="no-results">
          <i class="fa-solid fa-flask-vial" style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No se encontraron productos</h3>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">
            No hallamos resultados para "${currentSearchQuery}". Puede consultarnos directamente por productos especiales.
          </p>
          <a href="#contacto" class="btn btn-primary btn-sm">Consultar por Producto Personalizado</a>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(item => `
      <div class="product-card" data-id="${item.id}">
        <div class="product-header">
          <div class="product-icon">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <span class="product-category-tag">${item.categoryName}</span>
        </div>

        <h3 class="product-title">${item.name}</h3>
        <p class="product-tagline">${item.tagline}</p>

        <div class="product-body">
          <div class="detail-block">
            <strong><i class="fa-solid fa-bullseye"></i> Usos Principales:</strong>
            <p>${item.uses}</p>
          </div>

          <div class="detail-block">
            <strong><i class="fa-solid fa-droplet"></i> Dilución Sugerida:</strong>
            <p>${item.dilutions}</p>
          </div>

          <div class="badges-row">
            ${item.badges.map(b => `<span class="product-badge">${b}</span>`).join('')}
          </div>
        </div>

        <div class="product-footer">
          <button class="btn btn-glass btn-sm btn-block btn-details" data-id="${item.id}">
            <i class="fa-solid fa-circle-info"></i> Ficha & Consulta
          </button>
          <a href="https://wa.me/5493548588580?text=${encodeURIComponent(`Hola dpq, quisiera consultar disponibilidad y cotización del producto: ${item.name} (${item.tagline})`)}" 
             target="_blank" 
             class="btn btn-whatsapp btn-sm" 
             title="Consultar por WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    `).join('');

    // Attach Event Listeners to Detail Buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        openProductModal(prodId);
      });
    });
  }

  // Open Product Modal
  function openProductModal(prodId) {
    const product = productsData.find(p => p.id === prodId);
    if (!product || !modalBody) return;

    const waMsg = encodeURIComponent(`Hola dpq, quisiera asesoramiento técnico y presupuesto por el producto ${product.name} (${product.tagline}).`);

    modalBody.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
        <div class="product-icon" style="width: 54px; height: 54px; font-size: 1.5rem;">
          <i class="fa-solid ${product.icon}"></i>
        </div>
        <div>
          <span class="product-category-tag">${product.categoryName}</span>
          <h2 style="font-size: 1.75rem; margin-top: 0.2rem; color: #ffffff;">${product.name}</h2>
        </div>
      </div>

      <p style="font-size: 1.05rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 1.5rem;">
        ${product.tagline}
      </p>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.95rem; color: #ffffff; margin-bottom: 0.5rem;">
          <i class="fa-solid fa-circle-check text-green"></i> Recomendaciones de Uso:
        </h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${product.uses}
        </p>

        <h4 style="font-size: 0.95rem; color: #ffffff; margin-bottom: 0.5rem;">
          <i class="fa-solid fa-flask text-gradient"></i> Dosificación y Dilución Técnica:
        </h4>
        <p style="font-size: 0.9rem; color: var(--text-muted);">
          ${product.dilutions}
        </p>
      </div>

      <div class="badges-row" style="margin-bottom: 2rem;">
        ${product.badges.map(b => `<span class="product-badge" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">${b}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="https://wa.me/5493548588580?text=${waMsg}" target="_blank" class="btn btn-whatsapp btn-block" style="flex: 1;">
          <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
        </a>
        <a href="#contacto" class="btn btn-primary btn-block" style="flex: 1;" onclick="document.getElementById('productModal').classList.remove('active');">
          <i class="fa-solid fa-paper-plane"></i> Enviar Consulta
        </a>
      </div>
    `;

    productModal.classList.add('active');
  }

  // Close Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      productModal.classList.remove('active');
    });
  }

  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        productModal.classList.remove('active');
      }
    });
  }

  // Contact Form Submission (Behind the scenes to cfm2505@hotmail.com)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const product = document.getElementById('formProduct').value;
      const message = document.getElementById('formMessage').value.trim();

      const targetEmail = 'cfm2505@hotmail.com';
      const subject = encodeURIComponent(`Consulta Web dpq - ${name}`);
      const body = encodeURIComponent(
        `Nombre / Empresa: ${name}\n` +
        `Teléfono: ${phone}\n` +
        `Correo: ${email}\n` +
        `Producto de Interés: ${product}\n\n` +
        `Mensaje:\n${message}`
      );

      // Trigger mailto link behind the scenes to cfm2505@hotmail.com
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

      alert('¡Gracias por su consulta! Se abrirá su aplicación de correo para confirmar el envío.');
    });
  }

  // Direct WhatsApp Button in Contact Section
  if (btnWhatsappDirect) {
    btnWhatsappDirect.addEventListener('click', () => {
      const name = document.getElementById('formName').value.trim();
      const product = document.getElementById('formProduct').value;
      const message = document.getElementById('formMessage').value.trim();

      let text = `Hola dpq, soy ${name || 'un cliente'}.`;
      if (product && product !== 'general') text += ` Me interesa el producto: ${product}.`;
      if (message) text += ` Consulta: ${message}`;

      window.open(`https://wa.me/5493548588580?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Header Scroll Effect & Dynamic Nav Link Scroll Spy
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY;

    // Header glassmorphism shadow toggle
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy section detector
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (!currentSectionId && scrollY < 200) {
      currentSectionId = 'inicio';
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // Click handler for nav links for instant active feedback
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();
});
