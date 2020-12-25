/**
 * Classe  ExplosionPoint
 * pour le cours 582-448-MA
 * @author Johanne Massé
 * @version 2016-05-05
 */

(function () {
  //IFFE
  "use strict";

  /**
   * Constructeur de la classe ExplosionPoint
   *
   * @param {Phaser.Game} pJeu Référence au jeu en cours
   * @param {Number} pPosX Position du trou sur l'axe des x
   * @param {Number} pPosY Position du trou sur l'axe des y
   * @param {String} pText Le texte à afficher
   * @param {Object} pStyle Le style du texte
   */
  var ExplosionPoint = function ExplosionPoint(
    pJeu,
    pPosX,
    pPosY,
    pText,
    pStyle
  ) {
    //Appel du constructeur parent
    Phaser.Text.call(this, pJeu, pPosX, pPosY, pText, pStyle);
    this.anchor.set(0.5);

    //Enregistrer la référence au jeu
    this.leJeu = pJeu;

    //Mettre ce point dans l'affichage du jeu
    this.leJeu.add.existing(this);

    //Animer ce point
    this.animerPoint();
  };

  //Ajustements pour l'héritage
  ExplosionPoint.prototype = Object.create(Phaser.Text.prototype);
  ExplosionPoint.prototype.constructor = ExplosionPoint;

  ExplosionPoint.prototype.animerPoint = function () {
    var animAlpha = this.leJeu.add.tween(this).to(
      {
        alpha: 0,
      },
      950,
      Phaser.Easing.Linear.None,
      true
    );
    //Animation de l'échelle
    //Échelle initiale
    this.scale.setTo(1, 1);
    var animEchelle = this.leJeu.add.tween(this.scale);
    animEchelle.to(
      {
        x: 2,
        y: 2,
      },
      1000,
      Phaser.Easing.Linear.None,
      true
    );

    //Quand l'animation est terminée, on détruit le point
    animEchelle.onComplete.add(function () {
      //On détruit le point
      this.destroy();
    }, this);
  };

  //Rendre la classe publique
  window.ExplosionPoint = ExplosionPoint; //Ou return ExplosionPoint;
})();
