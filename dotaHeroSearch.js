// load necessary arrays
let heroes = [];
let heroMatchups = [];
let heroesWithoutSearched = [];
let top5 = [];
let bottom5 = [];

// select elements on page
const heroForm = document.querySelector('form');

// main - initial API call for list of heroes from OpenDota to populate heroes array
function main(){
    let heroIndexURL = 'https://api.opendota.com/api/heroes'
    fetch(heroIndexURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.map(hero => heroes.push(hero));
        });
    console.log('done');
}

// sort function for fetched matchup data
function matchupIDSort(data){
    // add win pct attribute to object for future convenience
    let withWinPct = data.map((hero) =>{
        hero.win_pct = hero.wins / hero.games_played;
        return hero;
    });
    // sort matchups by win pct
    withWinPct = data.sort((a,b) => {
        if (a.win_pct > b.win_pct){
            return -1;
        } else if (a.win_pct < b.win_pct){
            return 1
        } else {
            return 0;
        }
    });
    return withWinPct;
}

function generateTop(setList){
    let i = 1;
    let top5el = document.getElementById('cardLayout___top5');
    let top5HTML = [];
    setList.forEach(hero => {
        const searchID = hero.hero_id;
        const targetHero = heroes.find(hero => hero.id === searchID);
        const winPctFormatted = Math.round(hero.win_pct * 100);
        const heroDivHTML = `
            <div class="cardLayout__heroCard" id="top${i}">
                <h2>${targetHero.localized_name}</h2> <br>
                ${winPctFormatted}% win rate - ${hero.wins} wins over ${hero.games_played} games <br>
                Roles: ${targetHero.roles.join(', ')}
            </div>
        `;
        i++;
        console.log(heroDivHTML);
        top5HTML.push(heroDivHTML);
    });
    html = top5HTML.join('')
    top5el.innerHTML = html;
}

function generateBottom(setList){
    let bottom5el = document.getElementById('cardLayout___bottom5');
    let bottom5HTML = [];
    let j = 1;
    setList.forEach(hero => {
        const searchID = hero.hero_id;
        const targetHero = heroes.find(hero => hero.id === searchID);
        const winPctFormatted = Math.round(hero.win_pct * 100);
        const heroDivHTML = `
            <div class="cardLayout__heroCard" id="bottom${j}">
                <h2>${targetHero.localized_name}</h2> <br>
                ${winPctFormatted}% win rate - ${hero.wins} wins over ${hero.games_played} games <br>
                Roles: ${targetHero.roles.join(', ')}
            </div>
        `;
        j++;
        console.log(heroDivHTML);
        bottom5HTML.push(heroDivHTML);
    });
    html = bottom5HTML.join('')
    bottom5el.innerHTML = html;
}

function heroFetch(e) {
    // stop page reload
    e.preventDefault();
    // remove cards
    if (document.getElementById('top5') !== null){
        let k = 1;
        while (k<6){
            let topRemove = document.getElementById(`top${k}`);
            let bottomRemove = document.getElementById(`bottom${k}`);
            topRemove.remove();
            bottomRemove.remove();
            k++;
        }
    }
    // convert hero name to hero object in heroes array
    const name = e.currentTarget.item.value;
    console.log(name);
    const targetHero = heroes.find(hero => hero.localized_name === name);
    // set hero ID in the fetch URL for the matchups
    let heroMatchupURL = `https://api.opendota.com/api/heroes/${targetHero.id}/matchups`;
    // fetch matchups, sort by hero win pct, spread into heroMatchups array
    fetch(heroMatchupURL)
        .then(response => response.json())
        .then(data => {
            let sortedData = matchupIDSort(data);
            heroMatchups = [...sortedData];
            const arraySize = sortedData.length;
            top5 = heroMatchups.slice(0,5);
            bottom5 = heroMatchups.slice((arraySize -  5), arraySize);
            generateTop(top5);
            generateBottom(bottom5);
        });
    
}

// event listeners
heroForm.addEventListener('submit', heroFetch);