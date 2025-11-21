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

function afficherHeroes(heroes) {
    const conteneurListe = document.getElementById('liste-des-heros');
    
    conteneurListe.innerHTML = ''; 

    if (heroes.length === 0) {
        conteneurListe.innerHTML = '<p>Aucun heros a afficher pour le moment.</p>';
        return;
    }

    heroes.forEach(heros => {
        const carte = document.createElement('div');
        carte.className = 'heros-carte'; 
        carte.id = `heros-${heros.id}`;

        carte.innerHTML = `
            <h3>${heros.nom} (ID: ${heros.id})</h3>
            <p><strong>Pouvoir :</strong> ${heros.pouvoir}</p>
            <p>${heros.description}</p>
            <button data-id="${heros.id}" class="btn-modifier">Modifier</button>
            <button data-id="${heros.id}" class="btn-supprimer">Supprimer</button>
        `;
        conteneurListe.appendChild(carte);
    });
    
    console.log("Interface utilisateur mise a jour avec", heroes.length, "heros.");
}

async function supprimerHeros(id) {
    const herosActuels = await obtenirHeroes();
    
    const nouvelleListe = herosActuels.filter(h => h.id !== id);
    
    sauvegarderHeroes(nouvelleListe);
    
    afficherHeroes(nouvelleListe);

    console.log(`Heros avec ID ${id} supprime.`);
}

// Nouvelle fonction de recherche
async function rechercherHeroes(terme) {
    const tousLesHeroes = await obtenirHeroes();
    
    if (!terme || terme.trim() === "") {
        afficherHeroes(tousLesHeroes);
        return;
    }

    const termeMin = terme.toLowerCase();

    const heroesFiltres = tousLesHeroes.filter(heros => 
        heros.nom.toLowerCase().includes(termeMin) || 
        heros.pouvoir.toLowerCase().includes(termeMin)
    );

    afficherHeroes(heroesFiltres);
    console.log(`Recherche effectuee pour "${terme}". ${heroesFiltres.length} resultat(s) trouve(s).`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const formulaire = document.getElementById('formulaire-ajout-heros');
    const listeConteneur = document.getElementById('liste-des-heros');
    const messageConfirmation = document.getElementById('message-confirmation');
    const champRecherche = document.getElementById('champ-recherche');
    
    const initialHeroes = await obtenirHeroes();
    afficherHeroes(initialHeroes);
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
        afficherHeroes(heroesActuels); 
        
        console.log("Nouveau heros ajoute:", nouveauHeros);
        
        formulaire.reset(); 
        messageConfirmation.style.display = 'block';
        setTimeout(() => {
            messageConfirmation.style.display = 'none';
        }, 3000); 
    });

    // Logique de suppression
    listeConteneur.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-supprimer')) {
            const idASupprimer = parseInt(e.target.dataset.id);
            if (confirm(`Voulez-vous vraiment supprimer le heros ID ${idASupprimer}?`)) {
                supprimerHeros(idASupprimer);
            }
        }
    });

    // Logique de recherche
    champRecherche.addEventListener('input', (e) => {
        rechercherHeroes(e.target.value);
    });

});