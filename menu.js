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
    { id: 10, name: 'Какао', price: 130, category: 'Напитки', emoji: '☕' },
    { id: 11, name: 'Пончик', price: 50, category: 'Десерты', emoji: '🍩' },
    { id: 12, name: 'Круассан', price: 50, category: 'Десерты', emoji: '🥐' },
    { id: 13, name: 'Кекс "Шарлотка"', price: 70, category: 'Десерты', emoji: '🍰' },
    { id: 14, name: 'Сосиска', price: 80, category: 'Мясные изделия', emoji: '🌭' },
    { id: 15, name: 'Яичница "Глазунья"', price: 85, category: 'Другое', emoji: '🍳' },
    { id: 16, name: 'Плов', price: 275, category: 'Гарниры', emoji: '🍚' },
    { id: 17, name: 'Лимонад', price: 70, category: 'Напитки', emoji: '🥤' },
    { id: 18, name: 'Картофель фри', price: 90, category: 'Гарниры', emoji: '🍟' },
    { id: 19, name: 'Картофель по-деревенски', price: 100, category: 'Гарниры', emoji: '🥔' },
    { id: 20, name: 'Грибной суп', price: 220, category: 'Супы', emoji: '🍄' },
    { id: 21, name: 'Картофельное пюре', price: 100, category: 'Гарниры', emoji: '🥔' },
    { id: 22, name: 'Суп-пюре', price: 220, category: 'Супы', emoji: '🍲' },
    { id: 23, name: 'Бургер', price: 90, category: 'Мясные изделия', emoji: '🍔' },
    { id: 24, name: 'Нагетсы', price: 90, category: 'Мясные изделия', emoji: '🍗' },
    { id: 25, name: 'Сырные нагетсы', price: 100, category: 'Мясные изделия', emoji: '🧀' },
    { id: 26, name: 'Хлеб', price: 35, category: 'Выпечка', emoji: '🍞' },
    { id: 27, name: 'Лепешка', price: 50, category: 'Выпечка', emoji: '🥙' },
    { id: 28, name: 'Котлета', price: 120, category: 'Мясные изделия', emoji: '🍖' },
    { id: 29, name: 'Сок', price: 60, category: 'Напитки', emoji: '🧃' },
    { id: 30, name: 'Тортик', price: 80, category: 'Десерты', emoji: '🧁' },
    { id: 31, name: 'Куриный суп с лапшой', price: 190, category: 'Супы', emoji: '🍜' },
    { id: 32, name: 'Уха', price: 210, category: 'Супы', emoji: '🐟' },
    { id: 33, name: 'Пицца', price: 500, category: 'Пицца', emoji: '🍕' },
    { id: 34, name: 'Кусочек пиццы', price: 75, category: 'Пицца', emoji: '🍕' }
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
        users: {
            'sadmin': { password: '123', role: 'sadmin', name: 'Владелец' }
        },
        tables: {
            '1': { orders: [], total: 0 },
            '2': { orders: [], total: 0 },
            '3': { orders: [], total: 0 }
        },
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

function getMenu() {
    return loadMenuFromStorage();
}

function saveMenu(menu) {
    return saveMenuToStorage(menu);
}

console.log('📦 menu.js загружен!');
console.log('🍽️ Блюд в меню:', DEFAULT_MENU.length);
console.log('📋 Первое блюдо:', DEFAULT_MENU[0].name);
console.log('📋 Последнее блюдо:', DEFAULT_MENU[DEFAULT_MENU.length - 1].name);
