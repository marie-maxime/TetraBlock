"use strict";

////////////////////////////////
//       EcranInstruction     //
////////////////////////////////


/**
 * Classe permettant de définir l'écran (state)
 * pour la scène d'instruction du jeu
 */


TetraBloc.Instruction = function Instruction(leJeu) {
    //Le score actuel du jeu
    this.score;
    this.meilleurScore;
};

TetraBloc.Instruction.prototype = {

    init: function(score) {
        //Récupérer la valeur passée en paramètre
        this.score = score;
    },

    create: function() {
        //s'assurer que le fond d'écran est de la bonne couleur
        document.body.style.backgroundColor = "#e7baf7";
        //ajouter le fond d'écran
        var leFond = this.game.add.sprite(0, 0, "fondInstruction");
        leFond.scale.set(TetraBloc.RATIO_ECRAN.horizontal,TetraBloc.RATIO_ECRAN.vertical);
        //Le titre
        var laPolice1 = "bold " + Math.round(64 * TetraBloc.RATIO_ECRAN.moyen) + "px Arial";
        var style1 = {
            font: laPolice1,
            fill: "#FFFFFF",
            align: "center"
        };
        //ajouter le titre
        var titreTxt = this.game.add.text(this.game.width / 2, this.game.height / 150, "Instructions\n", style1);
        titreTxt.anchor.set(0.5, 0);
        //et son animation
        var animTitre = this.game.add.tween(titreTxt.scale).to({
            x: 1.25,
            y: 1.1,
        }, 10000, Phaser.Easing.None, true, 0, -1, true);

        //Le texte
        var laPolice2 = Math.round(25 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";

        //afficher le texte d'instruction
        if(this.game.device.desktop){
           //instruction pour ordi de bureau
           laPolice2 = Math.round(20 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
           var instructionTxt = this.game.add.text(this.game.width / 2, this.game.height / 9, "Le but du jeu est de détruire \nles lignes en les remplissant \npar les blocs.\n\nFlèches gauche et droite pour bouger horizontalement,\nflèche bas pour accélérer la descente,\nZ pour faire une rotation,\nSHIFT pour mettre en réserve\net P pour mettre sur pause.\n\nLorsqu'un bloc s'arrête à la rangée la plus \nhaute, la partie est terminée.", {
               font: laPolice2,
               fill: "#ededed",
               align: "center"
           });
        }else{
           //instruction pour mobile
           var instructionTxt = this.game.add.text(this.game.width / 2, this.game.height / 9, "Le but du jeu est de détruire \nles lignes en les remplissant\n avec des blocs.\n\nFlèches: Déplacer le bloc \nRotation: pour faire une rotation,\nR: mettre en réserve le bloc\nToucher jeu: mettre sur pause.\n\nQuand un bloc atteint la rangée la plus \nhaute, la partie est terminée.", {
               font: laPolice2,
               fill: "#ededed",
               align: "center"
           });
        }
        instructionTxt.anchor.set(0.5,0);

        var laPolice3 = "bold " + Math.round(36 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
        //afficher le texte de choix de mode
        var titreMode = this.game.add.text(this.game.width / 2, this.game.height / 2, "Choisir votre mode", {
            font: laPolice3,
            fill: "white",
            align: "left"
        });
        titreMode.anchor.set(0.5);

        var laPolice4 = Math.round(22 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";

        //afficher les boutons de choix de mode
        var boutonRapide = this.game.add.button(this.game.width / 2, this.game.height / 1.68, "modeBtn", this.jouerRapide, this, 0, 0, 0, 0);
        boutonRapide.anchor.set(0.5);
        boutonRapide.scale.set(TetraBloc.RATIO_ECRAN.moyen,TetraBloc.RATIO_ECRAN.moyen);

        var instructionMode = this.game.add.text(this.game.width / 2, this.game.height / 1.5, "Faire le plus de points en 3 minutes", {
            font: laPolice4,
            fill: "lightgray",
            align: "left"
        });
        instructionMode.anchor.set(0.5);

        var boutonSurvie = this.game.add.button(this.game.width / 2, this.game.height / 1.325, "modeBtn", this.jouerSurvie, this, 1, 1, 1, 1);
        boutonSurvie.anchor.set(0.5);
        boutonSurvie.scale.set(TetraBloc.RATIO_ECRAN.moyen,TetraBloc.RATIO_ECRAN.moyen);

        var instructionMode = this.game.add.text(this.game.width / 2, this.game.height / 1.22, "Survivre pendant 15 niveaux", {
            font: laPolice4,
            fill: "lightgray",
            align: "left"
        });
        instructionMode.anchor.set(0.5);

        var boutonExtreme = this.game.add.button(this.game.width / 2, this.game.height / 1.11, "modeBtn", this.jouerExtreme, this, 2, 2, 2, 2);
        boutonExtreme.anchor.set(0.5);
        boutonExtreme.scale.set(TetraBloc.RATIO_ECRAN.moyen,TetraBloc.RATIO_ECRAN.moyen);

        var instructionMode = this.game.add.text(this.game.width / 2, this.game.height / 1.03, "Survivre 15 niveau, pour les experts du jeu", {
            font: laPolice4,
            fill: "lightgray",
            align: "left"
        });
        instructionMode.anchor.set(0.5);
    },
    //pour jouer une partie rapide de 3min
    jouerRapide: function() {
        TetraBloc.mode = 0;
        //Aller à l'écran de jeu
        this.jouer();
    },
    //pour jouer au mode survie où il faut survivre 15 niveaux
    jouerSurvie: function() {
        TetraBloc.mode = 1;
        //Aller à l'écran de jeu
        this.jouer();
    },

    //pour joueur au mode extrème
    jouerExtreme: function() {
        TetraBloc.mode = 2;
        //Aller à l'écran de jeu
        this.jouer();
    },
    //commencer le jeu
    jouer: function() {
        //Aller à l'écran de jeu
        this.game.state.start("ecranJeu");
    }
};
