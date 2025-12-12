const CLE_STORAGE_HEROS = 'listeHeroes'; 

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

document.addEventListener('DOMContentLoaded', async () => {
    const formulaire = document.getElementById('formulaire-ajout-heros');
    
    const initialHeroes = await obtenirHeroes();
    
    console.log("Liste initiale des heros chargee:", initialHeroes);
    
    // Logique d'ajout
    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const heroesActuels = await obtenirHeroes();
        
        const maxId = heroesActuels.length > 0 ? Math.max(...heroesActuels.map(h => h.id)) : 0;
        const nouvelId = maxId + 1;
        
        const nouveauHeros = {
            id: nouvelId, 
            nom: document.getElementById('nom').value,
            pouvoir: document.getElementById('pouvoir').value,
            description: document.getElementById('description').value
        };

        heroesActuels.push(nouveauHeros);
        sauvegarderHeroes(heroesActuels);
        
        console.log("Nouveau heros ajoute:", nouveauHeros);
        
        formulaire.reset(); 
        messageConfirmation.style.display = 'block';
        setTimeout(() => {
            messageConfirmation.style.display = 'none';
        }, 3000); 
    });
});