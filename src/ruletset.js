export const classique = {
  reserve: false,
  tempsLimite: false,

  getScore: (lignesDetruites, niveauEnCours) => {
    switch (lignesDetruites) {
      case 1:
        return 40 * (niveauEnCours + 1);
      case 2:
        return 100 * (niveauEnCours + 1);
      case 3:
        return 300 * (niveauEnCours + 1);
      case 4:
        return 1200 * (niveauEnCours + 1);
      default:
        return 0;
    }
  },

  getVitesse: (niveau) => {
    if (niveau === 0) return 48;
    if (niveau === 1) return 43;
    if (niveau === 2) return 38;
    if (niveau === 3) return 33;
    if (niveau === 4) return 28;
    if (niveau === 5) return 23;
    if (niveau === 6) return 18;
    if (niveau === 7) return 13;
    if (niveau === 8) return 8;
    if (niveau === 9) return 6;
    if ([10, 11, 12].includes(niveau)) return 5;
    if ([13, 14, 15].includes(niveau)) return 4;
    if ([16, 17, 18].includes(niveau)) return 3;
    if ([19, 20, 21, 22, 23, 24, 25, 26, 27, 28].includes(niveau)) return 2;
    return 1;
  },

  getLigneChangementNiveau: (niveauDepart, niveauCourant) => {
    if (niveauDepart !== niveauCourant) {
      return 10;
    }

    const condition1 = niveauCourant * 10 + 10;
    const condition2 = Math.max(100, niveauCourant * 10 - 50);
    return condition1 < condition2 ? condition1 : condition2;
  }, 
}
