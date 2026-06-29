// ========== ОБЩЕЕ МЕНЮ ДЛЯ ВСЕЙ СИСТЕМЫ ==========
const DEFAULT_MENU = [
    { id: 1, name: 'Борщ', price: 250, category: 'Супы', emoji: '🍲' },
    { id: 2, name: 'Стейк', price: 450, category: 'Горячее', emoji: '🥩' },
    { id: 3, name: 'Паста', price: 390, category: 'Горячее', emoji: '🍝' },
    { id: 4, name: 'Чай', price: 100, category: 'Напитки', emoji: '🍵' },
    { id: 5, name: 'Кофе', price: 150, category: 'Напитки', emoji: '☕' },
    { id: 6, name: 'Сырники', price: 75, category: 'Десерты', emoji: '🧀' },
    { id: 7, name: 'Фруктовый салат', price: 250, category: 'Салаты', emoji: '🥗' },
    { id: 8, name: 'Овощной салат', price: 200, category: 'Салаты', emoji: '🥗' },
    { id: 9, name: 'Горячий шоколад', price: 130, category: 'Напитки', emoji: '🍫' },
    { id: 10, name: 'Чай с молоком', price: 130, category: 'Напитки', emoji: '🍵' },
    { id: 11, name: 'Какао', price: 130, category: 'Напитки', emoji: '☕' },
    { id: 12, name: 'Пончик', price: 50, category: 'Десерты', emoji: '🍩' },
    { id: 13, name: 'Круассан', price: 50, category: 'Десерты', emoji: '🥐' },
    { id: 14, name: 'Шарлотка', price: 70, category: 'Десерты', emoji: '🍰' }
];

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С МЕНЮ ==========
function getDefaultMenu() {
    return JSON.parse(JSON.stringify(DEFAULT_MENU));
}

function loadMenuFromStorage() {
    const data = localStorage.getItem('cloudData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (parsed.menu && parsed.menu.length > 0) {
                return parsed.menu;
            }
        } catch (e) {}
    }
    // Если нет — сохраняем дефолтное
    const defaultMenu = getDefaultMenu();
    const fullData = {
        venueName: 'Кафе Уют',
        menu: defaultMenu,
        users: { 'sadmin': { password: '123', role: 'sadmin', name: 'Главный' } },
        tables: { '1': { orders: [], total: 0 }, '2': { orders: [], total: 0 }, '3': { orders: [], total: 0 } },
        stats: { totalOrders: 0, totalRevenue: 0 }
    };
    localStorage.setItem('cloudData', JSON.stringify(fullData));
    return defaultMenu;
}

function saveMenuToStorage(menu) {
    const data = localStorage.getItem('cloudData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            parsed.menu = menu;
            localStorage.setItem('cloudData', JSON.stringify(parsed));
            return true;
        } catch (e) {}
    }
    return false;
}

console.log('📦 menu.js загружен!');
console.log('🍽️ Блюд в меню:', DEFAULT_MENU.length);
