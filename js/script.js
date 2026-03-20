// Smooth scroll navigation highlight
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

// Scroll reveal animation (optional enhancement)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.portfolio-item, .shop-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease';
  observer.observe(el);
});
