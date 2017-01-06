"use strict";

////////////////////////////////
//      ChargementMedias      //
////////////////////////////////

/**
* Classe permettant de définir l'écran (state)
* pour le chargement des médias
*/

TetraBloc.ChargementMedias = function(leJeu) {
   this.rondelle = null;
   this.pourcentTxt = null;
};

TetraBloc.ChargementMedias.prototype = {

   init: function() {
      //Dessiner une rondelle
      var leGraphique = this.game.make.graphics(0, 0);
      leGraphique.lineStyle(15, 0x7d40af);
      leGraphique.arc(64, 64, 64, 0, this.game.math.degToRad(320));
      this.rondelle = this.game.add.sprite(this.game.width / 2, this.game.height / 4, leGraphique.generateTexture());
      this.rondelle.anchor.set(0.5);
      this.rondelle.scale.set(TetraBloc.RATIO_ECRAN.moyen,TetraBloc.RATIO_ECRAN.moyen);
      //Créer et afficher le texte
      this.pourcentTxt = this.game.add.text(this.game.width / 2, this.game.height / 2, "0 %", {
         font: "48px Monospace",
         fill: "#FFF",
         align: "center"
      });
      this.pourcentTxt.anchor.set(0.5, -1);
   },

   preload: function() {
      this.game.stage.backgroundColor = "#e7baf7";
      //Charger les images du jeu
      this.game.load.spritesheet("jouerBtn", "medias/img/bouton-jouer.png", 360, 80);
      this.game.load.spritesheet("modeBtn", "medias/img/boutons-modes.jpg", 360, 70);
      this.game.load.spritesheet("flecheBtn", "medias/img/boutons-fleches.png", 100, 100);
      this.game.load.image("fondEcran", "medias/img/fondEcran.png");
      this.game.load.image("fondIntro", "medias/img/fond-intro.jpg");
      this.game.load.image("fondInstruction", "medias/img/fond-instruction.jpg");
      this.game.load.image("pause", "medias/img/bouton-pause.jpg");
      this.game.load.spritesheet("bloc", "medias/img/spritesheet_blocs.png", TetraBloc.TAILLE_IMG, TetraBloc.TAILLE_IMG);
      this.game.load.spritesheet("blocAnim", "medias/img/sprite_animationBloc.png", 107.97, 145);

      //Charger les sons
      this.game.load.audio("clique", ["medias/sons/clique.mp3", "medias/sons/clique.ogg"]);
		this.game.load.audio("pop", ["medias/sons/pop.mp3", "medias/sons/pop.ogg"]);
      this.game.load.audio("niveau", ["medias/sons/niveau.mp3", "medias/sons/niveau.ogg"]);
      this.game.load.audio("musique", ["medias/sons/musique.mp3", "medias/sons/musique.ogg"]);

      //Afficher la barre de chargement
      var barre = this.game.add.sprite(0, this.game.height / 2, "barreImg");
      barre.anchor.set(0, 1);
      barre.scale.set(TetraBloc.RATIO_ECRAN.horizontal,TetraBloc.RATIO_ECRAN.vertical);
      this.game.load.setPreloadSprite(barre);

      //Afficher le pourcentage chargé après le chargement de chaque média
      this.game.load.onFileComplete.add(this.afficherPourcentage, this);


   },
   afficherPourcentage: function(progression) {
      this.pourcentTxt.text = progression + " %";
   },
   loadUpdate: function() {
      this.rondelle.angle += 5;
   },

   create: function() {
      this.game.state.start("introJeu");
   }
}
