'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'isLogged',
      {
        type: Sequelize.BOOLEAN
      }
    );
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.removeColumn(
    'users',
    'isLogged',
   );
  }
};
