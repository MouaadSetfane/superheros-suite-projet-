
function sauvegarderHeroes(heroes) {
    localStorage.setItem(CLE_STORAGE_HEROS, JSON.stringify(heroes));
    console.log("Sauvegarde terminee. Heros:", heroes.length);
}

async function obtenirHeroes() {
    const heroesStockes = localStorage.getItem(CLE_STORAGE_HEROS);

    if (heroesStockes) {
        return JSON.parse(heroesStockes); 
    }

    try {
        const reponse = await fetch('heroes.json');
        if (!reponse.ok) {
            return []; 
        }
        
        const heroes = await reponse.json(); 
        sauvegarderHeroes(heroes);
        return heroes;

    } catch (erreur) {
        console.error("Erreur de chargement des heros:", erreur);
        return []; 
    }
}