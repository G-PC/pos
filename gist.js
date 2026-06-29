// ========== GIST API (БЕЗ ТОКЕНА!) ==========
const GIST_CONFIG = {
    GIST_ID: 'СЮДА_ID_ТВОЕГО_ГИСТА',  // Например: 'abc123def456'
    USERNAME: 'ТВОЙ_ЛОГИН'             // Например: 'G-PC'
};

let cachedData = null;

// ========== ЗАГРУЗКА ==========
async function loadFromGist() {
    try {
        const url = `https://api.github.com/gists/${GIST_CONFIG.GIST_ID}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        const content = data.files['data.json'].content;
        const parsed = JSON.parse(content);
        
        cachedData = parsed;
        localStorage.setItem('cloudData', JSON.stringify(parsed));
        
        return parsed;
    } catch (error) {
        console.error('Ошибка загрузки из Gist:', error);
        const cached = localStorage.getItem('cloudData');
        if (cached) {
            const parsed = JSON.parse(cached);
            cachedData = parsed;
            return parsed;
        }
        return getDefaultData();
    }
}

// ========== СОХРАНЕНИЕ ==========
async function saveToGist(data) {
    try {
        // Сохраняем локально
        localStorage.setItem('cloudData', JSON.stringify(data));
        cachedData = data;
        
        // Открываем Gist в новой вкладке для ручного обновления
        const url = `https://gist.github.com/${GIST_CONFIG.USERNAME}/${GIST_CONFIG.GIST_ID}/edit`;
        console.log('📝 Обнови Gist вручную:');
        console.log(url);
        console.log('📋 Скопируй туда эти данные:');
        console.log(JSON.stringify(data, null, 2));
        
        alert('Открой Gist и обнови данные вручную!');
        window.open(url, '_blank');
        
        return data;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return null;
    }
}

// ========== БАЗОВЫЕ ДАННЫЕ ==========
function getDefaultData() {
    return {
        venueName: 'Кафе Уют',
        menu: [
            { id: 1, name: 'Цезарь', price: 350, category: 'Салаты', emoji: '🥗' },
            { id: 2, name: 'Греческий', price: 280, category: 'Салаты', emoji: '🥗' },
            { id: 3, name: 'Борщ', price: 250, category: 'Супы', emoji: '🍲' },
            { id: 4, name: 'Стейк', price: 550, category: 'Горячее', emoji: '🥩' },
            { id: 5, name: 'Паста', price: 390, category: 'Горячее', emoji: '🍝' },
            { id: 6, name: 'Чай', price: 120, category: 'Напитки', emoji: '🍵' },
            { id: 7, name: 'Кофе', price: 150, category: 'Напитки', emoji: '☕' },
            { id: 8, name: 'Тирамису', price: 300, category: 'Десерты', emoji: '🍰' },
        ],
        users: {
            'sadmin': { password: '123', role: 'sadmin', name: 'Главный администратор' }
        },
        tables: {
            '1': { orders: [], total: 0 },
            '2': { orders: [], total: 0 },
            '3': { orders: [], total: 0 }
        },
        stats: { totalOrders: 0, totalRevenue: 0 }
    };
}

async function getData() {
    if (cachedData) return cachedData;
    return await loadFromGist();
}

async function updateData(newData) {
    return await saveToGist(newData);
}

window.GitHubAPI = {
    getData,
    updateData,
    getDefaultData,
    testConnection: async () => true
};

console.log('📦 Gist API загружен!');
console.log('📁 Gist ID:', GIST_CONFIG.GIST_ID);
