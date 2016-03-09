get('/user/:id/some/:dd', function s111(){
  console.log(111);
})
get('/', function s111(res){
  res.ok({
    name: 'filow'
  })
})
get(/\/users\/\d+/, function s111(res){
  res.ok('haha')
})
