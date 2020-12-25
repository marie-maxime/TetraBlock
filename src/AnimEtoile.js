(function () {
  //IFFE
  "use strict";

  var AnimEtoile = function AnimEtoile(
    pJeu,
    pPosX,
    pPosY,
    pCouleurLigne,
    pCouleur
  ) {
    //Enregistrer la référence au jeu
    this.leJeu = pJeu;

    //Enregistrer les params
    this.posX = pPosX;
    this.posY = pPosY;
    this.couleurLigne = pCouleurLigne;
    this.couleur = pCouleur;

    //créer le graphique
    var uneEtoile = this.leJeu.make.graphics(0, 0);
    uneEtoile.lineStyle(2, this.couleurLigne);
    uneEtoile.beginFill(this.couleur);
    uneEtoile.moveTo(100, 25);
    uneEtoile.lineTo(115, 50);
    uneEtoile.lineTo(135, 55);
    uneEtoile.lineTo(122, 75);
    uneEtoile.lineTo(128, 100);
    uneEtoile.lineTo(100, 85);
    uneEtoile.lineTo(72, 100);
    uneEtoile.lineTo(78, 75);
    uneEtoile.lineTo(65, 55);
    uneEtoile.lineTo(85, 50);

    //Appel du constructeur parent
    //new Sprite(game, x, y, key, frame)
    Phaser.Sprite.call(
      this,
      this.leJeu,
      this.posX,
      this.posY,
      uneEtoile.generateTexture()
    );

    //animer l'étoile
    this.anchor.set(0.5);
    this.scale.set(
      TetraBloc.RATIO_ECRAN.horizontal,
      TetraBloc.RATIO_ECRAN.vertical
    );
    this.animerEtoile();

    //l'ajouter dans le jeu
    this.leJeu.add.existing(this);
  };

  //Ajustements pour l'héritage
  AnimEtoile.prototype = Object.create(Phaser.Sprite.prototype);
  AnimEtoile.prototype.constructor = AnimEtoile;

  //Configurer les propriétés
  AnimEtoile.prototype.animerEtoile = function () {
    //Animation de l'échelle
    //Échelle initiale
    this.scale.setTo(0, 0);
    var animEchelle = this.leJeu.add.tween(this.scale);
    animEchelle.to(
      {
        x: 2,
        y: 2,
      },
      500,
      Phaser.Easing.Elastic.Out,
      true
    );

    var animRotation = this.game.add.tween(this).to(
      {
        x: this.game.width / 1.5,
        rotation: this.game.math.degToRad(360),
      },
      500,
      Phaser.Easing.Elastic.InOut,
      true
    );

    var animAlpha = this.leJeu.add.tween(this).to(
      {
        alpha: 0,
      },
      500,
      Phaser.Easing.Linear.None,
      true
    );

    //Quand l'animation est terminée, on détruit l'étoile
    animEchelle.onComplete.add(function () {
      //On détruit le point
      this.destroy();
    }, this);
  };

  //Rendre la classe publique
  window.AnimEtoile = AnimEtoile;
})();
