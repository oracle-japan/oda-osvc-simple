'use strict';

const rightnow = require('./rightnow');

module.exports = {

  metadata: () => ({
    name: 'rightnow.gettingstarted.SmartAssistant',
    properties: {
      'token':    { 'type': 'string', 'required': true  },
      'question': { 'type': 'string', 'required': true  },
      'product':  { 'type': 'string', 'required': false },
      'category': { 'type': 'string', 'required': false },
      'answers':  { 'type': 'string', 'required': true  }
    },
    supportedActions: [ 'success', 'failure' ]
  }),

  invoke: async (conversation, done) => {
    conversation.logger().info('SmartAssistant', 'invoke');

    // Dialog Flow で定義された変数の名前
    let token_name    = conversation.properties().token;
    let question_name = conversation.properties().question;
    let product_name  = conversation.properties().product;
    let category_name = conversation.properties().category;
    let answers_name  = conversation.properties().answers;

    // Dialog Flow で定義された変数の値
    let token_value    = conversation.variable(token_name);
    let question_value = conversation.variable(question_name);
    let product_value  = (product_name) ? conversation.variable(product_name) : null;
    let category_value = (category_name) ? conversation.variable(category_name) : null;

    try {
      // SOAP Client が準備されているかどうかをチェック
      if (!rightnow.isInitialized()) {
        conversation.logger().info('SmartAssistant', 'rightnow.prepareClient()');
        await rightnow.prepareClient();
      }
      // token_value の値がなければ StartInteraction をコールする
      if (!token_value) {
        conversation.logger().info('SmartAssistant', 'rightnow.startIntaraction()');
        const response1 = await rightnow.startIntaraction();
        token_value = response1[0].SessionToken;
        conversation.variable(token_name, token_value);
      }
      // GetSmartAssistantSearch をコールする
      conversation.logger().info('SmartAssistant', 'rightnow.getSmartAssistantSearch()');
      const response2 = await rightnow.getSmartAssistantSearch(token_value, question_value, product_value, category_value);
      let answers_value = [];
      if (response2[0].ContentListResponse &&
          response2[0].ContentListResponse.SummaryContents &&
          response2[0].ContentListResponse.SummaryContents.SummaryContentList) {
        if (response2[0].ContentListResponse.SummaryContents.SummaryContentList.length > 0) {
          for (let content of response2[0].ContentListResponse.SummaryContents.SummaryContentList) {
            answers_value.push({
              content_id: content.ID.attributes.id,
              title:      content.Title,
              excerpt:    content.Excerpt
            });
          }
        }
      }
      conversation.variable(answers_name, answers_value);
      conversation.transition('success');
    }
    catch (error) {
      conversation.logger().error('SmartAssistant', error);
      conversation.error(true);
      conversation.transition('failure');
    }
    finally {
      conversation.logger().info('SmartAssistant', 'done');
      done();
    }
  }
};
