var yelp = new Yelp({
  consumer_key: '3x6Ac1eOjZ5FCU1J9m5hAA',
  consumer_secret: 'yxNlks3UMm1ivqa_zyX9S8eXtmE',
  token: 'ytPheD8u7xVecoVv3DeJ-iwQa4LiubaG',
  token_secret: 'VfI-hbolHUSFQmQ5IoNTpy8tYdI',
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({ term: 'food', location: 'Montreal' })
.then(function (data) {
  console.log(data);
})
.catch(function (err) {
  console.error(err);
});
