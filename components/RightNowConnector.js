require('dotenv').config();

// 環境固有の値の読み込み
const RN_HOSTNAME         = process.env.RN_HOSTNAME;
const RN_INTERFACE        = process.env.RN_INTERFACE;
const RN_USERNAME         = process.env.RN_USERNAME;
const RN_PASSWORD         = process.env.RN_PASSWORD;
const RN_APP_ID           = process.env.RN_APP_ID;
const RN_USER_ADDRESS     = process.env.RN_USER_ADDRESS;
const RN_DEFAULT_PRODUCT  = process.env.RN_DEFAULT_PRODUCT;
const RN_DEFAULT_CATEGORY = process.env.RN_DEFAULT_CATEGORY;

// パッケージの読み込み
const soap    = require('soap');
const request = require('request');
const debug   = require('debug')('RightNowConnector');

class RightNowConnector {

  constructor() {
    debug(`constructor`);
    this.initialized = false;
  }

  async prepareClient() {
    debug('prepareClient');
    const wsdl = `https://${RN_HOSTNAME}/cgi-bin/${RN_INTERFACE}.cfg/services/kf_soap?wsdl`;
    debug(`wsdl = ${wsdl}`);
    try {
      this.client = await soap.createClientAsync(wsdl);
      this.client.setSecurity(new soap.WSSecurity(
        RN_USERNAME,
        RN_PASSWORD,
        {
          hasTimeStamp:    false,
          hasTokenCreated: false
        }
      ));
      this.client.addSoapHeader(
        {
          ClientInfoHeader: {
            AppID : RN_APP_ID
          }
        },
        '',
        'rnm_v1'
      );
      this.initialized = true;
      debug('SOAP Client initialized');
    }
    catch (error) {
      throw error;
    }
  }

  async startIntaraction() {
    debug('startIntaraction')
    try {
      return await this.client.StartInteractionAsync({
        AppIdentifier: RN_APP_ID,
        UserIPAddress: RN_USER_ADDRESS
      });
    }
    catch (error) {
      throw error;
    }
  }

  async getPopularContent(sessionToken, product = RN_DEFAULT_PRODUCT, category = RN_DEFAULT_CATEGORY, limit = 10) {
    debug('getPopularContent');
    debug(`product = ${product}`);
    debug(`category = ${category}`);
    debug(`limit = ${limit}`);
    try {
      return await this.client.GetPopularContentAsync({
        '$xml': `<SessionToken>${sessionToken}</SessionToken>
          <ContentSearch>${_buildFilters(product, category)}</ContentSearch>
          <Limit>${limit}</Limit>`
      });
    }
    catch (error) {
      throw error;
    }
  }

  async getSmartAssistantSearch(sessionToken, searchBody, product = RN_DEFAULT_PRODUCT, category = RN_DEFAULT_CATEGORY, limit = 10) {
    debug('getSmartAssistantSearch');
    debug(`product = ${product}`);
    debug(`searchBody = ${searchBody}`);
    debug(`category = ${category}`);
    debug(`limit = ${limit}`);
    try {
      return await this.client.GetSmartAssistantSearchAsync({
        '$xml': `<SessionToken>${sessionToken}</SessionToken>
          <Body>${searchBody}</Body>
          <Subject>bot_express</Subject>
          <ContentSearch>${_buildFilters(product, category)}</ContentSearch>
          <Limit>${limit}</Limit>`
      });
    }
    catch (error) {
      throw error;
    }
  }

  async searchContent(sessionToken, searchTerms, product = RN_DEFAULT_PRODUCT, category = RN_DEFAULT_CATEGORY, limit = 10) {
    debug('searchContent');
    debug(`searchTerms = ${searchTerms}`);
    debug(`product = ${product}`);
    debug(`category = ${category}`);
    debug(`limit = ${limit}`);
    try {
      let filters;
      if (!product && !category) {
        filters = '<Filters xsi:nil="true"/>';
      }
      else {
        filters = '<Filters xsi:nil="true">';
        if (product) {
          filters += `<ContentFilterList xsi:type="ServiceProductContentFilter">
            <ServiceProduct>
              <rnb_v1_2:Name>${product}</rnb_v1_2:Name>
            </ServiceProduct>
          </ContentFilterList>`;
        }
        if (category) {
          filters += `<ContentFilterList xsi:type="ServiceCategoryContentFilter">
            <ServiceCategory>
              <rnb_v1_2:Name>${category}</rnb_v1_2:Name>
            </ServiceCategory>
          </ContentFilterList>`
        }
        filters = '</Filters>';
      }
      return await this.client.SearchContentAsync({
        '$xml': `<SessionToken>${sessionToken}</SessionToken>
          <SearchTerms>${searchTerms}</SearchTerms>
          ${filters}
          <IncludeRelatedSearches>false</IncludeRelatedSearches>
          <IncludeSpellingSuggestions>false</IncludeSpellingSuggestions>
          <Limit>${limit}</Limit>
          <Start>0</Start>`
      });
    }
    catch (error) {
      throw error;
    }
  }

  async getContent(sessionToken, contentId) {
    debug('getContent');
    debug(`contentId = ${contentId}`);
    try {
      return await this.client.GetContentAsync({
        '$xml': `<SessionToken>${sessionToken}</SessionToken>
          <ContentTemplate xsi:type="rnk_v1_2:AnswerContent">
            <rnb_v1_2:ID id="${contentId}"/>
            <rnk_v1_2:Categories xsi:nil="true"/>
            <rnk_v1_2:CommonAttachments xsi:nil="true"/>
            <rnk_v1_2:FileAttachments xsi:nil="true"/>
            <rnk_v1_2:Keywords xsi:nil="true"/>
            <rnk_v1_2:Products xsi:nil="true"/>
            <rnk_v1_2:Question xsi:nil="true"/>
            <rnk_v1_2:Solution xsi:nil="true"/>
            <rnk_v1_2:ValidNullFields xsi:nil="true"/>
          </ContentTemplate>`
      });
    }
    catch (error) {
      throw error;
    }
  }

  async rateContent(sessionToken, contentId, rate, scale) {
    debug('rateContent');
    debug(`contentId = ${contentId}`);
    debug(`rate = ${rate}`);
    debug(`scale = ${scale}`);
    try {
      return await this.client.RateContentAsync({
        '$xml': `<SessionToken>${sessionToken}</SessionToken>
          <Content xsi:type="rnk_v1_2:AnswerContent">
            <rnb_v1_2:ID id="${contentId}"/>
            <rnk_v1_2:Categories xsi:nil="true"/>
            <rnk_v1_2:CommonAttachments xsi:nil="true"/>
            <rnk_v1_2:FileAttachments xsi:nil="true"/>
            <rnk_v1_2:Keywords xsi:nil="true"/>
            <rnk_v1_2:Products xsi:nil="true"/>
            <rnk_v1_2:Question xsi:nil="true"/>
            <rnk_v1_2:Solution xsi:nil="true"/>
            <rnk_v1_2:ValidNullFields xsi:nil="true"/>
          </Content>
          <Rate>
            <rnb_v1_2:ID id="${rate}"/>
          </Rate>
          <Scale>
            <rnb_v1_2:ID id="${scale}"/>
          </Scale>`
      });
    }
    catch (error) {
      throw error;
    }
  }

}

const _buildFilters = (product = '', category = '') => {
  if (!product && !category) {
    return '<rnk_v1_2:Filters/>'
  }
  else {
    let filters = '<rnk_v1_2:Filters>';
    if (product) {
      filters += `<rnk_v1_2:ContentFilterList xsi:type="rnk_v1_2:ServiceProductContentFilter">
        <rnk_v1_2:ServiceProduct>
          <rnb_v1_2:Name>${product}</rnb_v1_2:Name>
        </rnk_v1_2:ServiceProduct>
      </rnk_v1_2:ContentFilterList>`;
    }
    if (category) {
      filters += `<rnk_v1_2:ContentFilterList xsi:type="rnk_v1_2:ServiceCategoryContentFilter">
        <rnk_v1_2:ServiceCategory>
          <rnb_v1_2:Name>${category}</rnb_v1_2:Name>
        </rnk_v1_2:ServiceCategory>
      </rnk_v1_2:ContentFilterList>`;
    }
    return filters + '</rnk_v1_2:Filters>';
  }
};

const rightnow = new RightNowConnector();

module.exports = rightnow;
