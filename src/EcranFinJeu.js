////////////////////////////////
//          EcranFinJeu       //
////////////////////////////////

/**
 * Classe permettant de définir l'écran (state)
 * pour la scène de la fin du jeu
 */

var TetraBloc = window.TetraBloc;

TetraBloc.FinJeu = function FinJeu(leJeu) {
    //Le score actuel du jeu
    this.score;
    this.meilleurScore;
};

TetraBloc.FinJeu.prototype = {

    init: function(score) {
        //Récupérer la valeur passée en paramètre
        this.score = score;
    },

    create: function() {
        this.game.stage.backgroundColor = 0x000000;
        document.body.style.backgroundColor = "#000";
        //enregister le score si meilleur
        this.enregisterScore();

        //Le titre
        var laPolice = "bold " + Math.round(64 * TetraBloc.RATIO_ECRAN.moyen) + "px Arial";
        var style1 = {
            font: laPolice,
            fill: "#FFFFFF",
            align: "center"
        };
        var titreTxt = this.game.add.text(this.game.width / 2, 50, "FIN DU JEU\n", style1);
        titreTxt.anchor.set(0.5, 0);

        var animTitre = this.game.add.tween(titreTxt.scale).to({
            x: 1.25,
            y: 1.1,
        }, 10000, Phaser.Easing.None, true, 0, -1, true);

        var animTitre = this.game.add.tween(titreTxt).to({
            rotation: this.game.math.degToRad(15)
        }, 5000, Phaser.Easing.None, true, 0, -1, true);

        //Le texte
        var laPolice2 = "bold " + Math.round(32 * TetraBloc.RATIO_ECRAN.moyen) + "px Arial";
        var style2 = {
            font: laPolice2,
            fill: "#FFFFFF",
            align: "center"
        };

        //aficher le score
        var leTexte = "Votre score:\n";
        leTexte += this.score + " point(s)\n\n";
        var finJeuTxt = this.game.add.text(this.game.width / 2, this.game.height / 3, leTexte, style2);
        finJeuTxt.anchor.set(0.5);

        //afficher le meilleur score
        var leTexte = "Votre meilleur score:\n";
        leTexte += this.meilleurScore + " point(s)\n\n";
        var finJeuTxt = this.game.add.text(this.game.width / 2, this.game.height / 2, leTexte, style2);
        finJeuTxt.anchor.set(0.5);

        //Bouton
        var boutonJouer = this.game.add.button(this.game.width / 2, this.game.height / 1.75, "jouerBtn", this.rejouer, this, 1, 0, 2, 0);
        boutonJouer.anchor.set(0.5);
        boutonJouer.scale.set(TetraBloc.RATIO_ECRAN.moyen,TetraBloc.RATIO_ECRAN.moyen);

        var laPolice3 = "bold " + Math.round(18 * TetraBloc.RATIO_ECRAN.moyen) + "px Arial";
        var style3 = {
            font: laPolice3,
            fill: "#DDDDDD",
            align: "center"
        };
        var leTexte = "Créé par Marie-Maxime Tanguay\nCollège de Maisonneuve\nInspiré par le jeu Tetris\n\nMusique par Mark Sparling sur:\nhttp://marksparling.com/\n\nSon pop: freesound.org/people/ThompsonMan/sounds/129994/\nSon clique: freesound.org/people/kwahmah_02/sounds/256116/\nSon niveau: freesound.org/people/GameAudio/sounds/220168/";
        var copyrightTxt = this.game.add.text(this.game.width / 2, this.game.height / 1.3, leTexte, style3);
        copyrightTxt.anchor.set(0.5);
    },

    rejouer: function() {
        //Aller à l'écran de jeu
        this.game.state.start("instruction");
    },

    //fonction pour enregistrer le score
    enregisterScore: function() {
        //enregistre le score dans le local storage si le nouveau score est meilleur
        //selon le mode choisi
        switch (TetraBloc.mode) {
            case 0:
                if (localStorage.TetraBlocInfini < this.score || localStorage.TetraBlocInfini == null) {
                    localStorage.TetraBlocInfini = this.score;
                }
                this.meilleurScore = localStorage.TetraBlocInfini;
                break;
            case 1:
                if (localStorage.TetraBlocSurvie < this.score || localStorage.TetraBlocSurvie == null) {
                    localStorage.TetraBlocSurvie = this.score;
                }
                this.meilleurScore = localStorage.TetraBlocSurvie;
                break;
            case 2:
                if (localStorage.TetraBlocExtreme < this.score || localStorage.TetraBlocExtreme == null) {
                    localStorage.TetraBlocExtreme = this.score;
                }
                this.meilleurScore = localStorage.TetraBlocExtreme;
                break;
            default:
                return
        }
    }
};
