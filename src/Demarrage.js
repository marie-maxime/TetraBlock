////////////////////////////////
//        Demarrage           //
////////////////////////////////

/**
 * Classe permettant de définir l'écran (state)
 * pour ajuster certains paramètres au début du jeu
 */

var TetraBloc = window.TetraBloc;

TetraBloc.Demarrage = function(leJeu) {};

TetraBloc.Demarrage.prototype = {
    init: function() {
        //Ajuster l'échelle du jeu et le centrer dans l'écran
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //Mode pour le plein écran
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Si on est sur un appareil mobile, on va "verrouiller" l'orientation en mode portrait
        //et configurer les ratios
        if (!this.game.device.desktop) {
            this.game.scale.forceOrientation(false, true);
            this.game.scale.enterIncorrectOrientation.add(this.afficherImage, this);
            this.game.scale.leaveIncorrectOrientation.add(this.enleverImage, this);
            TetraBloc.RATIO_ECRAN.horizontal = this.game.width / TetraBloc.RATIO_ECRAN.LARGEUR;
            TetraBloc.RATIO_ECRAN.vertical = this.game.height / TetraBloc.RATIO_ECRAN.HAUTEUR;
            TetraBloc.RATIO_ECRAN.moyen = (TetraBloc.RATIO_ECRAN.horizontal + TetraBloc.RATIO_ECRAN.vertical) / 2;
            TetraBloc.RATIO_ECRAN.minimum = Math.min(TetraBloc.RATIO_ECRAN.horizontal, TetraBloc.RATIO_ECRAN.vertical);
        }

    },

    afficherImage: function() {
        document.getElementById('orientation').style.display = "block";

    },

    enleverImage: function() {
        document.getElementById('orientation').style.display = "none";
    },

    preload: function() {
        //Chargement de la barre de chargement...
        this.game.load.image("barreImg", "medias/img/barreChargement.png");

    },

    create: function() {
        this.game.state.start("chargementMedias");
    }
};
