'use strict';

const rightnow  = require('./rightnow');
const striptags = require('striptags');

module.exports = {

  metadata: () => ({
    name: 'rightnow.gettingstarted.ContentDetail',
    properties: {
      'token':         { 'type': 'string', 'required': true },
      'contentId':     { 'type': 'string', 'required': true },
      'contentTitle':  { 'type': 'string', 'required': true },
      'contentDetail': { 'type': 'string', 'required': true }
    },
    supportedActions: [ 'success', 'failure' ]
  }),

  invoke: async (conversation, done) => {
    conversation.logger().info('ContentDetail', 'invoke');

    // Dialog Flow で定義された変数の名前
    let token_name  = conversation.properties().token;
    let id_name     = conversation.properties().contentId;
    let title_name  = conversation.properties().contentTitle;
    let detail_name = conversation.properties().contentDetail;

    // Dialog Flow で定義された変数の値
    let token_value = conversation.variable(token_name);
    let id_value    = conversation.variable(id_name);
    conversation.logger().info('ContentDetail', `Content ID = ${id_value}`);

    try {
      // SOAP Client が準備されているかどうかをチェック
      if (!rightnow.isInitialized()) {
        conversation.logger().info('ContentDetail', 'rightnow.prepareClient()');
        await rightnow.prepareClient();
      }
      // token_value の値がなければ StartInteraction をコールする
      if (!token_value) {
        conversation.logger().info('ContentDetail', 'rightnow.startIntaraction()');
        const response1 = await rightnow.startIntaraction();
        token_value = response1[0].SessionToken;
        conversation.variable(token_name, token_value);
      }
      // GetPopularContent をコールする
      conversation.logger().info('ContentDetail', 'rightnow.getContent()');
      const response2 = await rightnow.getContent(token_value, id_value);
      if (response2[0].Content) {
        conversation.variable(title_name, response2[0].Content.Summary);
        conversation.variable(detail_name, striptags(response2[0].Content.Solution));
      }
      conversation.transition('success');
    }
    catch (error) {
      conversation.logger().error('ContentDetail', error);
      conversation.error(true);
      conversation.transition('failure');
    }
    finally {
      conversation.logger().info('ContentDetail', 'done');
      done();
    }
  }
};
