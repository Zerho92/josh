
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      
      if (window.innerWidth <= 768) {
        toggleMenu(e);
      }
    }
  });
});


window.addEventListener('scroll', () => {
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
});

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
});


document.addEventListener('DOMContentLoaded', () => {
  document.body.dataset.theme = localStorage.getItem('theme') || 'light';
});


const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#main-menu');

const toggleMenu = (e) => {
  e?.stopPropagation();
  const isExpanded = navMenu.classList.contains('active');
  
  
  if (!isExpanded) {
    navMenu.style.display = 'flex';
    setTimeout(() => {
      navMenu.classList.add('active');
    }, 10);
  } else {
    navMenu.classList.remove('active');
    setTimeout(() => {
      navMenu.style.display = 'none';
    }, 300);
  }

  
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  menuToggle.textContent = isExpanded ? '☰' : '×';
};


menuToggle?.addEventListener('click', (e) => toggleMenu(e));


document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('active') && 
      !navMenu.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    toggleMenu(e);
  }
});


window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});


document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  clearErrors();

  const form = e.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent;

  
  const fields = {
    name: value => !!value.trim(),
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: value => !!value.trim()
  };

  let isValid = true;
  Object.entries(fields).forEach(([field, validate]) => {
    const value = formData.get(field)?.toString() || '';
    const errorElement = document.getElementById(field)?.parentElement.querySelector('.error-message');
    
    if (!validate(value)) {
      isValid = false;
      showError(field, field === 'email' ? 
        'Ingresa un correo válido' : 'Este campo es obligatorio');
    }
  });

  if (!isValid) return;

  try {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      window.location.href = 'gracias.html';
    } else {
      throw new Error('Error en el servidor');
    }
    
  } catch (error) {
    console.error('Error:', error);
    showError('message', 'Error al enviar. Intenta nuevamente.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});


function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const error = field.parentElement.querySelector('.error-message');
  if (error) {
    field.style.borderColor = '#ff4444';
    error.textContent = message;
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  document.querySelectorAll('input, textarea').forEach(el => {
    el.style.borderColor = '';
  });
}


const lazyLoadImages = () => {
  const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px' });

    lazyImages.forEach(img => {
      if (img.dataset.src) observer.observe(img);
    });
  } else {
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  }
};


document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  
  
  if (typeof lightbox !== 'undefined') {
    lightbox.option({
      'wrapAround': true,
      'albumLabel': "Imagen %1 de %2",
      'positionFromTop': 100,
      'resizeDuration': 200,
      'fadeDuration': 300
    });
  }
});
