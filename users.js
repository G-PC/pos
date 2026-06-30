// ========== ОБЩИЕ ПОЛЬЗОВАТЕЛИ ДЛЯ ВСЕЙ СИСТЕМЫ ==========
const DEFAULT_USERS = {
    'sadmin': { password: '123', role: 'sadmin', name: 'Владелец' },
    'multi': { password: '123', role: 'Повар+Официант', name: 'Повар+Официант' },
    'waiter': { password: '123', role: 'Официант', name: 'Официант' },
    'kitchen': { password: '123', role: 'Повар', name: 'Повар' },
    'german': { password: '123', role: 'sadmin', name: 'Герман' },
    'taya': { password: '123', role: 'Повар+Официант', name: 'Таисия' }
};

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ ==========
function getDefaultUsers() {
    return JSON.parse(JSON.stringify(DEFAULT_USERS));
}

function loadUsersFromStorage() {
    const data = localStorage.getItem('cloudData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (parsed.users && Object.keys(parsed.users).length > 0) {
                return parsed.users;
            }
        } catch (e) {}
    }
    const defaultUsers = getDefaultUsers();
    const fullData = {
        venueName: 'Кафе Уют',
        menu: [],
        users: defaultUsers,
        tables: { '1': { orders: [], total: 0 }, '2': { orders: [], total: 0 }, '3': { orders: [], total: 0 } },
        stats: { totalOrders: 0, totalRevenue: 0 }
    };
    localStorage.setItem('cloudData', JSON.stringify(fullData));
    return defaultUsers;
}

function saveUsersToStorage(users) {
    const data = localStorage.getItem('cloudData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            parsed.users = users;
            localStorage.setItem('cloudData', JSON.stringify(parsed));
            return true;
        } catch (e) {}
    }
    return false;
}

function getUsers() {
    return loadUsersFromStorage();
}

function saveUsers(users) {
    return saveUsersToStorage(users);
}

console.log('👥 users.js загружен!');
console.log('👤 Пользователей:', Object.keys(DEFAULT_USERS).length);
console.log('📋 Список:', Object.keys(DEFAULT_USERS).join(', '));
