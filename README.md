# 📌 Project Status / Статус проекта

---

# 🇷🇺 Русская версия

## 📌 Статус проекта

Проект находится в стадии **активной разработки**.  
Последние изменения можно посмотреть в **последнем коммите репозитория**.

---

## ⚠️ Текущие задачи / Требуется исправить

- Исправить работу **Login формы** *(на данный момент не работает)*.
- Исправить проблему с **аватаром при длинном никнейме** *(аватар сжимается)*.
- Исправить **анимацию `title`**:
  - текущая минимальная длина — **2 символа**
  - планируется увеличить до **4 символов**
- Добавить **анимации**:
  - при загрузке страницы
  - при появлении модальных окон
- Привести **все кнопки сайта** к **двум глобальным вариантам** *(единая система кнопок)*.
- Доработать **текстовый блок** *(по стилистике)*.
- Доработать **grid систему**:
  - стилистика
  - медиа-запросы
- Доработать **все ссылки в footer**.

---

## 🚧 Планируемые функции

### 🔐 Авторизация и безопасность

- Добавить **авторизацию по номеру телефона**.
- Реализовать **восстановление пароля**:
  - через **email**
  - через **OAuth (Google API)**
  - через **форму обращения в техподдержку**
- Добавить **систему ролей**  
  *(заготовка уже существует, планируется выдача ролей через подобие консоли)*.
- Реализовать **изоляцию пользовательского пространства**, чтобы:
  - данные форм
  - сообщения чата
  - пользовательская информация  
  были доступны **только владельцу аккаунта**.

---

### 👤 Личный кабинет

- Реализовать **полноценные разделы личного кабинета**.

---

### 🛒 Магазин

- Добавить **корзину**.
- Реализовать **форму добавления товара в корзину** *(с выбором размеров)*.
- Реализовать **форму покупки**, включающую:
  - контактные данные
  - **Map API**
  - пункты выдачи **СДЭК**.

---

### 💬 Коммуникация

- Добавить **чат с поддержкой**:
  - **чат-бот**
  - **консультант**
  - полноценный **CRUD цикл сообщений**.

---

### 🧩 Интерфейс

- Добавить **блок галереи** *(концепция пока не структурирована)*.
- Перенести часть **интерактивных компонентов на React** *(по мере возможности)*.
- Добавить **TailwindCSS** *(по мере возможности)*.

---

### ⚙️ Backend и инфраструктура

- Добавить **нормальную валидацию форм и обработку ошибок**  
  *(global error handler)*.
- Добавить **Node.js backend** *(если позволит архитектура проекта)*.
- Интегрировать **Cloudinary** для хранения медиа.

---

---

# 🇬🇧 English Version

## 📌 Project Status

The project is currently **under active development**.  
You can check the **latest commit** to see the most recent changes.

---

## ⚠️ Current Issues / TODO

- Fix the **Login form** *(currently not working)*.
- Fix the **avatar issue with long usernames** *(avatar becomes compressed)*.
- Fix the **`title` animation**:
  - current minimum length — **2 characters**
  - planned minimum length — **4 characters**
- Add **animations**:
  - page loading animation
  - modal/window appearance animations
- Standardize **all buttons** on the website into **two global button variants**.
- Improve the **text block styling**.
- Improve the **grid system**:
  - styling
  - media queries
- Fix and complete **all footer links**.

---

## 🚧 Planned Features

### 🔐 Authentication & Security

- Add **phone number authentication**.
- Implement **password recovery**:
  - via **email**
  - via **OAuth (Google API)**
  - via **support request form**
- Implement a **user roles system**  
  *(a draft already exists, roles will likely be assignable via a console-like interface)*.
- Implement **user space isolation**, ensuring that:
  - form data
  - chat messages
  - user information  
  are accessible **only to the corresponding user**.

---

### 👤 User Dashboard

- Implement **fully functional user dashboard sections**.

---

### 🛒 Store Features

- Add a **shopping cart**.
- Implement a **product-to-cart form** *(with size selection)*.
- Implement a **checkout form**, including:
  - contact information
  - **Map API integration**
  - **CDEK pickup points**.

---

### 💬 Communication

- Add a **support chat system**:
  - **chatbot**
  - **human consultant**
  - full **CRUD message cycle**.

---

### 🧩 Interface Improvements

- Add a **gallery section** *(concept still under development)*.
- Gradually migrate some **interactive components to React**.
- Add **TailwindCSS** when possible.

---

### ⚙️ Backend & Infrastructure

- Implement **proper validation and error handling** *(global error handler)*.
- Add a **Node.js backend** *(if the project architecture allows it)*.
- Integrate **Cloudinary** for media storage.
