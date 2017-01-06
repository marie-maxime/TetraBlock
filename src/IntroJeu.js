"use strict";

////////////////////////////////
//          IntroJeu          //
////////////////////////////////

/**
 * Classe permettant de définir l'écran (state)
 * pour la scène d'intro du jeu
 */

TetraBloc.IntroJeu = function IntroJeu(leJeu) {};

TetraBloc.IntroJeu.prototype = {

   create: function() {
      //afficher le fond d'écran
      var leFondIntro = this.game.add.sprite(0, 0, "fondIntro");
      leFondIntro.scale.set(TetraBloc.RATIO_ECRAN.horizontal,TetraBloc.RATIO_ECRAN.vertical);
      //le nombre d'images jouer dans l'animation de animBLoc
      var animTableau = [];
      for (var i = 0; i < 71; i++) {
         animTableau.push(i);
      }

      //Image de l'intro
      var animBloc = this.game.add.sprite(-this.game.width / 2, this.game.height / 2.3, "blocAnim");
      animBloc.anchor.set(0.5);
      animBloc.animations.add("animBloc",animTableau, 19, true);
      animBloc.scale.setTo(TetraBloc.RATIO_ECRAN.moyen*2,TetraBloc.RATIO_ECRAN.moyen*2);
      animBloc.tint = 0xADD8E6;
      animBloc.animations.play("animBloc")

      //Effet d'animation sur limage
      var animImgIntro = this.game.add.tween(animBloc).to({
         x: this.game.width / 2,
         rotation: this.game.math.degToRad(-30)
      }, 1000, Phaser.Easing.Elastic.InOut, true);

      //2eme animation de l'image d'intro
      this.game.add.tween(animBloc).to({
         rotation: this.game.math.degToRad(360)
      }, 10000, Phaser.Easing.None, true,0,-1,true);

      //Quand l'animation sera complétée, on affichera le texte et le gestionnaire sur l'écran
      animImgIntro.onComplete.add(this.afficherTxt, this);

   },

   afficherTxt: function() {
      var laPolice = Math.round(36 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
      var leTexte = this.game.add.text(this.game.width / 2, this.game.height/1.2, "Cliquer dans l'écran\npour jouer", {
         font: laPolice,
         fill: "#FFF",
         align: "center"
      });
      leTexte.anchor.set(0.5, 1);

      //Aller à l'écran de jeu en cliquant dans l'écran
      this.game.input.onDown.addOnce(this.allerEcranJeu, this);

      //animation de scale du titre
      var animTitre = this.game.add.tween(leTexte.scale).to({
         x:1.3,
         y:1.1,
      },10000, Phaser.Easing.None, true,0,-1,true);

      //2eme animation du titre
      var animTitre = this.game.add.tween(leTexte).to({
         y: this.game.height/1.25
      },10000, Phaser.Easing.None, true,0,-1,true);

   },

   allerEcranJeu: function() {
      //Aller à l'écran de jeu
      this.game.state.start("instruction");
   }

};
