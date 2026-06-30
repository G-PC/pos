// ========== ОБЩЕЕ МЕНЮ ДЛЯ ВСЕЙ СИСТЕМЫ ==========
const DEFAULT_MENU = [
    { id: 1, name: 'Борщ', price: 250, category: 'Супы', emoji: '🍲' },
    { id: 2, name: 'Стейк', price: 300, category: 'Мясные изделия', emoji: '🥩' },
    { id: 3, name: 'Паста', price: 250, category: 'Гарниры', emoji: '🍝' },
    { id: 4, name: 'Чай', price: 100, category: 'Напитки', emoji: '🍵' },
    { id: 5, name: 'Кофе', price: 130, category: 'Напитки', emoji: '☕' },
    { id: 6, name: 'Сырники', price: 75, category: 'Десерты', emoji: '🧀' },
    { id: 7, name: 'Фруктовый салат', price: 200, category: 'Салаты', emoji: '🥗' },
    { id: 8, name: 'Овощной салат', price: 200, category: 'Салаты', emoji: '🥗' },
    { id: 9, name: 'Горячий шоколад', price: 130, category: 'Напитки', emoji: '🍫' },
    { id: 10, name: 'Чай с молоком', price: 130, category: 'Напитки', emoji: '🍵' },
    { id: 11, name: 'Какао', price: 130, category: 'Напитки', emoji: '☕' },
    { id: 12, name: 'Пончик', price: 50, category: 'Десерты', emoji: '🍩' },
    { id: 13, name: 'Круассан', price: 50, category: 'Десерты', emoji: '🥐' },
    { id: 14, name: 'Кекс "Шарлотка"', price: 70, category: 'Десерты', emoji: '🍰' },
    { id: 15, name: 'Сосиска', price: 80, category: 'Мясные изделия', emoji: '🌭' },
    { id: 16, name: 'Яичница "Глазунья"', price: 85, category: 'Другое', emoji: '🍳' },
    { id: 17, name: 'Плов', price: 275, category: 'Гарниры', emoji: '🍚' },
    { id: 18, name: 'Морс', price: 70, category: 'Напитки', emoji: '🍹' },
    { id: 19, name: 'Лимонад', price: 70, category: 'Напитки', emoji: '🥤' },
    { id: 20, name: 'Картофель фри', price: 90, category: 'Гарниры', emoji: '🍟' },
    { id: 21, name: 'Картофель по-деревенски', price: 100, category: 'Гарниры', emoji: '🥔' },
    { id: 22, name: 'Грибной суп', price: 220, category: 'Супы', emoji: '🍄' },
    { id: 23, name: 'Картофельное пюре', price: 100, category: 'Гарниры', emoji: '🥔' },
    { id: 24, name: 'Суп-пюре', price: 220, category: 'Супы', emoji: '🍲' },
    { id: 25, name: 'Бургер', price: 90, category: 'Мясные изделия', emoji: '🍔' },
    { id: 26, name: 'Нагетсы', price: 90, category: 'Мясные изделия', emoji: '🍗' },
    { id: 27, name: 'Сырные нагетсы', price: 100, category: 'Мясные изделия', emoji: '🧀' },
    { id: 28, name: 'Хлеб', price: 35, category: 'Выпечка', emoji: '🍞' },
    { id: 29, name: 'Лепешка', price: 50, category: 'Выпечка', emoji: '🥙' }
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

// ========== ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ ==========
function forceUpdateMenu() {
    const defaultMenu = getDefaultMenu();
    const data = localStorage.getItem('cloudData');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            parsed.menu = defaultMenu;
            localStorage.setItem('cloudData', JSON.stringify(parsed));
            console.log('✅ Меню принудительно обновлено! Блюд:', defaultMenu.length);
            return true;
        } catch (e) {}
    }
    return false;
}

forceUpdateMenu();

console.log('📦 menu.js загружен!');
console.log('🍽️ Блюд в меню:', DEFAULT_MENU.length);
console.log('📋 Первое блюдо:', DEFAULT_MENU[0].name);
console.log('📋 Последнее блюдо:', DEFAULT_MENU[DEFAULT_MENU.length - 1].name);
