// Структура данных
const state = {
    categories: [],
    dishes: [],
    modifiers: [],
    tables: {}
};

// Загрузка данных из storage
window.addEventListener('load', () => {
    restoreState();
    initPage();
});

// Инициализация главной страницы
function initPage() {
    if (location.pathname !== '/admin.html') {
        setupTables();
        loadMenu();
        loadCart();
    } else {
        renderCategories();
        renderModifiers();
        populateCategorySelect();
    }
}

// Настройка выбора столов
function setupTables() {
    const buttons = [...document.querySelectorAll('.table-btn')];
    buttons.forEach((btn, idx) => {
        btn.textContent = `Стол ${idx + 1}`;
        btn.onclick = () => selectTable(idx + 1);
    });

    const currentTable = sessionStorage.getItem('currentTable') || 1;
    selectTable(currentTable);
}

// Выбор стола
function selectTable(tableNum) {
    sessionStorage.setItem('currentTable', tableNum);

    const buttons = [...document.querySelectorAll('.table-btn')];
    buttons.forEach(btn => btn.classList.toggle('active-table', false));
    buttons[tableNum - 1].classList.toggle('active-table', true);

    const header = document.querySelector('.cart h3');
    header.textContent = `Заказ для стола ${tableNum}`;

    loadCart();
}

// Загрузка меню
function loadMenu() {
    const menuSection = document.querySelector('.menu');
    menuSection.innerHTML = '';

    state.categories.forEach(cat => {
        const catTitle = document.createElement('div');
        catTitle.className = 'category-title';
        catTitle.textContent = cat.name;
        menuSection.appendChild(catTitle);

        const dishesInCat = state.dishes.filter(dish => dish.categoryId === cat.id);
        dishesInCat.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-card';
            card.innerHTML = `
                <h3>${dish.name}</h3>
                <span>₽ ${dish.price}</span>
                <button class="add-to-cart" data-id="${dish.id}">Добавить</button>
            `;
            menuSection.appendChild(card);
        });
    });
}

// Загрузка корзины
function loadCart() {
    const currentTable = sessionStorage.getItem('currentTable') || 1;
    const cart = state.tables[currentTable]?.cart ?? [];

    const cartUl = document.querySelector('.cart ul');
    cartUl.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} × ${item.qty} = ₽ ${item.price * item.qty}`;
        cartUl.appendChild(li);
    });

    const totalSum = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    document.getElementById('total-sum').textContent = `${totalSum} ₽`;
}

// Оплата
function payOrder() {
    const currentTable = sessionStorage.getItem('currentTable') || 1;
    state.tables[currentTable].cart = [];
    saveState();
    loadCart();
    alert(`Заказ для стола ${currentTable} оплачен!`);
}

// Добавление блюда в корзину
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const dishId = parseInt(btn.dataset.id);
        const dish = state.dishes.find(d => d.id === dishId);
        const currentTable = sessionStorage.getItem('currentTable') || 1;

        if (!state.tables[currentTable]) state.tables[currentTable] = { cart: [] };

        const existingItem = state.tables[currentTable].cart.find(it => it.id === dishId);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            state.tables[currentTable].cart.push({
                id: dishId,
                name: dish.name,
                price: dish.price,
                qty: 1
            });
        }

        saveState();
        loadCart();
    });
});

// ------------------------ АДМИНИСТРАЦИЯ ------------------------

// Рендеринг категорий
function renderCategories() {
    const list = document.getElement('categories-list');
    list.innerHTML = '';

    state.categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.name;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Удалить';
        delBtn.onclick = () => deleteCategory(cat.id);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Рендеринг модификаторов
function renderModifiers() {
    const list = document.getElement('modifiers-list');
    list.innerHTML = '';

    state.modifiers.forEach(mod => {
        const li = document.createElement('li');
        li.textContent = mod.name;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Удалить';
        delBtn.onclick = () => deleteModifier(mod.id);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Создание категории
function createCategory() {
    const input = document.getElement('new-category-input');
    const name = input.value.trim();
    if (name) {
        state.categories.push({ id: Date.now(), name });
        saveState();
        renderCategories();
        input.value = '';
    }
}

// Создание модификатора
function createModifier() {
    const input = document.getElement('modifier-input');
    const name = input.value.trim();
    if (name) {
        state.modifiers.push({ id: Date.now(), name });
        saveState();
        renderModifiers();
        input.value = '';
    }
}

// Сохранение блюда
function saveDish() {
    const form = document.getElement('dish-form');
    const catSelect = form.querySelector('#category-select');
    const nameInput = form.querySelector('#dish-name');
    const priceInput = form.querySelector('#dish-price');

    const selectedCat = state.categories.find(cat => cat.id === catSelect.value);
    if (!selectedCat) return;

    const newDish = {
        id: Date.now(),
        categoryId: selectedCat.id,
        name: nameInput.value,
        price: Number(priceInput.value)
    };

    state.dishes.push(newDish);
    saveState();

    nameInput.value = '';
    priceInput.value = '';
}

// Вспомогательные функции
function restoreState() {
    const saved = localStorage.getItem('restaurantState');
    if (saved) Object.assign(state, JSON.parse(saved));
}

function saveState() {
    localStorage.setItem('restaurantState', JSON.stringify(state));
}

// Заполнение выпадающего списка категорий
function populateCategorySelect() {
    const select = document.getElement('category-select');
    select.innerHTML = ''; // Очистка

    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = '-- Выберите категорию --';
    select.appendChild(defaultOption);

    state.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        select.appendChild(opt);
    });
}

// Удаление категории
function deleteCategory(categoryId) {
    const confirmDelete = confirm(
        `Удалить категорию "${state.categories.find(cat => cat.id === categoryId)?.name}"?` +
        ` Все блюда в ней будут перемещены в первую категорию.`
    );

    if (confirmDelete) {
        const firstCatId = state.categories[0].id;
        state.dishes.forEach(dish => {
            if (dish.categoryId === categoryId) {
                dish.categoryId = firstCatId;
            }
        });

        state.categories = state.categories.filter(cat => cat.id !== categoryId);
        saveState();
        renderCategories();
        loadMenu(); // Пересобираем меню
    }
}

// Удаление модификатора
function deleteModifier(modifierId) {
    const confirmDelete = confirm(
        `Удалить модификатор "${state.modifiers.find(m => m.id === modifierId)?.name}"?`
    );

    if (confirmDelete) {
        state.modifiers = state.modifiers.filter(m => m.id !== modifierId);
        saveState();
        renderModifiers();
    }
}
