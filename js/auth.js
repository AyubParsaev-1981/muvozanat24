/**
 * «Muvozanat» — Strict Authentication, Authorization & Session Management
 * 
 * Texnik topshiriq talablari:
 * 1. No registration — no access to personal functionality
 * 2. No fake data — only real user data
 * 3. User Data Isolation: Every weight log, diary, scan belongs strictly to user_id
 * 4. Password validation (8+ chars), registration, login, logout, account deletion
 * 5. Automatic purge of legacy demo/hardcoded data (Ayubxon, 93.8kg)
 */

const Auth = {
  SESSION_KEY: 'muvozanat_auth_session',
  USERS_REGISTRY_KEY: 'muvozanat_users_registry',
  CURRENT_USER_DATA_PREFIX: 'muvozanat_userdata_',

  init() {
    this.purgeLegacyDemoData();
    this.ensureAdminAccount();
  },

  // 1. Bir martalik tozalash: barcha eski demo/fake ma'lumotlarni o'chirish (Sections 2, 17, 32)
  purgeLegacyDemoData() {
    try {
      const stateStr = localStorage.getItem('muvozanat_state');
      if (stateStr && (stateStr.includes('Ayubxon') || stateStr.includes('93.8'))) {
        console.log('[Auth] Purging legacy demo data from localStorage...');
        localStorage.removeItem('muvozanat_state');
        localStorage.removeItem('muvozanat_diary_today');
      }
    } catch (e) {}
  },

  // Tizimda kamida 1 ta standart Admin mavjudligini ta'minlash (Section 25)
  ensureAdminAccount() {
    const users = this.getAllUsers();
    if (!users['admin@muvozanat.uz']) {
      users['admin@muvozanat.uz'] = {
        id: 'user_admin_001',
        name: 'Tizim Administratori',
        identifier: 'admin@muvozanat.uz',
        phone: '+998901234567',
        passwordHash: this.hashPassword('Admin123!'),
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
        profile: {
          name: 'Administrator',
          gender: 'male',
          age: 35,
          height: 175,
          currentWeight: null,
          targetWeight: null
        }
      };
      this.saveAllUsers(users);
    }
  },

  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_REGISTRY_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  saveAllUsers(users) {
    localStorage.setItem(this.USERS_REGISTRY_KEY, JSON.stringify(users));
  },

  hashPassword(password) {
    // Client-side simple salt-hash for local persistence demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = ((hash << 5) - hash) + password.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16) + password.length;
  },

  // 2. Session Management (Sections 9, 10, 20)
  getCurrentSession() {
    try {
      const sess = JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
      if (!sess) return null;
      if (new Date(sess.expiresAt) < new Date()) {
        this.logout();
        return null;
      }
      return sess;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentSession() !== null;
  },

  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;

    const users = this.getAllUsers();
    const user = users[session.identifier];
    if (!user) return null;

    // Foydalanuvchining shaxsiy izolyatsiya qilingan ma'lumotlari (Section 11)
    const userStorageKey = this.CURRENT_USER_DATA_PREFIX + user.id;
    let personalData = {};
    try {
      personalData = JSON.parse(localStorage.getItem(userStorageKey) || '{}');
    } catch (e) {}

    return {
      ...user,
      profile: personalData.profile || user.profile || null,
      weightLogs: personalData.weightLogs || [],
      foodDiaryToday: personalData.foodDiaryToday || [],
      waterGlasses: personalData.waterGlasses || 0,
      scans: personalData.scans || []
    };
  },

  // 3. Foydalanuvchi ma'lumotlarini saqlash (Data Isolation per user_id)
  saveCurrentUserData(dataUpdates) {
    const session = this.getCurrentSession();
    if (!session) return;

    const users = this.getAllUsers();
    const user = users[session.identifier];
    if (!user) return;

    const userStorageKey = this.CURRENT_USER_DATA_PREFIX + user.id;
    let personalData = {};
    try {
      personalData = JSON.parse(localStorage.getItem(userStorageKey) || '{}');
    } catch (e) {}

    const updated = { ...personalData, ...dataUpdates };
    localStorage.setItem(userStorageKey, JSON.stringify(updated));

    // Asosiy foydalanuvchi ma'lumotlarini ham yangilash (onboardingCompleted va h.k.)
    if (dataUpdates.profile) {
      user.profile = { ...user.profile, ...dataUpdates.profile };
      if (dataUpdates.onboardingCompleted !== undefined) {
        user.onboardingCompleted = dataUpdates.onboardingCompleted;
      }
      users[session.identifier] = user;
      this.saveAllUsers(users);
    }
  },

  // 4. Ro'yxatdan o'tish (Strict Registration - Sections 4, 5, 6, 7)
  register(name, identifier, password) {
    name = (name || '').trim();
    identifier = (identifier || '').trim().toLowerCase();
    password = (password || '').trim();

    if (!name || name.length < 2) {
      throw new Error("Iltimos, haqiqiy ism-familiyangizni kiriting!");
    }

    if (!identifier) {
      throw new Error("Telefon raqami yoki Email kiritilishi shart!");
    }

    if (password.length < 8) {
      throw new Error("Xavfsizlik talabi: Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
    }

    const users = this.getAllUsers();
    if (users[identifier]) {
      throw new Error("Ushbu telefon raqami yoki email bilan hisob allaqachon mavjud! Iltimos, kiring.");
    }

    const newUserId = 'user_' + Date.now();
    const newUser = {
      id: newUserId,
      name: name,
      identifier: identifier,
      phone: identifier.startsWith('+') || /^\d+$/.test(identifier) ? identifier : '',
      passwordHash: this.hashPassword(password),
      role: 'USER',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false, // Majburiy onboarding (Section 13)
      profile: {
        name: name,
        gender: '',
        age: null,
        height: null,
        currentWeight: null,
        startWeight: null,
        targetWeight: null,
        country: 'Uzbekistan',
        city: '',
        activityLevel: 'medium',
        goal: 'lose'
      }
    };

    users[identifier] = newUser;
    this.saveAllUsers(users);

    // Dastlabki bo'sh shaxsiy ma'lumotlar ombori (Zero fake data - Section 2)
    const userStorageKey = this.CURRENT_USER_DATA_PREFIX + newUserId;
    localStorage.setItem(userStorageKey, JSON.stringify({
      profile: newUser.profile,
      weightLogs: [],
      foodDiaryToday: [],
      waterGlasses: 0,
      scans: []
    }));

    // Avtomatik login va sessiya o'rnatish
    this.setSession(newUser);
    return newUser;
  },

  // 5. Kirish (Login - Sections 8, 9, 10)
  login(identifier, password) {
    identifier = (identifier || '').trim().toLowerCase();
    password = (password || '').trim();

    const users = this.getAllUsers();
    const user = users[identifier];

    // Generic error to prevent user enumeration (Section 8)
    if (!user || user.passwordHash !== this.hashPassword(password)) {
      throw new Error("Kiritilgan telefon/email yoki parol noto'g'ri.");
    }

    this.setSession(user);
    return user;
  },

  setSession(user) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 14); // 14 kunlik xavfsiz sessiya

    const session = {
      userId: user.id,
      identifier: user.identifier,
      name: user.name,
      role: user.role,
      token: 'tok_' + Math.random().toString(36).substring(2) + Date.now(),
      expiresAt: expires.toISOString()
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  },

  // 6. Chiqish (Logout - Section 21)
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.reload();
  },

  // 7. Akkauntni o'chirish (Account Deletion - Section 24)
  deleteAccount() {
    const session = this.getCurrentSession();
    if (!session) return;

    if (!confirm("Diqqat! Hisobingiz va barcha vazn, taomnoma hamda shaxsiy ma'lumotlaringiz butunlay o'chiriladi. Ushbu amalni qaytarib bo'lmaydi.\n\nHaqiqatan ham hisobingizni o'chirmoqchimisiz?")) {
      return;
    }

    const users = this.getAllUsers();
    delete users[session.identifier];
    this.saveAllUsers(users);

    const userStorageKey = this.CURRENT_USER_DATA_PREFIX + session.userId;
    localStorage.removeItem(userStorageKey);
    localStorage.removeItem(this.SESSION_KEY);

    alert("Hisobingiz muvaffaqiyatli o'chirildi.");
    window.location.reload();
  },

  // 8. Telegram ID bilan hisobni bog'lash (Section 27)
  linkTelegramAccount(telegramId) {
    const session = this.getCurrentSession();
    if (!session) return false;

    const users = this.getAllUsers();
    const user = users[session.identifier];
    if (user) {
      user.telegramId = telegramId;
      users[session.identifier] = user;
      this.saveAllUsers(users);
      return true;
    }
    return false;
  }
};

// Dastur yuklanganda initsializatsiya
Auth.init();
