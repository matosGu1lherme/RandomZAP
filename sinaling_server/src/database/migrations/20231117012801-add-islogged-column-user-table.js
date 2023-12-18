'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'users',
      'is_logged',
      {
        type: Sequelize.BOOLEAN
      }
    );
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.removeColumn(
    'users',
    'is_logged',
   );
  }
};
