const items = document.querySelectorAll('.grid > div');

const hoverTexts = [
  "Collaboration", "Collaboration", "Sponsor",
  "Child project", "Friendly Project", "Sponsor",
  "Friendly Project", "Sponsor", "Friendly Project",
  "Friendly Project", "Child project", "Friendly Project"
];

items.forEach((item, index) => {
  item.dataset.original = item.textContent;
  item.dataset.hover = hoverTexts[index];
  
  const textContainer = document.createElement('span');
  textContainer.textContent = item.textContent;
  textContainer.style.transition = 'opacity 0.3s ease';
  textContainer.style.display = 'block';
  textContainer.style.width = '100%';
  textContainer.style.textAlign = 'center';
  
  item.innerHTML = '';
  item.appendChild(textContainer);
  
  item.addEventListener('mouseenter', () => {
    textContainer.style.opacity = '0';
    setTimeout(() => {
      if (item.matches(':hover')) {
        textContainer.textContent = item.dataset.hover;
        textContainer.style.opacity = '1';
      }
    }, 150);
  });

  item.addEventListener('mouseleave', () => {
    textContainer.style.opacity = '0';
    setTimeout(() => {
      if (!item.matches(':hover')) {
        textContainer.textContent = item.dataset.original;
        textContainer.style.opacity = '1';
      }
    }, 150);
  });
});

document.querySelector('.yakor').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const accountBtn = document.getElementById('accountBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const authForm = document.querySelector('.auth-form');

accountBtn.addEventListener('click', () => {
  authModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  authModal.classList.remove('active');
});

authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.remove('active');
  }
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  console.log('Login attempt:', { email, password });
  authModal.classList.remove('active');
  authForm.reset();
});

document.getElementById('toggleSignup').addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Toggle to sign up');
});

const aboutUsLink = document.getElementById('aboutUsLink');
const aboutModal = document.getElementById('aboutModal');
const closeAboutModal = document.getElementById('closeAboutModal');

aboutUsLink.addEventListener('click', (e) => {
  e.preventDefault();
  aboutModal.classList.add('active');
});

closeAboutModal.addEventListener('click', () => {
  aboutModal.classList.remove('active');
});

aboutModal.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    aboutModal.classList.remove('active');
  }
});

const faqLink = document.getElementById('faqLink');
const faqModal = document.getElementById('faqModal');
const closeFaqModal = document.getElementById('closeFaqModal');
const faqHeaders = document.querySelectorAll('.faq-header');

faqLink.addEventListener('click', (e) => {
  e.preventDefault();
  faqModal.classList.add('active');
});

closeFaqModal.addEventListener('click', () => {
  faqModal.classList.remove('active');
});

faqModal.addEventListener('click', (e) => {
  if (e.target === faqModal) {
    faqModal.classList.remove('active');
  }
});

faqHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const faqItem = header.parentElement;
    document.querySelectorAll('.faq-item').forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });
    faqItem.classList.toggle('active');
  });
});

const supportLink = document.getElementById('supportLink');
const supportModal = document.getElementById('supportModal');
const closeSupportModal = document.getElementById('closeSupportModal');
const supportForm = document.querySelector('.support-form');

if (supportLink) {
  supportLink.addEventListener('click', (e) => {
    e.preventDefault();
    supportModal.classList.add('active');
  });
}

if (closeSupportModal) {
  closeSupportModal.addEventListener('click', () => {
    supportModal.classList.remove('active');
  });
}

if (supportModal) {
  supportModal.addEventListener('click', (e) => {
    if (e.target === supportModal) {
      supportModal.classList.remove('active');
    }
  });
}

if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('supportEmail').value;
    const message = document.getElementById('supportMessage').value;
    if (!email || !message) {
      alert('Please fill in email and message.');
      return;
    }
    console.log('Support request:', { email, message });
    supportForm.classList.add('submitted');
    supportModal.classList.remove('active');
    supportForm.reset();
    setTimeout(() => {
      supportForm.classList.remove('submitted');
    }, 900);
    setTimeout(() => alert('Сообщение отправлено. Мы ответим на почту.'), 200);
  });
}

const donateLink = document.getElementById('donateLink');
const donateModal = document.getElementById('donateModal');
const closeDonateModal = document.getElementById('closeDonateModal');
const donateHeaders = document.querySelectorAll('.donate-header');

if (donateLink) {
  donateLink.addEventListener('click', (e) => {
    e.preventDefault();
    donateModal.classList.add('active');
  });
}

if (closeDonateModal) {
  closeDonateModal.addEventListener('click', () => {
    donateModal.classList.remove('active');
  });
}

if (donateModal) {
  donateModal.addEventListener('click', (e) => {
    if (e.target === donateModal) {
      donateModal.classList.remove('active');
    }
  });
}

if (donateHeaders) {
  donateHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      document.querySelectorAll('.donate-item').forEach((it) => {
        if (it !== item) it.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });
}

const telegramLink = document.getElementById('telegramLink');
const telegramModal = document.getElementById('telegramModal');
const closeTelegramModal = document.getElementById('closeTelegramModal');

if (telegramLink) {
  telegramLink.addEventListener('click', (e) => {
    e.preventDefault();
    telegramModal.classList.add('active');
  });
}

if (closeTelegramModal) {
  closeTelegramModal.addEventListener('click', () => {
    telegramModal.classList.remove('active');
  });
}

if (telegramModal) {
  telegramModal.addEventListener('click', (e) => {
    if (e.target === telegramModal) {
      telegramModal.classList.remove('active');
    }
  });
}

function showCopyNotice(x, y) {
  const notice = document.createElement('div');
  notice.className = 'copy-notice show';
  notice.textContent = 'Copied';
  notice.style.position = 'fixed';
  notice.style.left = x + 'px';
  notice.style.top = y + 'px';
  document.body.appendChild(notice);
  setTimeout(() => {
    notice.classList.remove('show');
    setTimeout(() => notice.remove(), 300);
  }, 900);
}

document.querySelectorAll('.donate-list li').forEach((li) => {
  li.style.cursor = 'pointer';
  li.addEventListener('click', (e) => {
    const text = li.textContent.trim();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const rect = li.getBoundingClientRect();
      showCopyNotice(rect.left + rect.width / 2, rect.top);
    }).catch((err) => {
      console.error('copy failed', err);
    });
  });
});