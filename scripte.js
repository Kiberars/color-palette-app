        const defaultBackgroundColor  = '#70b5ff'
        const defaultTextColor  = 'black'
        let colorHistory = [];
        let currentColor  = defaultBackgroundColor;
        let colorStats = {}; 
        let spanColor = [];

        function closeAlert(){
            document.getElementById('alert').style.display = 'none'
        }
        
        function btnFalse(){
            const btn = document.getElementById('btnSaveColor')
            btn.disabled = true;
            btn.style.background =  '#3f3f3f';
            btn.classList.add('no-hover');
            btn.classList.add('no-active');
        }
        function btnTrue(){
            const btn = document.getElementById('btnSaveColor')
            btn.disabled = false;
            btn.style.background =  '#007bff';
            btn.classList.remove('no-hover');
            btn.classList.remove('no-active');
        }
        function showAlert(color, text){
            document.getElementById('alert').style.display = 'block';
            document.getElementById('alert').style.background = color
            document.getElementById('alertText').textContent = text;
        }

        function saveHistoryColor(){

            if (!currentColor  || currentColor  === defaultBackgroundColor) {
                showAlert("#995555", `❌ Нечего сохранять - текущий цвет стандартный`)                
                btnFalse()
                return;
            }
            try {
                if (!colorHistory.includes(currentColor )) {
                    colorHistory.push(currentColor );          
                    if(colorHistory.length >3){
                        btnFalse();
                        return;                 
                    }
                    updateHistoryDisplay();
                    showAlert("#559955", `💾 цвет ${currentColor} сохранен в историю`);
                } else {
                    showAlert("#999955", `⚠️ Этот цвет уже в истории`) 
                    btnFalse()
                }
                updateStatsDisplay()
                spanColors = document.getElementsByClassName('color-square');
                console.log(spanColors);
                for(const spanColor of spanColors){
                    spanColor.addEventListener('mouseover', hoverMouse);
                }
            } catch (error) {
                console.error('Ошибка сохранения:', error);
            }
           
            
        }
        function updateHistoryDisplay(){
            const historyElement = document.getElementById('colorHistoryInfo');            
            if (colorHistory.length === null) {
                historyElement.innerHTML = 'История цветов: пусто';
                return;
            }            
            const historyHTML = colorHistory.map(color => `<span id="color-square" class="color-square" style="background-color: ${color}"></span> ${color}`
            ).join(' &nbsp; ');            
            historyElement.innerHTML = `История цветов: ${historyHTML}`;
        }

        function changeColor(){        
            
            btnTrue()
            currentColor  = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');            

            colorStats[currentColor] = (colorStats[currentColor] || 0) + 1;
            console.log('📊 Статистика:', colorStats);

            brightness = rgbToBrightness(currentColor)
            const isDark = brightness < 128;

            document.body.style.color = isDark ? 'White' : 'Black';
            document.body.style.backgroundColor = currentColor ;
            document.getElementById('colorInfo').textContent = `Текущий цвет: ${currentColor }`;

            console.log(`Цвет: ${currentColor },  Яркость: ${brightness.toFixed(2)}, Текст: ${isDark ? 'белый' : 'черный'}`);              

            
        }
        function changeColorReset(){
            document.body.style.backgroundColor = defaultBackgroundColor ;
            document.body.style.color = defaultTextColor ;
            document.getElementById('colorInfo').textContent = `Текущий цвет: ${defaultBackgroundColor }`;
            console.log(`Цвет: ${defaultBackgroundColor }, Текст: ${defaultTextColor }`);
            updateStatsDisplay(); 
        }
        function updateStatsDisplay() {

            // Находим самый популярный цвет
            let mostPopularColor = '';
            let maxCount = 0;
            
            // Перебираем все цвета в статистике
            for (const color in colorStats) {
                if (colorStats[color] > maxCount) {
                    maxCount = colorStats[color];
                    mostPopularColor = color;
                }
            }
            
            // Создаем красивый текст для статистики
            let statsHTML = '<h3>📊 Статистика цветов:</h3>';
            
            // Если статистика пустая
            if (Object.keys(colorStats).length === 0) {
                statsHTML += '<p>Цвета еще не выбирались</p>';
            } else {
                // Показываем самый популярный цвет
                statsHTML += `<p>🎯 Самый популярный: <span style="color: ${mostPopularColor}">■</span> ${mostPopularColor} (${maxCount} раз)</p>`;
                
                // Показываем всю статистику
                statsHTML += '<p>Все цвета: ';
                for (const color in colorStats) {
                    statsHTML += `<span style="color: ${color}">■${colorStats[color]}</span> `;
                }
                statsHTML += '</p>';
            }
            
            // Показываем на странице (добавь в HTML div с id="colorStats")
            const statsElement = document.getElementById('colorStats');
            if (statsElement) {
                statsElement.innerHTML = statsHTML;
            }
        }
        
        
        function hoverMouse(){

                const inlineColor = event.target.style.backgroundColor;                
                var modal = document.getElementById('myModal');

                modal.style.backgroundColor = inlineColor;

                document.getElementById('infoRGB').textContent = `RGB представление  ${inlineColor}`;
                document.getElementById('infoHSL').textContent = `HSL представление ${rgbaToHsl(inlineColor)}`;
                document.getElementById('brightness').textContent = ` Яркость ${curentRgbToBrightnes(inlineColor)}`;

                const isDark = curentRgbToBrightnes(inlineColor) < 128;
                modal.style.color = isDark ? 'White' : 'Black';

                modal.style.display = 'block';

                window.onclick = function(event) {
                if (event.target != modal) {
                    modal.style.display = 'none';
                    }   
                }   
        }
        function btn_close(){
            var modal = document.getElementById('myModal');
            modal.style.display = 'none';  
        }
        function rgbaToHsl(rgba) {
        // Парсим строку RGBA, например, "rgba(255, 165, 0, 1)"
        const rgbaMatch = rgba.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/);

        if (!rgbaMatch) {
            return null; // Не удалось распарсить
        }

        const r = parseInt(rgbaMatch[1]);
        const g = parseInt(rgbaMatch[2]);
        const b = parseInt(rgbaMatch[3]);

        // Преобразуем в формат RGB, который является десятичным числом
        const rgb = { r: r / 255, g: g / 255, b: b / 255 };

        // Находим максимальное и минимальное значения
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        let h = 0; // Тон
        let s = 0; // Насыщенность
        let l = (max + min) / 2; // Светлота
        const d = max - min;

        if (d === 0) {
            h = 0;
            s = 0;
        } else {
            // Определяем насыщенность и тон
            h = (max === rgb.r
            ? (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0)
            : (max === rgb.g
                ? (rgb.b - rgb.r) / d + 2
                : (rgb.r - rgb.g) / d + 4)) / 6;
            s = d === 0 ? 0 : d / (l > 0.5 ? 2 - max - min : max + min);
        }

        // Конвертируем значения в проценты и градусы
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}%, ${s}%, ${l}%)`;
        }
        function rgbToBrightness(Color){                 
            const hex = Color.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness;
        }
        function curentRgbToBrightnes(color){
                const match = color.match(/\d+/g)
                
                    r =parseInt(match[0]),
                    g =parseInt(match[1]),
                    b =parseInt(match[2])

                return (r * 299 + g * 587 + b * 114) / 1000;
        }
