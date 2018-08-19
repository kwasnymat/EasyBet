import {showSnackbar} from "./snackbar";

document.addEventListener("DOMContentLoaded",function(){


    const section = document.querySelector('section');
    const main = document.querySelector('main');
    const calculator = document.querySelector('calculator');
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

            const { country_id, country_name: countryName } = country;

            const addCountry = document.createElement("div");
            addCountry.innerText = `🏆 ${countryName}`;
            addCountry.setAttribute("id", country_id);
            addCountry.setAttribute("class", "country");
            section.appendChild(addCountry);


            addCountry.addEventListener("click",  (event) => {
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
                }	else {
                    throw new Error('Blad!');
                }
            })
            .then(data => {
                insertCountries(data);
            })
            .catch(err => {
                console.log('Blad!', err);
            });
    };

    loadCountries();



    const insertLeagues = (leagues, id) => {
        leagues.map((league) => {

            const {league_id, league_name} = league;

            const newDiv = document.createElement('div');
            newDiv.setAttribute('class', 'league');

            const addLeague = document.createElement("input");
            addLeague.type = "checkbox";
            addLeague.setAttribute("id", league_id);
            addLeague.value = league_name;

            const label = document.createElement("label");
            label.htmlFor = league_id;


            const countryId = document.getElementById(id);
            countryId.classList.add("visible");

            countryId.appendChild(newDiv);
            newDiv.appendChild(label);
            newDiv.appendChild(addLeague);
            label.appendChild(document.createTextNode(league_name));

            addLeague.addEventListener('click', (event) => {
                loadMatches(league_id);
            });
        });
    };


    const loadLeagues = id => {

        event.stopPropagation();

        const clickedCountry = section.querySelector(`[id='${id}']`);
        const isClickedCountryVisible = clickedCountry.classList.contains("visible");

        if (isClickedCountryVisible) {
            clickedCountry.innerHTML = clickedCountry.firstChild.textContent;
            clickedCountry.classList.remove("visible");
            main.innerHTML = '';
        } else {
            const leagueApi = APIURL + 'get_leagues&country_id=' + id + '&APIkey=' + APIKEY;
            fetch(leagueApi)
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error('Blad!');
                    }
                })
                .then(data => {
                    insertLeagues(data, id);
                })
                .catch(err => {
                    showSnackbar('league');
                })
        }

    };

    const insertMatches = (matches, id) => {

        const container = document.createElement("div");
        container.setAttribute('id', id);
        main.appendChild(container);


        matches.map((match => {
            const {match_date, match_time, match_hometeam_name, match_awayteam_name, match_id} = match;

            const addMatch = document.createElement("div");
            const matchTime = document.createElement("p");
            const matchTeams = document.createElement("p");

            container.appendChild(addMatch);

            matchTime.innerText = `⏰ ${match_date} ${match_time}`;
            matchTeams.innerText = `⚽ ${match_hometeam_name} vs  ${match_awayteam_name}`;
            addMatch.appendChild(matchTeams);
            addMatch.appendChild(matchTime);
            addMatch.setAttribute("id", match_id);
            addMatch.setAttribute("class", "match");


            addMatch.addEventListener('click', (event) => {
                loadOdds(match_id);
            })
        }))
    }


    const loadMatches = id => {

        event.stopPropagation();

        const clickedLeague = section.querySelector(`[id='${id}']`);

        const matchApi = `${APIURL}get_events&from=${dateFrom}&to=${dateTo}&league_id=${id}&APIkey=${APIKEY}`;

        if (clickedLeague.checked) {

            fetch(matchApi)
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error('Blad!');
                    }
                })
                .then(data => {
                    insertMatches(data, id);
                })
                .catch(err => {
                    showSnackbar('match');
                })

        } else {
            const leagueToDelete = main.querySelector(`[id='${clickedLeague.id}']`);
            leagueToDelete.parentElement.removeChild(leagueToDelete);
        }
    };


    const insertOdds = (odds, id) => {

        const uniqueId = () => {
            return Math.random().toString(36).substr(2, 16);
        };


        const odd = odds[0];


        const { odd_1, odd_2, odd_x } = odd;

        const odd1 = document.createElement("div");
        const odd2 = document.createElement("div");
        const oddX = document.createElement("div");


        odd1.innerText = `Gospodarze ${odd_1}`;
        odd1.value = odd_1;
        odd1.id = uniqueId();
        odd1.dataset.value = odd_1;

        odd2.innerText = `Goście ${odd_2}`;
        odd2.value = odd_2;
        odd2.id = uniqueId();
        odd2.dataset.value = odd_2;

        oddX.innerText = `Remis ${odd_x}`;
        oddX.value = odd_x;
        oddX.id = uniqueId();
        oddX.dataset.value = odd_x;

        odd1.setAttribute("class", "odd");
        odd2.setAttribute("class", "odd");
        oddX.setAttribute("class", "odd");


        const matchId = document.getElementById(id);
        matchId.classList.add("visible");
        matchId.appendChild(odd1);
        matchId.appendChild(oddX);
        matchId.appendChild(odd2);

        odd1.addEventListener('click', event => {
            oddHandle(odd1.id);
            addOdds(odd1.id);
            calculateTotal(odd1.id);
        });
        odd2.addEventListener('click', event => {
            oddHandle(odd2.id);
            addOdds(odd2.id);
            calculateTotal(odd2.id);
        });
        oddX.addEventListener('click', event => {
            oddHandle(oddX.id);
            addOdds(oddX.id);
            calculateTotal(oddX.id);
        });

    };


    const loadOdds = id => {

        const clickedMatch = main.querySelector(`[id='${id}']`);
        const isClickedMatchVisible = clickedMatch.classList.contains("visible");
        const firstParagraph = document.createElement('p');
        const secondParagraph = document.createElement('p');
        const firstChild = clickedMatch.getElementsByTagName('p')[0];
        const secondChild = clickedMatch.getElementsByTagName('p')[1];

        if (isClickedMatchVisible) {

            clickedMatch.innerText = "";
            clickedMatch.appendChild(firstParagraph);
            firstParagraph.innerText = firstChild.textContent;
            clickedMatch.appendChild(secondParagraph);
            secondParagraph.innerText = secondChild.textContent;
            clickedMatch.classList.remove("visible");

        } else {
            const oddApi = `${APIURL}get_odds&from=${dateFrom}&to=${dateTo}&match_id=${id}&APIkey=${APIKEY}`;
            fetch(oddApi)
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error('Blad!');
                    }
                })
                .then(data => {
                    insertOdds(data, id);
                })
                .catch(err => {
                    showSnackbar('odd');
                })
        }
    };

    const oddHandle = id => {

        const odd = main.querySelector(`[id='${id}']`);
        const odds = odd.parentElement.children;
        const isClicked = odd.classList.contains('clickedOdd');


        if (isClicked) {
            odd.classList.remove('clickedOdd')
        } else {
            for (var i = 0; i < odds.length; i ++) {
                odds[i].classList.remove('clickedOdd');
                odd.classList.add('clickedOdd');
            }
        }
    };

    const addOdds = id => {

        event.stopPropagation();

        const odd = main.querySelector(`[id='${id}']`);
        const oddValue = odd.getAttribute('data-value');
        const value = Number(oddValue);
        const matchName = odd.parentElement.firstElementChild;
        const calculator = document.querySelector('calculator #mainticket');

        const addOddToCalculator = document.createElement('div');
        addOddToCalculator.id = odd.id;
        addOddToCalculator.className = odd.parentElement.id;
        addOddToCalculator.value = value;

        const yourChoose = document.createElement('p');
        const match = document.createElement('p');
        const deleteOdd = document.createElement('p');
        deleteOdd.innerText = '❌';
        match.innerText = matchName.textContent;

        const isClicked = odd.classList.contains('clickedOdd');

        const checkedOdds = document.querySelectorAll('#mainticket div');
        const arrayOdds = Array.prototype.slice.call(checkedOdds);
        const array = [];

        arrayOdds.forEach(odd =>{
            array.push(odd.className);
        });


        if (isClicked && array.indexOf(odd.parentElement.id) === -1) {

            yourChoose.innerText = `Twój wybór:  ${odd.textContent}`;
            addOddToCalculator.appendChild(match);
            addOddToCalculator.appendChild(yourChoose);
            addOddToCalculator.appendChild(deleteOdd);
            calculator.appendChild(addOddToCalculator);

        } else if (!isClicked && array.indexOf(odd.parentElement.id) > -1){
            const removeOdd = calculator.querySelector(`[id='${id}']`);
            removeOdd.parentElement.removeChild(removeOdd);

        } else if (isClicked && array.indexOf(odd.parentElement.id) > -1){
            const removeclickedOdd = calculator.querySelector(`[class='${odd.parentElement.id}']`);
            removeclickedOdd.parentElement.removeChild(removeclickedOdd);

            yourChoose.innerText = `Twój wybór:  ${odd.textContent}`;
            addOddToCalculator.appendChild(match);
            addOddToCalculator.appendChild(yourChoose);
            addOddToCalculator.appendChild(deleteOdd);
            calculator.appendChild(addOddToCalculator);
        }


        deleteOdd.addEventListener('click', () => {
            addOddToCalculator.parentElement.removeChild(addOddToCalculator);
            const removeClass = main.querySelector((`[id='${addOddToCalculator.id}']`));

            if (typeof(removeClass) != 'undefined' && removeClass != null) {
                removeClass.classList.remove('clickedOdd');
                calculateTotal();
            } else {
                calculateTotal();
            }
        });

    };


    const calculateTotal = () => {

        const totalOdd = document.querySelector('#totalodd p');

        const odds = document.querySelectorAll('#mainticket div');

        const arrayOdds = [1];

        odds.forEach(odd => {
            arrayOdds.push(odd.value);
        });

        const result = arrayOdds.reduce((a,b) => {return a*b});
        const roundedResult = Math.round(result * 100) / 100;
        totalOdd.innerText =`CAŁKOWITY KURS: ${roundedResult}`;

        const possibleWin = document.querySelector('#totalodd').lastElementChild;
        const stake = document.querySelector('#totalodd input');


        possibleWin.innerText = `MOŻLIWA WYGRANA: ${roundedResult * stake.value} zł`;


        stake.addEventListener('change', () => {
            possibleWin.innerText = `MOŻLIWA WYGRANA: ${roundedResult * stake.value} zł`;
        });
    };



});