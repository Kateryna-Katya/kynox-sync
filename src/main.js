/* =========================================
   1. ИНИЦИАЛИЗАЦИЯ
   ========================================= */

gsap.registerPlugin(ScrollTrigger);
lucide.createIcons();

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* =========================================
   2. МОБИЛЬНОЕ МЕНЮ
   ========================================= */

const burgerBtn = document.getElementById('burger-btn');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.header__link');
const headerBtn = document.querySelector('.header__btn');

function toggleMenu() {
    burgerBtn.classList.toggle('is-active');
    navMenu.classList.toggle('is-active');
    
    if (navMenu.classList.contains('is-active')) {
        document.body.style.overflow = 'hidden';
        lenis.stop();
    } else {
        document.body.style.overflow = '';
        lenis.start();
    }
}

burgerBtn.addEventListener('click', toggleMenu);

[...navLinks, headerBtn].forEach(el => {
    if(el) {
        el.addEventListener('click', () => {
            if (navMenu.classList.contains('is-active')) toggleMenu();
        });
    }
});

/* =========================================
   3. АНИМАЦИЯ HERO (Входная)
   ========================================= */

const tlHero = gsap.timeline({ defaults: { ease: "power2.out", duration: 1 } });

tlHero.fromTo(".hero__img", 
    { scale: 0.9, opacity: 0, filter: "blur(10px)", y: 20 },
    { scale: 1, opacity: 1, filter: "blur(0px)", y: 0, duration: 1.4, ease: "power3.out" }
)
.to(".hero__title", { y: 0, opacity: 1 }, "-=1.0")
.to(".hero__subtitle", { y: 0, opacity: 1 }, "-=0.8")
.to(".hero__actions", { y: 0, opacity: 1 }, "-=0.8")
.fromTo(".hero__status", { y: -20, opacity: 0 }, { y: 0, opacity: 1 }, "-=1.2");

// Параллакс эффект для картинки
const heroSection = document.getElementById('hero');
const heroImg = document.querySelector('.hero__img');

if (heroSection && heroImg && window.innerWidth > 992) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(heroImg, { x: x, y: y, duration: 1, ease: "power1.out" });
    });
}

/* =========================================
   4. УНИВЕРСАЛЬНАЯ АНИМАЦИЯ СКРОЛЛА
   ========================================= */

// Находим все элементы с атрибутом data-anim
const animatedElements = gsap.utils.toArray('[data-anim]');

animatedElements.forEach(el => {
    // Определяем направление из атрибута (up, left, right)
    const direction = el.getAttribute('data-anim');
    
    let xValue = 0;
    let yValue = 0;

    // Настройка смещения в зависимости от направления
    if (direction === 'up') yValue = 50;
    else if (direction === 'left') xValue = 50; // Приходит справа налево? Нет, обычно fade-left значит "сдвинут влево изначально" или "идет влево".
    // Сделаем логичнее: 
    // data-anim="left" -> Элемент находится справа и едет влево (для правой колонки)
    // data-anim="right" -> Элемент находится слева и едет вправо (для левой колонки)
    
    if (direction === 'left') xValue = 50;  // Стоит правее, едет в 0
    if (direction === 'right') xValue = -50; // Стоит левее, едет в 0

    gsap.fromTo(el, 
        { 
            autoAlpha: 0, // opacity + visibility
            y: yValue, 
            x: xValue 
        },
        { 
            duration: 1, 
            autoAlpha: 1, 
            y: 0, 
            x: 0, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Анимация начнется, когда верх элемента на 85% высоты экрана
                toggleActions: "play none none reverse" // Проиграть один раз, но если скролл вверх - реверс (по желанию можно "play none none none")
            }
        }
    );
});

/* =========================================
   5. ФОРМА КОНТАКТОВ
   ========================================= */

const contactForm = document.getElementById('contact-form');
const phoneInput = document.getElementById('phone');
const formMessage = document.getElementById('form-message');
const captchaInput = document.getElementById('captcha');

// 1. ВАЛИДАЦИЯ ТЕЛЕФОНА (Только цифры)
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Заменяем всё, что не цифра, на пустоту
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// 2. ОТПРАВКА ФОРМЫ
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Проверка капчи (3 + 5 = 8)
        if (captchaInput.value !== '8') {
            formMessage.textContent = 'Ошибка: Неверное решение примера.';
            formMessage.className = 'form-message error';
            return;
        }

        // Имитация отправки
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.textContent = 'Отправка...';
        btn.disabled = true;

        // Таймер AJAX
        setTimeout(() => {
            btn.textContent = 'Отправлено!';
            btn.style.backgroundColor = '#45A29E';
            
            formMessage.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
            formMessage.className = 'form-message success';
            
            contactForm.reset();
            
            // Возврат кнопки через 3 секунды
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                formMessage.textContent = '';
            }, 5000);
        }, 1500);
    });
}