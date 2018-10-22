const conn = require('../components/RightNowConnector');

const test = async () => {
  try {
    if (!conn.initilized) {
      await conn.prepareClient();
    }
    const response1 = await conn.startIntaraction();
    const sessionToken = response1[0].SessionToken;

    // const response2 = await conn.getPopularContent(sessionToken, 'hotel_okada');
    // console.log(response2[0].ContentListResponse.SummaryContents.SummaryContentList);
    //
    const response3 = await conn.getSmartAssistantSearch(sessionToken, 'ATMはありますか', 'hotel_okada')
    console.log(JSON.stringify(response3[0].ContentListResponse.SummaryContents.SummaryContentList[0]));

    // const response4 = await conn.searchContent(sessionToken, 'ATMある？', 'hotel_okada');
    // console.log(response4[0].SearchResponse.SummaryContents.SummaryContentList);

    const response5 = await conn.getContent(sessionToken, 1910);
    console.log(JSON.stringify(response5[0]));

    const response6 = await conn.rateContent(sessionToken, 1910, 1, 1);
    console.log(response6[0]);
  }
  catch (error) {
    console.log(error);
  }
};
test();
