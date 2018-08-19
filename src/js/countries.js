

const section = document.querySelector('section');
const main = document.querySelector('main');
const APIURL = 'https://apifootball.com/api/?action=';
const APIKEY = '42dc8ebcec4d7f652f7f320d4495f5b58fb413da7ae6f4338afba9cae622312e';
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();
const nextMonth = new Date().getMonth() + 2;
const dateFrom = year + '-' + month + '-' + day;
const dateTo = year + '-' + nextMonth + '-' + day;

const insertCountries = (countries) => {
    countries.map((country) => {

        // cieszy destrukturyzacja
        // tutaj masz jeszcze jeden trik
        // generalnie w js stosujemy camelCase a backend lubi snake_case
        // to jest juz tez kwestia tego ile jest takich miejsc itd
        // ale zebys wiedzial to przy destrukturyzacji mozna zmienic sobie nazwe zmiennej jak ponizej w countryName
        // noi daje sie spacje miedzy nawiasem a zmienna

        const { country_id, country_name: countryName } = country;

        const addCountry = document.createElement("div");
        addCountry.innerText = countryName;
        addCountry.setAttribute("id", country_id);
        addCountry.setAttribute("class", "country");
        section.appendChild(addCountry);


        addCountry.addEventListener("click",  () => {
            loadLeagues(country_id);
        });
    });
};


const loadCountries = () => {

    const countryApi = APIURL + 'get_countries&APIkey=' + APIKEY;

    fetch(countryApi)
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error('Blad!');
            }
        })
        .then(data => {
            insertCountries(data);
        })
        .catch(err => {
            console.log('Blad!', err);
        });
}

export { loadCountries };