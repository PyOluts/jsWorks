const selector = document.getElementById('themeSelector') as HTMLSelectElement; // получаем обьект из Доп

type Theme = 'light' | 'dark'; //  вибор теми
const STORAGE_KEY = 'my_theme';

function loadTheme(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null; // важний момент проверка того  если в локал сторедж есть тема
    if (savedTheme) {
        document.body.className = savedTheme;
        selector.value = savedTheme;
    }
}


function saveTheme(theme: Theme): void { // сохранение темы
    localStorage.setItem(STORAGE_KEY, theme);
    document.body.className = theme;
}


selector.addEventListener('change', (e: Event) => { // МЕняем тему в зависимости от выбора пользователя
    const target = e.target as HTMLSelectElement;
    saveTheme(target.value as Theme);
});


window.addEventListener('storage', (e: StorageEvent) => { // синхронизация темы между вкладками
    if (e.key === STORAGE_KEY && e.newValue) {
        const theme = e.newValue as Theme;
        document.body.className = theme;
        selector.value = theme;
    }
});

loadTheme();
