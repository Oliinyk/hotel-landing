document.addEventListener("DOMContentLoaded", function () {
   
    // ========== WEATHER API FETCH ========== //
    async function fetchWeatherIcon() {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=44.8333&longitude=14.7333&current_weather=true';
        try {
            const response = await fetch(url);
            const data = await response.json();
            const weather = data.current_weather;

            const temperature = `${weather.temperature}°C`;
            const tempElement = document.getElementById('weather-temperature');
            const iconElement = document.getElementById('weather-icon');

            if (tempElement && iconElement) {
                tempElement.textContent = temperature;

                if (weather.weathercode < 3) {
                    iconElement.className = 'fas fa-sun';
                } else if (weather.weathercode >= 3 && weather.weathercode < 80) {
                    iconElement.className = 'fas fa-cloud';
                } else {
                    iconElement.className = 'fas fa-cloud-showers-heavy';
                }
            }
        } catch (error) {
            const tempElement = document.getElementById('weather-temperature');
            if (tempElement) {
                tempElement.textContent = 'N/A';
            }
        }
    }

    // ========== HAMBURGER MENU TOGGLE ========== //
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = mobileMenu.querySelector("i");

    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times");
    });

    // ========== INITIALIZE WEATHER FETCH ========== //
    fetchWeatherIcon();

    //datepicker
    let dpMin, dpMax;
    let minDate = new Date();
    dpMin = new AirDatepicker('#checkIn', {
        minDate: minDate,
        onSelect({date}) {
            dpMax.update({
                minDate: date
            })
        }
    })
    dpMax = new AirDatepicker('#checkOut', {
        onSelect({date}) {
            dpMin.update({
                maxDate: date
            })
        }
    })

    // Send Form
    document.querySelector('.jsFormEmail').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const form = e.target;
        const formData = new FormData(form);
        formData.append('current_page', location.href);
    
        const successMessage = document.querySelector('.alert-message .is-success');
        const errorMessage = document.querySelector('.alert-message .is-error');
    
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    
        try {
            const response = await fetch('../php/feedback.php', {
                method: 'POST',
                body: formData
            });
    
            const data = await response.json();
    
            if (data.send_status) {
                successMessage.style.display = 'block';
                form.reset();
            } else {
                errorMessage.textContent = data.alert_message || 'Something went wrong, try again!';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Network error! Try again later.';
            errorMessage.style.display = 'block';
            console.error('Error:', error);
        }
    });
    
});