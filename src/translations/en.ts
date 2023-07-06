export default {
  register: {
    body: {
      name: 'register',
      description: 'Register as a new user',
    },

    alreadyRegistered: 'You are already registered!',
    success: '🫰 `| ` You are now registered',
  },

  profile: {
    body: {
      name: 'profile',
      description: 'Display your profile',
      options: {
        user: {
          name: 'user',
          description: 'The user whose profile you want to display',
        },
      },
    },

    notRegistered: 'The user is not registered',
  },

  match: {
    body: {
      name: 'match',
      description: 'Display the match',
    },

    record: {
      body: {
        name: 'record',
        description: 'Record a match between you and another user',
        options: {
          player: {
            name: 'player',
            description: 'The player you challenged',
          },
          winner: {
            name: 'winner',
            description: 'The winner of the match',
          },
          competitive: {
            name: 'competitive',
            description: 'Is the match competitive?',
          },
        },
      },

      content: 'Recording a match between {{player}} and {{user}}...',
      verification: {
        title: 'Verification',
        description: '<@{{looser}}>, do you confirm that <@{{winner}}> won the match?',
        components: {
          yes: 'Yes',
          no: 'No',
        },
      },

      error: 'An error occurred while recording the match',
      canceled: 'The match has been canceled',
      cantRecordYourself: 'You can\'t record yourself',
      winnerNotInMatch: 'The winner is not in the match',
      playerNotRegistered: 'The player is not registered',
      userNotRegistered: 'The user is not registered',

      success: 'The match has been recorded',
      failed: 'The match has not been recorded',
    },

    history: {
      body: {
        name: 'history',
        description: 'Display the match history of a user',
        options: {
          player: {
            name: 'player',
            description: 'The player whose match history you want to display',
          },
        },
      },

      list: {
        description: 'Match history of {{player}}',
        victory: 'Victory',
        defeat: 'Defeat',
        competitive: 'Competitive',
        nonCompetitive: 'Non-competitive',
        noMatch: 'No match',
        row: '`{{i}}{{statut}}{{competitive}}` against *{{opponent}}* *`{{date}}`*',
        footer: 'Page {{page}}',
        empty: 'No match to display',
        components: {
          previous: 'Previous',
          next: 'Next',
          close: 'Close',
          details: 'Details',
        },
      },

      details: {
        row: '{{i}} {{statut}} against *{{opponent}}*',
        isCompetitive: 'Competitive match',
        isNotCompetitive: 'Non-competitive match',
      },

      playerNotRegistered: 'The player is not registered',
    },
  },
};
