////////////////////////////////
//          EcranJeu         //
////////////////////////////////

/**
 * Classe permettant de définir l'écran (state)
 * pour la scène du jeu...
 */

var TetraBloc = window.TetraBloc;

TetraBloc.Jeu = function Jeu(leJeu) {
  //Propriétés de l'écran de jeu
  this.tempsTxt;
  this.scoreTxt;
  this.niveauTxt;
  //les touches
  this.toucheRotation;

  //couleurs des pièces
  this.I_BLOC_COULEUR = 0xadd8e6;
  this.O_BLOC_COULEUR = 0xffff00;
  this.T_BLOC_COULEUR = 0x800080;
  this.S_BLOC_COULEUR = 0x008000;
  this.Z_BLOC_COULEUR = 0xff0000;
  this.J_BLOC_COULEUR = 0x0000ff;
  this.L_BLOC_COULEUR = 0xffa500;
};

TetraBloc.Jeu.prototype = {
  init: function () {
    //s'il y a un niveau limite pour la partie en cours
    this.niveauLimite = false;
    //s'il y a un temps limite pour la partie en cours
    this.tempsLimite = false;
    //si la réserve est utilisée
    this.reserveUtilise = false;
    //la pièce qui est en réserve
    this.laPieceEnReserve = null;
    //la prochaine pièce qui sera mis en jeu
    this.laProchainePiece = null;
    //la pièce qui est en réserve et sera mis en jeu
    this.laPieceMettreEnJeu = null;
    //la forme de la pièce en jeu
    this.laForme = [];
    //la forme de la prochaine pièce
    this.laProchaineForme = [];
    //la forme de la pièce en réserve
    this.reserveForme = [];
    //Initialiser le this.score
    this.score = 0;
    //la musique du jeu
    this.laMusique = this.game.add.audio("musique");
    //le nombre de ligne détruite d'un coup
    this.nbLignesDetruitesDunCoup = 0;
    //le nombre de ligne détruite au total
    this.nbLignesDetruitesTotal = 0;
    //la vitesse que les blocs tombent
    this.vitesse = 2;
    //boucle de temps qui appel la fonction de faire descendre les blocs
    this.laBoucleTemps = null;
    //Initaliser le temps
    this.tempsEcoule = 0;
    //initaliser le this.niveau
    this.niveau = 1;
    //la pièce en nombre que celle-ci représente
    this.etatPiece = 0;
    //info de la rotation de la pièce active
    this.etatRotation = 0;
    //Enregistrer que le chronomètre n'est pas activé
    this.blocActif = true; //Un booléen pour gérer quand un bloc est actif
    //la valeur du temps écoulé
    this.leTemps = 0;
    //l'intervale avant le prochain mouvement
    this.freqTemp = 0.07;
    //temps que la prochaine action peut être executé
    this.prochaineAction = 0;
    //tableau de sprites des blocs
    this.lesCases = [];
    //la matrice du jeu
    this.tableauJeu = [];
    //matrice du tableau de la prochaine pièce
    this.tableauProchainePiece = [];
    //sprite des blocs de la prochaine pièce
    this.lesCasesProchainePieces = [];
    //matrice du tableau de la pièce en réserve
    this.tableauPieceEnReserve = [];
    //sprites des blocs de la pièce en réserve
    this.lesCasesPieceEnReserve = [];
    //panneau quand le jeu est sur pause
    this.objetPause = {};
  },

  create: function () {
    //Gestion des flèches et touches du clavier
    this.toucheRotation = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.touchePause = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.toucheMettreEnReserve = this.game.input.keyboard.addKey(
      Phaser.Keyboard.SHIFT
    );
    this.lesFleches = this.game.input.keyboard.createCursorKeys();

    //Placer les textes du this.score et du temps
    var laPolice =
      Math.round(20 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
    var leStyle = {
      font: laPolice,
      fill: "#AAAAAA",
      align: "center",
    };

    //mettre l'image de fond et les textes
    var leFond = this.game.add.sprite(0, 0, "fondEcran");
    leFond.scale.set(
      TetraBloc.RATIO_ECRAN.horizontal,
      TetraBloc.RATIO_ECRAN.vertical
    );

    this.scoreTxt = this.game.add.text(
      this.game.width / 1.35,
      290 * TetraBloc.RATIO_ECRAN.vertical,
      "Score:  " + this.score,
      leStyle
    );
    this.scoreTxt.anchor.set(0, 0);
    this.niveauTxt = this.game.add.text(
      this.game.width / 1.35,
      330 * TetraBloc.RATIO_ECRAN.vertical,
      "Niveau: " + this.niveau,
      leStyle
    );
    this.niveauTxt.anchor.set(0, 0);
    this.tempsTxt = this.game.add.text(
      this.game.width / 1.35,
      370 * TetraBloc.RATIO_ECRAN.vertical,
      "Temps:  " + this.tempsEcoule,
      leStyle
    );
    this.tempsTxt.anchor.set(0, 0);

    //affecter les paramètre du mode
    this.affecterMode();

    //Placer les images
    this.creerJeu();

    //Placer les boutons si mobile
    if (!this.game.device.desktop) {
      this.creerBoutons();
    }

    //Partir la minuterie pour le temps du jeu
    this.game.time.events.loop(Phaser.Timer.SECOND, this.augmenterTemps, this);

    //créer un bloc
    this.creerUnBloc();

    //jouer la musique
    this.laMusique.loop = true;
    this.laMusique.play();
  },

  //fonction update de phaser
  update: function () {
    //le nombre de seconde depuis le début du jeu
    this.leTemps = this.game.time.totalElapsedSeconds();

    //s'il y a un bloc actif, on peut le déplacer
    if (this.blocActif) {
      //bouger à gauche
      if (this.lesFleches.left.isDown) {
        this.bougerGauche();
      }
      //bouger à droite
      if (this.lesFleches.right.isDown) {
        this.bougerDroite();
      }
      //bouger vers le bas
      if (this.lesFleches.down.isDown) {
        this.bougerBas();
      }
    }
    //faire une rotation en appuyant sur la touche Z
    this.toucheRotation.onDown.add(this.faireRotation, this);

    //on met la pièce en réserve quand on appuie sur SHIFT
    this.toucheMettreEnReserve.onDown.add(this.mettreEnReserve, this);

    //on met le jeu sur pause quand on appuie sur la touche P
    this.touchePause.onDown.add(this.mettreSurPause, this);
  },

  //fonction pour mettre le jeu sur pause
  mettreSurPause: function () {
    //changer l'état de la partie
    this.blocActif = !this.blocActif;
    //si la partie n'est pas en cours
    if (!this.blocActif) {
      //ajouter image, texte et changer la couleur de fond, selon le type d'appareil (mobile ou desktop)
      document.body.style.backgroundColor = "#e7baf7";
      if (this.game.device.desktop) {
        this.objetPause.panneau = this.game.add.sprite(0, 0, "fondInstruction");
        this.objetPause.texte = this.game.add.text(
          this.game.width / 2,
          this.game.height / 2,
          "Jeu sur pause. \nAppuyer sur 'P' pour continuer la partie",
          {
            font: "25px Monospace",
            fill: "white",
            align: "center",
          }
        );
      } else {
        this.objetPause.panneau = this.game.add.button(
          0,
          0,
          "fondInstruction",
          this.mettreSurPause,
          this,
          0
        );
        this.objetPause.panneau.scale.set(
          TetraBloc.RATIO_ECRAN.horizontal,
          TetraBloc.RATIO_ECRAN.vertical
        );
        var laPolice =
          Math.round(30 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
        this.objetPause.texte = this.game.add.text(
          this.game.width / 2,
          this.game.height / 2,
          "Jeu sur pause. \nToucher l'écran \npour continuer la partie.",
          {
            font: laPolice,
            fill: "white",
            align: "center",
          }
        );
      }
      this.objetPause.texte.anchor.set(0.5);
    } else {
      //remettre la couleur de fond original
      document.body.style.backgroundColor = Phaser.Color.getWebRGB(
        this.game.stage.backgroundColor
      );
      //on détruit les objets
      this.objetPause.panneau.destroy();
      this.objetPause.texte.destroy();
    }
  },

  //fonction pour bouger à gauche
  bougerGauche: function () {
    this.jouerSonClique();
    //si le test de collision est true et qu'un mouvement n'as pas été effectué dans l'intervale donné
    if (
      this.testerCollision(0, -1) &&
      this.leTemps > this.prochaineAction + this.freqTemp
    ) {
      //actualiser les blocs
      this.actualiserBloc(false, true, false, true);
      //incrementer l'intervale
      this.prochaineAction = this.game.time.totalElapsedSeconds();
    }
  },
  //fonction pour bouger à droite
  bougerDroite: function () {
    this.jouerSonClique();
    //si le test de collision est true et qu'un mouvement n'as pas été effectué dans l'intervale donné
    if (
      this.testerCollision(9, 1) &&
      this.leTemps > this.prochaineAction + this.freqTemp
    ) {
      //actualiser les blocs
      this.actualiserBloc(false, false, true, true);
      //incrementer l'intervale
      this.prochaineAction = this.game.time.totalElapsedSeconds();
    }
  },
  //fonction pour bouger vers le bas
  bougerBas: function () {
    this.jouerSonClique();
    //si un mouvement n'as pas été effectué dans l'intervale donné
    if (this.leTemps > this.prochaineAction + this.freqTemp) {
      //faire tomber le bloc
      this.faireTomberBloc();
      //incrementer l'intervale
      this.prochaineAction = this.game.time.totalElapsedSeconds();
    }
  },
  //fonction pour jouer le son de clique en bougeant la pièce (mobile seulement);
  jouerSonClique: function () {
    if (!this.game.device.desktop) {
      var leSon = this.game.add.audio("clique").play();
    }
  },

  //fonction pour mettre les paramètres du mode choisi
  affecterMode: function () {
    //assigner selon le mode choisi
    switch (TetraBloc.mode) {
      case 0:
        //temps limite, pas de limitie de niveau
        this.tempsLimite = true;
        this.niveauLimite = false;
        //on change le background
        this.game.stage.backgroundColor = 0xf2faff;
        document.body.style.backgroundColor = "#F2FAFF";
        //on initialise la vitesse du jeu
        this.vitesse = 2;
        break;
      case 1:
        //pas temps limite, limitie de niveau
        this.tempsLimite = false;
        this.niveauLimite = true;
        //on initialise la vitesse du jeu
        this.vitesse = 2;
        //on change le background
        this.game.stage.backgroundColor = 0xfef4e1;
        document.body.style.backgroundColor = "#FEF4E1";
        break;
      case 2:
        //pas temps limite, limitie de niveau
        this.tempsLimite = false;
        this.niveauLimite = true;
        //on initialise la vitesse du jeu
        this.vitesse = 10;
        //on change le background
        this.game.stage.backgroundColor = 0xf8d7d7;
        document.body.style.backgroundColor = "#F8D7D7";
        break;
      default:
        return;
    }
  },

  //fonction pour créer les sprites et les matrices
  creerJeu: function () {
    var posX, posY, laCase, laProchaineCase, laCaseReserve;

    //pour créer les tableaux et instancier les sprites
    for (var i = 0; i < TetraBloc.NB_BLOCS_PAR_COLONNES; i++) {
      //créer les rangées
      this.lesCases.push([]);
      this.tableauJeu.push([]);
      if (i < 4) {
        //prochaine pièce
        this.tableauProchainePiece.push([]);
        this.lesCasesProchainePieces.push([]);
        //pièce en réserve
        this.lesCasesPieceEnReserve.push([]);
        this.tableauPieceEnReserve.push([]);
      }

      for (var j = 0; j < TetraBloc.NB_BLOCS_PAR_RANGEES; j++) {
        //définir la position de la case
        posY =
          Math.floor(i + j / TetraBloc.NB_BLOCS_PAR_COLONNES) *
          TetraBloc.TAILLE_IMG *
          TetraBloc.RATIO_ECRAN.vertical;
        posX =
          (j % TetraBloc.NB_BLOCS_PAR_RANGEES) *
          (TetraBloc.TAILLE_IMG * TetraBloc.RATIO_ECRAN.horizontal);

        //pour les éléments de la prochaine pièce (matrice et sprite)
        if (i < 4 && j < 4) {
          //le tableauProchainePiece est 4x4

          //mettre la valeur d'une case vide dans la matrice
          this.tableauProchainePiece[i].push(0);
          this.tableauPieceEnReserve[i].push(0);
          //mettre la case (sprite) dans le tableau des cases
          laProchaineCase = this.game.add.sprite(
            posX + 470 * TetraBloc.RATIO_ECRAN.horizontal,
            posY + 93 * TetraBloc.RATIO_ECRAN.vertical,
            "bloc",
            1
          );
          laProchaineCase.scale.set(
            TetraBloc.RATIO_ECRAN.horizontal,
            TetraBloc.RATIO_ECRAN.vertical
          );
          this.lesCasesProchainePieces[i][j] = laProchaineCase;
          //pour le tableau pièce réserve
          laCaseReserve = this.game.add.sprite(
            posX + 470 * TetraBloc.RATIO_ECRAN.horizontal,
            posY + 450 * TetraBloc.RATIO_ECRAN.vertical,
            "bloc",
            1
          );
          laCaseReserve.scale.set(
            TetraBloc.RATIO_ECRAN.horizontal,
            TetraBloc.RATIO_ECRAN.vertical
          );
          this.lesCasesPieceEnReserve[i][j] = laCaseReserve;
        }

        //pour les éléments principal du jeu (matrice et sprite)
        if (i >= 4) {
          //on ne met pas de sprite au 4 première rangées car elles ne sont pas visible

          //mettre la case (sprite) dans le tableau des cases
          laCase = this.game.add.sprite(
            posX + 75 * TetraBloc.RATIO_ECRAN.horizontal,
            posY - 84 * TetraBloc.RATIO_ECRAN.vertical,
            "bloc",
            1
          );
          laCase.scale.set(
            TetraBloc.RATIO_ECRAN.horizontal,
            TetraBloc.RATIO_ECRAN.vertical
          );
          this.lesCases[i][j] = laCase;
        }
        //mettre la valeur d'une case vide dans la matrice
        this.tableauJeu[i].push(0);
      }
    }
  },

  //fonction pour créer les boutons de contrôle
  creerBoutons: function () {
    //le bouton gauche
    var leBoutonGauche = this.game.add.button(
      this.game.width / 6,
      this.game.height / 1.135,
      "flecheBtn",
      this.bougerGauche,
      this,
      1,
      1,
      1,
      1
    );
    leBoutonGauche.anchor.set(0.5);
    leBoutonGauche.scale.set(
      TetraBloc.RATIO_ECRAN.moyen,
      TetraBloc.RATIO_ECRAN.moyen
    );

    //le bouton vers le bas
    var leBoutonBas = this.game.add.button(
      this.game.width / 2.5,
      this.game.height / 1.07,
      "flecheBtn",
      this.bougerBas,
      this,
      0,
      0,
      0,
      0
    );
    leBoutonBas.anchor.set(0.5);
    leBoutonBas.scale.set(
      TetraBloc.RATIO_ECRAN.moyen,
      TetraBloc.RATIO_ECRAN.moyen
    );

    //le bouton droite
    var leBoutonDroite = this.game.add.button(
      this.game.width / 1.6,
      this.game.height / 1.135,
      "flecheBtn",
      this.bougerDroite,
      this,
      2,
      2,
      2,
      2
    );
    leBoutonDroite.anchor.set(0.5);
    leBoutonDroite.scale.set(
      TetraBloc.RATIO_ECRAN.moyen,
      TetraBloc.RATIO_ECRAN.moyen
    );

    //bouton pour faire une rotation
    var leBoutonRotation = this.game.add.button(
      this.game.width / 1.18,
      this.game.height / 1.35,
      "flecheBtn",
      this.faireRotation,
      this,
      3,
      3,
      3,
      3
    );
    leBoutonRotation.anchor.set(0.5);
    leBoutonRotation.scale.set(
      TetraBloc.RATIO_ECRAN.moyen,
      TetraBloc.RATIO_ECRAN.moyen
    );

    //bouton pour mettre en réserve
    var leBoutonReserve = this.game.add.button(
      this.game.width / 1.18,
      this.game.height / 1.83,
      "flecheBtn",
      this.mettreEnReserve,
      this,
      4,
      4,
      4,
      4
    );
    leBoutonReserve.anchor.set(0.5);
    leBoutonReserve.scale.set(
      TetraBloc.RATIO_ECRAN.moyen,
      TetraBloc.RATIO_ECRAN.moyen
    );

    //bouton pour mettre le jeu en pause
    var leBoutonPause = this.game.add.button(
      75 * TetraBloc.RATIO_ECRAN.horizontal,
      57 * TetraBloc.RATIO_ECRAN.vertical,
      "pause",
      this.mettreSurPause,
      this,
      0
    );
    leBoutonPause.anchor.set(0, 0);
    leBoutonPause.scale.set(
      TetraBloc.RATIO_ECRAN.horizontal,
      TetraBloc.RATIO_ECRAN.vertical
    );
    leBoutonPause.alpha = 0;
  },

  //fonction pour créer un bloc
  creerUnBloc: function (utiliserReserve) {
    //variable de la forme
    var nbFormeChoisi;
    //si on utilise pas une pièce en réserve
    if (!utiliserReserve) {
      if (this.laProchainePiece == null) {
        //s'il n'y a pas encore de prochaine pièce, on attribut un chiffre au hasard
        nbFormeChoisi = Math.floor(Math.random() * 7 + 1);
      } else {
        //s'il y a une prochaine pièce, on définit celle-ci comme la nouvelle
        nbFormeChoisi = this.laProchainePiece;
        //réinitialiser le tableau prochaine pièce
        this.reinitialiserMatrice(this.tableauProchainePiece);
      }
      //on choisit au hasard la prochaine pièce
      this.laProchainePiece = Math.floor(Math.random() * 7 + 1);
      //on assigne la forme à la prochaine pièce
      this.assignerLaForme(this.laProchainePiece, true);
      //on met le chffre de la piece choisi dans une variable pour y accèder plus tard
      this.etatPiece = nbFormeChoisi;
      //si on utilise la pièce en réserve
    } else {
      nbFormeChoisi = this.laPieceMettreEnJeu;
      this.etatPiece = nbFormeChoisi;
    }
    //on assigne la forme à la pièce en cours
    this.assignerLaForme(nbFormeChoisi);
    //on met la forme choisi dans la matrice du jeu
    for (var i = 0; i < 4; i++) {
      this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] = nbFormeChoisi;
    }
    //on met la prochaine pièce dans la matrice de la prochaine pièce, mais avec un décallage en x et y
    for (var i = 0; i < 4; i++) {
      var position = 2;
      if (this.laProchainePiece == 1) {
        position = 3;
      }
      this.tableauProchainePiece[this.laProchaineForme[i][0] - 2][
        this.laProchaineForme[i][1] - position
      ] = this.laProchainePiece;
    }
    //on met un listener sur la pièce pour qu'elle tombe
    this.laBoucleTemps = this.game.time.events.loop(
      Phaser.Timer.SECOND / this.vitesse,
      this.faireTomberBloc,
      this
    );
    //on met à jour les sprites
    this.actualiserSprite();
    //on met à jour la matrice de la prochaine pièce
    this.actualiserSprite(true, false, 4, 4);
  },

  //fonction pour assigner une forme selon le chiffre dans la matrice
  assignerLaForme: function (nbForme, prochainePiece, reservePiece) {
    var uneForme;
    switch (nbForme) {
      case 1:
        //forme du |
        uneForme = [
          [4, 3],
          [4, 4],
          [4, 5],
          [4, 6],
        ];
        break;
      case 2:
        //forme du carré
        uneForme = [
          [3, 3],
          [3, 4],
          [4, 3],
          [4, 4],
        ];
        break;
      case 3:
        //forme du T
        uneForme = [
          [3, 3],
          [4, 4],
          [3, 5],
          [3, 4],
        ];
        break;
      case 4:
        //forme du S
        uneForme = [
          [4, 3],
          [4, 4],
          [3, 5],
          [3, 4],
        ];
        break;
      case 5:
        //forme du Z
        uneForme = [
          [3, 3],
          [4, 4],
          [4, 5],
          [3, 4],
        ];
        break;
      case 6:
        //forme du L
        uneForme = [
          [3, 3],
          [4, 3],
          [4, 5],
          [4, 4],
        ];
        break;
      case 7:
        //forme du J (L inversé)
        uneForme = [
          [4, 3],
          [4, 5],
          [3, 5],
          [4, 4],
        ];
        break;
    }
    //s'il s'agit de la prochaine pièce
    if (prochainePiece) {
      this.laProchaineForme = uneForme;
      //si c'est la pièce en cours
    } else if (reservePiece) {
      this.reserveForme = uneForme;
    } else {
      this.laForme = uneForme;
    }
  },

  //fonction pour mettre à jour les sprites du jeu et de la prochaine pièce
  actualiserSprite: function (
    prochainePieceAjour,
    pieceReserveAJour,
    nbColonnes,
    nbRanges
  ) {
    var typeCase, laCase;

    //premiereLigne est la ligne où le tableau commence réellement(pour le jeu principal, les 4 premiere lignes ne sont pas visibles)
    var premiereLigne = 0;

    //si on ne passe en param le nbColonnes et nbRanges, il s'agit d'élément du tableau principal
    if (nbColonnes == undefined && nbRanges == undefined) {
      nbColonnes = TetraBloc.NB_BLOCS_PAR_COLONNES;
      nbRanges = TetraBloc.NB_BLOCS_PAR_RANGEES;
      premiereLigne = 4;
    }
    //mettre à jour une matrice
    for (var i = premiereLigne; i < nbColonnes; i++) {
      for (var j = 0; j < nbRanges; j++) {
        //si true, c'est la matrice de la prochaine piece
        if (prochainePieceAjour) {
          typeCase = this.tableauProchainePiece[i][j];
          laCase = this.lesCasesProchainePieces[i][j];
          //sinon, on regarde si c'est la pièce reserve
        } else if (pieceReserveAJour) {
          typeCase = this.tableauPieceEnReserve[i][j];
          laCase = this.lesCasesPieceEnReserve[i][j];

          //sinon, c'est la matrice principale du jeu
        } else {
          typeCase = this.tableauJeu[i][j];
          laCase = this.lesCases[i][j];
        }
        //attribut le bon frame et tint selon la valeur d'une case d'une matrice
        //si la case est == X, elle représente un bloc qui tombe. XX signifie un bloc qui est arrêté
        switch (typeCase) {
          case 0:
            //si la frame n'est pas déja == 1
            if (laCase.frame != 1) {
              laCase.frame = 1;
              laCase.tint = 0xffffff;
            }
            break;
          case 11:
          case 1:
            laCase.frame = 0;
            laCase.tint = this.I_BLOC_COULEUR;
            break;
          case 12:
          case 2:
            laCase.frame = 0;
            laCase.tint = this.O_BLOC_COULEUR;
            break;
          case 13:
          case 3:
            laCase.frame = 0;
            laCase.tint = this.T_BLOC_COULEUR;
            break;
          case 14:
          case 4:
            laCase.frame = 0;
            laCase.tint = this.S_BLOC_COULEUR;
            break;
          case 15:
          case 5:
            laCase.frame = 0;
            laCase.tint = this.Z_BLOC_COULEUR;
            break;
          case 16:
          case 6:
            laCase.frame = 0;
            laCase.tint = this.J_BLOC_COULEUR;
            break;
          case 17:
          case 7:
            laCase.frame = 0;
            laCase.tint = this.L_BLOC_COULEUR;
            break;
          default:
            if (laCase.frame != 1) {
              laCase.frame = 1;
              laCase.tint = 0xffffff;
            }
        }
      }
    }
  },

  //fonction de vérification de conditions de la matrice du jeu
  verifierMatriceJeu: function () {
    //si un bloc est inactif à la ligne de départ, la partie est fini
    for (var i = 0; i < TetraBloc.NB_BLOCS_PAR_RANGEES; i++) {
      if (this.tableauJeu[TetraBloc.LIGNE_DE_DEPART][i] > 10) {
        this.finJeu();
      }
    }
    //vérifier si on peut détruire une ligne
    var nbBlocSurLigne = 0;
    for (var i = 0; i < TetraBloc.NB_BLOCS_PAR_COLONNES; i++) {
      for (var j = 0; j < TetraBloc.NB_BLOCS_PAR_RANGEES; j++) {
        //Quand une case n'est pas à 0, on augmente le nombre de bloc présent sur cette ligne
        if (this.tableauJeu[i][j] != 0) {
          nbBlocSurLigne += 1;
        }
        //si la rangée est pleine, détruire la ligne
        if (nbBlocSurLigne == TetraBloc.NB_BLOCS_PAR_RANGEES) {
          this.detruireLigne(i);
        }
      }
      //réinitier la variable
      nbBlocSurLigne = 0;
    }
  },

  //fonction pour détruire une ligne
  detruireLigne: function (noLigne) {
    this.game.add.audio("pop").play();
    //on enlève la ligne
    this.tableauJeu.splice(noLigne, 1);
    //on ajoute une ligne vide au début de la matrice
    this.tableauJeu.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //on augmente le score selon le nombre de ligne détruite en même temps
    this.score += 10 + (this.nbLignesDetruitesDunCoup * 10) / 2;
    this.nbLignesDetruitesDunCoup += 1;
    //on incrémente le nombre total de ligne détruite
    this.nbLignesDetruitesTotal += 1;

    //la couleur de l'étoile
    var couleurEtoile;
    //selon le nombre de ligne détruite
    switch (this.nbLignesDetruitesDunCoup) {
      case 1:
        couleurEtoile = 0xe5e500;
        break;
      case 2:
        couleurEtoile = 0xd9b315;
        break;
      case 3:
        couleurEtoile = 0xf0a814;
        break;
      case 4:
        couleurEtoile = 0xb81414;
        break;
    }
    //instacier l'étoile
    new window.AnimEtoile(
      this.game,
      this.game.width / 8,
      this.lesCases[noLigne][0].y + 20 * TetraBloc.RATIO_ECRAN.vertical,
      0x000000,
      couleurEtoile
    );

    //À chaque 10 lignes détruite, on augemente le niveau et la vitesse de descente des blocs
    if (
      this.nbLignesDetruitesTotal >= 10 &&
      this.nbLignesDetruitesTotal % 10 == 0
    ) {
      this.niveau++;
      this.niveauTxt.text = "Niveau: " + this.niveau;
      this.vitesse += 0.5;
      this.game.add.audio("niveau").play();
      //on affiche le niveau dans l'écran
      var laPolice =
        "bold " + Math.round(50 * TetraBloc.RATIO_ECRAN.moyen) + "px Monospace";
      var style = { font: laPolice, fill: "darkred", align: "center" };
      new window.ExplosionPoint(
        this.game,
        this.game.width / 2.5,
        this.game.height / 3,
        this.niveauTxt.text,
        style
      );
    }
    //on met à jour le score
    this.scoreTxt.text = "Score: " + this.score;
    //on met à jour la matrice du jeu
    this.actualiserSprite();
    //s'il y a une condition de victoire
    if (this.niveauLimite) {
      //si la limite est atteint, on arrête le jeu
      if (this.niveau === TetraBloc.NB_NIVEAUX_POUR_GAGNER) {
        this.finJeu();
      }
    }
  },

  //fonction de la fin du jeu
  finJeu: function () {
    this.laMusique.stop();
    this.game.state.start("ecranFinJeu", true, false, this.score);
  },

  //fonction pour incrémenter le temps
  augmenterTemps: function () {
    if (this.blocActif) {
      this.tempsEcoule++;
      this.tempsTxt.text = "Temps:  " + this.tempsEcoule;
      //s'il y a un temps limite et que le temps actuel est égal à cette limite
      if (this.tempsLimite && this.tempsEcoule == TetraBloc.TEMPS_LIMITE) {
        //on arrête la partie
        this.finJeu();
      }
      //on affiche un compte à rebourd quand il reste moins de 10 secondes à jouer
      if (this.tempsLimite && 10 > TetraBloc.TEMPS_LIMITE - this.tempsEcoule) {
        var tempsRestant = TetraBloc.TEMPS_LIMITE - this.tempsEcoule;
        var laPolice =
          "bold " + Math.round(60 * TetraBloc.RATIO_ECRAN.moyen) + "px Arial";
        var style = { font: laPolice, fill: "darkred", align: "center" };
        new window.ExplosionPoint(
          this.game,
          this.game.width / 2.5,
          this.game.height / 3,
          tempsRestant,
          style
        );
      }
    }
  },

  //fonction pour desactiver le bloc qui tombe
  desactiverBloc: function (utiliseReserve) {
    //on enlève le listener
    this.game.time.events.remove(this.laBoucleTemps);
    //réinitie la rotation
    this.etatRotation = 0;
    //le bloc n'est plus actif
    this.blocActif = false;

    //vérifier la matrice du jeu
    this.verifierMatriceJeu();

    //bloc devient actif
    this.blocActif = true;
    //si la fonction réserve a été utilisé et qu'il y a une pièce en réserve
    if (utiliseReserve && this.laPieceMettreEnJeu != null) {
      //créer un nouveau bloc avec la pièce en reserve
      this.creerUnBloc(true);
      //on crée un nouveau bloc
    } else {
      this.creerUnBloc();
    }
    //réinitialiser le nombre de ligne détruite d'un coup
    this.nbLignesDetruitesDunCoup = 0;
    if (!utiliseReserve) {
      this.reserveUtilise = false;
    }
  },

  //fonction pour controler la descente des blocs
  faireTomberBloc: function () {
    //si le bloc est actif
    if (this.blocActif) {
      //si le bloc ne touche pas la dernière rangée
      if (
        this.laForme[0][0] != TetraBloc.NB_BLOCS_PAR_COLONNES - 1 &&
        this.laForme[3][0] != TetraBloc.NB_BLOCS_PAR_COLONNES - 1 &&
        this.laForme[2][0] != TetraBloc.NB_BLOCS_PAR_COLONNES - 1 &&
        this.laForme[1][0] != TetraBloc.NB_BLOCS_PAR_COLONNES - 1
      ) {
        for (var i = 0; i < 4; i++) {
          //si le bloc en dessous est un bloc inactif, on rend les blocs actuelles inactif
          if (
            this.tableauJeu[this.laForme[i][0] + 1][this.laForme[i][1]] > 10 &&
            this.etatPiece < 10
          ) {
            this.etatPiece = parseInt("1" + "" + this.etatPiece);
          }
        }
        //si l'état de la pièce a changé
        if (this.etatPiece > 10) {
          for (var i = 0; i < 4; i++) {
            //on met la nouvelle valeur de la pièce à sa position
            this.tableauJeu[this.laForme[i][0]][
              this.laForme[i][1]
            ] = this.etatPiece;
          }
          //on désactive le bloc
          this.desactiverBloc();
          //on sort de la fonction
          return;
        }
        //sinon, la pièce tombe et on actualise sa position
        this.actualiserBloc(true, false, false, true);
      } else {
        for (var i = 0; i < 4; i++) {
          //si le bloc touche la dernière changé, on change son état pour inactif
          this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] =
            this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] + 10;
        }
        //on désactive le bloc
        this.desactiverBloc();
      }
    }
  },

  //fonction pour actualiser le bloc lorsqu'il bouge
  actualiserBloc: function (faireTomber, faireBougerGauche, faireBougerDroite) {
    for (var i = 0; i < 4; i++) {
      //on enlève les blocs de leur position actuelle de la matrice
      this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] = 0;

      //incrémentation de 1 selon la modification à appliquer
      if (faireTomber) {
        this.laForme[i][0] += 1;
      }
      if (faireBougerDroite) {
        this.laForme[i][1] += 1;
      }
      if (faireBougerGauche) {
        this.laForme[i][1] -= 1;
      }
    }
    for (var i = 0; i < 4; i++) {
      //on met la valeur des blocs à leur nouvelle position dans la matrice
      this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] = this.etatPiece;
    }
    //on met les sprites à jour
    this.actualiserSprite();
  },

  //fonction pour faire des tests de collisions (gacuhe/droite)
  testerCollision: function (nbLimite, nbDirection) {
    for (var i = 0; i < 4; i++) {
      //limite vers la gauche
      if (nbLimite == 0) {
        if (this.laForme[i][1] - 1 < nbLimite) {
          return false;
        }
      }

      //limite vers la droite
      if (nbLimite > 0) {
        if (this.laForme[i][1] + 1 > nbLimite) {
          return false;
        }
      }

      //tester s'il y a un bloc à gauche ou à droite (selon nbDirection)
      if (
        this.tableauJeu[this.laForme[i][0]][
          this.laForme[i][1] + 1 * nbDirection
        ] > 10
      ) {
        return false;
      }
    }
    //s'il ne rencontre pas de collision, on retourne true
    return true;
  },

  //fonction pour faire une rotation avec la pièce active
  faireRotation: function () {
    if (this.blocActif) {
      this.game.add.audio("clique").play();
      //la pièce 2 (le carré) n'a pas de rotation
      if (this.etatPiece == 2) {
        return;
      }
      //on va chercher les données de la rotation à effectué
      var valeurRotation = this.objetRotations.getValeurRotation(
        this.etatPiece
      );
      //nombre de bloc de la pièce qui bouge durant la rotation
      var nbBlocsDansPiece = 3;

      //dans la pièce I, les 4 blocs bougent
      if (this.etatPiece == 1) {
        nbBlocsDansPiece = 4;
      }
      //la position initiale de chaque bloc est mise à 0
      for (var i = 0; i < 4; i++) {
        this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] = 0;
      }

      //si la condition est vrai, on fait la rotation
      var condition = this.testerCollisionRotation(
        valeurRotation,
        nbBlocsDansPiece
      );
      if (condition) {
        //on applique la rotation à la forme
        for (i = 0; i < nbBlocsDansPiece; i++) {
          this.laForme[i][0] += valeurRotation[this.etatRotation][0][i];
          this.laForme[i][1] += valeurRotation[this.etatRotation][1][i];
        }
        //on incrémente la rotation
        this.etatRotation += 1;
      }
      //lorsque la rotation est à 4, on la remet à 0
      if (this.etatRotation == 4) {
        this.etatRotation = 0;
      }

      //on applique les modification dans la matrice du jeu
      for (var i = 0; i < 4; i++) {
        this.tableauJeu[this.laForme[i][0]][
          this.laForme[i][1]
        ] = this.etatPiece;
      }
      //on met à jour le tableau de sprite
      this.actualiserSprite();
    }
  },

  //réinitie le tableau passé en paramètre
  reinitialiserMatrice: function (leTableau) {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        //pour réinitialiser le tableau
        leTableau[i][j] = 0;
      }
    }
  },

  //fonction pour mettre une pièce en réserve
  mettreEnReserve: function () {
    if (this.blocActif) {
      //on fait jouer le son clique
      this.game.add.audio("clique").play();
      //si la fonction n'a pas encore été utilisé dans ce cycle
      if (this.reserveUtilise == false) {
        //on ne peut plus utiliser la fonction pour le cycle en cours
        this.reserveUtilise = true;
        //mettre la pièce en réserve en jeu
        this.laPieceMettreEnJeu = this.laPieceEnReserve;
        //mettre la pièce en jeu en réserve
        this.laPieceEnReserve = this.etatPiece;
        //on enlève les blocs de leur position actuelle de la matrice
        for (var i = 0; i < 4; i++) {
          this.tableauJeu[this.laForme[i][0]][this.laForme[i][1]] = 0;
        }
        //réinitialiser le tableau de la pièce en réserve
        this.reinitialiserMatrice(this.tableauPieceEnReserve);
        //on assiagne la pièce en reserve
        this.assignerLaForme(this.etatPiece, false, true);
        //on met la prochaine pièce dans la matrice de la pièce en reserve, mais avec un décallage en x et y
        for (var i = 0; i < 4; i++) {
          var position = 2;
          if (this.etatPiece == 1) {
            position = 3;
          }
          this.tableauPieceEnReserve[this.reserveForme[i][0] - 2][
            this.reserveForme[i][1] - position
          ] = this.etatPiece;
        }
        //on met à jour les sprites
        this.actualiserSprite(false, true, 4, 4);
        //desactiver le bloc qui tombe
        this.desactiverBloc(true);
      }
    }
  },

  //fonction pour faire des tests de collisions durant les rotations
  testerCollisionRotation: function (valeurRotation, nbBlocsDansPiece) {
    //s'il n'y a pas de bonne valeur de rotation, on retourne false
    if (valeurRotation == undefined) {
      return false;
    }
    //faire des tableaux temporaires
    var tableauJeuTemp = JSON.parse(JSON.stringify(this.tableauJeu));
    var laFormeTemp = JSON.parse(JSON.stringify(this.laForme));

    //pour chaque bloc qui effectue une rotation, on lui ajoute sa nouvelle valeur dans le tableau temporaire
    for (var i = 0; i < nbBlocsDansPiece; i++) {
      laFormeTemp[i][0] += valeurRotation[this.etatRotation][0][i];
      laFormeTemp[i][1] += valeurRotation[this.etatRotation][1][i];

      //si un des blocss touche à la dernière rangée, on retourne false
      if (laFormeTemp[i][0] >= TetraBloc.NB_BLOCS_PAR_COLONNES) {
        return false;
      }
      //si une collision est détecter ou que la rotation donne une mauvaise valeur, on retourne false
      if (
        tableauJeuTemp[laFormeTemp[i][0]][laFormeTemp[i][1]] > 10 ||
        tableauJeuTemp[laFormeTemp[i][0]][laFormeTemp[i][1]] == undefined
      ) {
        return false;
      }
    }
    //si le test est bon on retourne true
    return true;
  },

  //objet qui contient les valeurs de rotations pour chaque forme
  objetRotations: {
    1: {
      0: [
        [-2, -1, 0, 1],
        [1, 0, -1, -2],
      ],
      1: [
        [1, 0, -1, -2],
        [2, 1, 0, -1],
      ],
      2: [
        [2, 1, 0, -1],
        [-1, 0, 1, 2],
      ],
      3: [
        [-1, 0, 1, 2],
        [-2, -1, 0, 1],
      ],
    },
    3: {
      0: [
        [-1, -1, 1],
        [1, -1, -1],
      ],
      1: [
        [1, -1, -1],
        [1, 1, -1],
      ],
      2: [
        [1, 1, -1],
        [-1, 1, 1],
      ],
      3: [
        [-1, 1, 1],
        [-1, -1, 1],
      ],
    },
    4: {
      0: [
        [-2, -1, 1],
        [0, -1, -1],
      ],
      1: [
        [0, -1, -1],
        [2, 1, -1],
      ],
      2: [
        [2, 1, -1],
        [0, 1, 1],
      ],
      3: [
        [0, 1, 1],
        [-2, -1, 1],
      ],
    },
    5: {
      0: [
        [-1, -1, 0],
        [1, -1, -2],
      ],
      1: [
        [1, -1, -2],
        [1, 1, 0],
      ],
      2: [
        [1, 1, 0],
        [-1, 1, 2],
      ],
      3: [
        [-1, 1, 2],
        [-1, -1, 0],
      ],
    },
    6: {
      0: [
        [0, 1, -1],
        [2, 1, -1],
      ],
      1: [
        [2, -1, 1],
        [0, 1, -1],
      ],
      2: [
        [0, 1, -1],
        [-2, -1, 1],
      ],
      3: [
        [-2, -1, 1],
        [0, -1, 1],
      ],
    },
    7: {
      0: [
        [-1, 1, 2],
        [1, -1, 0],
      ],
      1: [
        [1, -1, 0],
        [1, -1, -2],
      ],
      2: [
        [1, -1, -2],
        [-1, 1, 0],
      ],
      3: [
        [-1, 1, 0],
        [-1, 1, 2],
      ],
    },
    //retourne les données de la rotation
    getValeurRotation: function (etatPiece) {
      return this[etatPiece];
    },
  },
};
