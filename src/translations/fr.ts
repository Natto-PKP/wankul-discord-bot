export default {
  register: {
    body: {
      name: 'enregistrement',
      description: 'Tu t\'enregistre en tant que nouvel utilisateur',
    },

    success: '🫰 `| ` Tu es maintenant enregistré',
    alreadyRegistered: 'Tu es déjà enregistré !',
  },

  profile: {
    body: {
      name: 'profil',
      description: 'Affiche ton profil',
      options: {
        user: {
          name: 'utilisateur',
          description: 'L\'utilisateur dont tu veux afficher le profil',
        },
      },
    },

    notRegistered: 'L\'utilisateur n\'est pas enregistré',
  },

  match: {
    body: {
      name: 'match',
      description: 'Affiche le match',
    },

    record: {
      body: {
        name: 'enregistrement',
        description: 'Enregistre un match entre toi et un autre utilisateur',
        options: {
          player: {
            name: 'joueur',
            description: 'Le joueur que tu as défié',
          },
          state: {
            name: 'issue',
            description: 'L\'issue du match',
            choices: {
              win: 'Victoire',
              loose: 'Défaite',
              draw: 'Match nul',
            },
          },
          challenger: {
            name: 'challengeur',
            description: 'Le joueur qui a défié',
          },
          winner: {
            name: 'vainqueur',
            description: 'Le vainqueur du match',
          },
          competitive: {
            name: 'compétitif',
            description: 'Le match est-il compétitif ?',
          },
        },
      },

      content: 'Enregistrement d\'un match entre {{player}} et {{user}}...',
      verification: {
        title: 'Vérification',
        competitiveTitle: 'Vérification d\'un match compétitif',
        descriptions: {
          win: '{{opponent}} a t\'il/elle bien perdu.e contre {{challenger}} ?',
          loose: '{{opponent}} a t\'il/elle bien gagné.e contre {{challenger}} ?',
          draw: '{{opponent}} a t\'il/elle bien fait match nul contre {{challenger}} ?',
        },
        footer: {
          single: "L'opponent doit répondre avec oui ou non",
          both: 'Les deux joueurs doivent répondre avec oui ou non',
        },
        components: {
          yes: 'Oui',
          no: 'Non',
        },
      },

      error: 'Une erreur est survenue lors de l\'enregistrement du match',
      cancelled: 'L\'enregistrement du match a été annulé',
      cantRecordYourself: 'Tu ne peux pas enregistrer un match contre toi-même',
      winnerNotInMatch: 'Le vainqueur doit être l\'un des deux joueurs',
      playerNotRegistered: 'Le joueur n\'est pas enregistré',
      userNotRegistered: 'Tu n\'es pas enregistré',
      timeout: 'Le temps de réponse est écoulé',
      registered: 'Le match a été enregistré',
      notRegistered: 'Le match n\'a pas été enregistré',

      success: 'Le match a été enregistré',
      failed: 'Le match n\'a pas été enregistré',
    },

    history: {
      body: {
        name: 'historique',
        description: 'Affiche l\'historique des matchs',
        options: {
          player: {
            name: 'joueur',
            description: 'Le joueur dont tu veux afficher l\'historique',
          },
        },
      },

      list: {
        description: 'Historique des matchs de {{player}}',
        gamesLeft: '{{count}} matchs restants',
        victory: 'Victoire',
        defeat: 'Défaite',
        competitive: 'Compétitif',
        notCompetitive: 'Non compétitif',
        noMatch: 'Aucun match',
        row: '`{{i}}{{statut}}{{competitive}}` contre *{{opponent}}* *`{{date}}`*',
        footer: 'Page {{page}}',
        empty: 'Aucun match à afficher',
        components: {
          previous: 'Précédent',
          next: 'Suivant',
          close: 'Fermer',
          details: 'Détails',
        },
      },

      details: {
        row: '{{i}} {{statut}} contre *{{opponent}}*',
        isCompetitive: 'Match compétitif',
        isNotCompetitive: 'Match non compétitif',
      },

      playerNotRegistered: 'Le joueur n\'est pas enregistré',

    },

    scoreboard: {
      body: {
        name: 'classement',
        description: 'Affiche le classement',
        options: {
          global: {
            name: 'global',
            description: 'Affiche le classement global',
          },
        },
      },
    },
  },
};
