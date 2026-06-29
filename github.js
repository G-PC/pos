// ========== НАСТРОЙКИ GITHUB ==========
const GITHUB_CONFIG = {
    // ЗАМЕНИ НА СВОИ ДАННЫЕ!
    REPO: 'G-PC/pos',     // Например: 'ivanov/pos-system'
    PATH: 'data.json',              // Путь к файлу в репозитории
    TOKEN: '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'       // Personal Access Token
};

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

// ========== КЭШ ==========
let cachedData = null;
let currentSha = null;

// ========== ЗАГРУЗКА ДАННЫХ С GITHUB ==========
async function loadFromGitHub() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.PATH}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // Файл не существует - создаем
                console.log('Файл не найден, создаем новый...');
                const defaultData = getDefaultData();
                await saveToGitHub(defaultData);
                return defaultData;
            }
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        currentSha = data.sha;
        const content = atob(data.content);
        const parsed = JSON.parse(content);
        
        // Сохраняем в кэш
        cachedData = parsed;
        localStorage.setItem('cloudData', JSON.stringify(parsed));
        localStorage.setItem('cloudSha', currentSha);
        
        return parsed;
    } catch (error) {
        console.error('Ошибка загрузки с GitHub:', error);
        // Пробуем загрузить из localStorage
        const cached = localStorage.getItem('cloudData');
        if (cached) {
            const parsed = JSON.parse(cached);
            cachedData = parsed;
            return parsed;
        }
        // Создаем новые данные
        const defaultData = getDefaultData();
        cachedData = defaultData;
        localStorage.setItem('cloudData', JSON.stringify(defaultData));
        return defaultData;
    }
}

// ========== СОХРАНЕНИЕ ДАННЫХ НА GITHUB ==========
async function saveToGitHub(data) {
    try {
        // Получаем текущий sha если его нет
        if (!currentSha) {
            try {
                const url = `https://api.github.com/repos/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.PATH}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.ok) {
                    const fileData = await response.json();
                    currentSha = fileData.sha;
                }
            } catch (e) {}
        }

        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.PATH}`;
        
        const body = {
            message: `Обновление данных ${new Date().toLocaleString('ru-RU')}`,
            content: content,
            branch: 'main'
        };
        
        if (currentSha) {
            body.sha = currentSha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Ошибка сохранения: ${response.status} - ${error.message}`);
        }

        const result = await response.json();
        currentSha = result.content.sha;
        
        // Обновляем кэш
        cachedData = data;
        localStorage.setItem('cloudData', JSON.stringify(data));
        localStorage.setItem('cloudSha', currentSha);
        
        return result;
    } catch (error) {
        console.error('Ошибка сохранения на GitHub:', error);
        // Сохраняем локально
        localStorage.setItem('cloudData', JSON.stringify(data));
        throw error;
    }
}

// ========== ПОЛУЧЕНИЕ ДАННЫХ ==========
async function getData() {
    if (cachedData) return cachedData;
    return await loadFromGitHub();
}

// ========== ОБНОВЛЕНИЕ ДАННЫХ ==========
async function updateData(newData) {
    cachedData = newData;
    return await saveToGitHub(newData);
}

// ========== ОБНОВЛЕНИЕ КОНКРЕТНЫХ ПОЛЕЙ ==========
async function updateField(field, value) {
    const data = await getData();
    data[field] = value;
    return await updateData(data);
}

// ========== ПОЛУЧЕНИЕ ПОЛЯ ==========
async function getField(field) {
    const data = await getData();
    return data[field];
}

// ========== ПРОВЕРКА СОЕДИНЕНИЯ ==========
async function testConnection() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.REPO}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// ========== ЭКСПОРТ ==========
window.GitHubAPI = {
    getData,
    updateData,
    updateField,
    getField,
    testConnection,
    getDefaultData,
    loadFromGitHub,
    saveToGitHub
};
