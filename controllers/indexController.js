const method = require('../methods');

exports.getHome = async (req, res) => {
  const page = req.params.page || 1;
  const pageCount = Math.ceil(await method.countEntry() / 10);
  method.getEntries({}, 10, page).then((entries) => {
    res.render('index', {
      title: 'KodSozluk', 
      user: req.user,
      entries: entries,
      pageCount: pageCount
    });
  });
};

exports.getTerm = async (req, res) => {
  const page = req.params.page || 1;
  const pageCount = Math.ceil(await method.countEntry({title: req.params.title}) / 10);
  method.getEntries({title: req.params.title}, 10, page).then((entries) => {
    res.render('term', {
      title: req.params.title,
      entries: entries,
      pageCount: pageCount
    })
  });
};

exports.postTerm = (req, res) => {
  if (req.user) {    
    method.saveEntry(
      req.params.title, 
      req.body.body, 
      req.user._id
    );
  }
  return res.redirect(req.get('referer'));
}

exports.vote = async (req, res) => {
  const {entryId, rate} = req.body;
  method.vote(entryId, rate, req.user._id).then((data) => {
    return res.send(data.toString());
  });
}

// exports.postSearch = (req, res) => {
//   var query = req.body.query;
//   console.log(query);
//   if (query.length < 4) {
//     console.log(query.length);
//     return res.send([]);
//   }
//   // console.log(res.body.query);
//   const queryRegex = new RegExp(query, 'i');
//   method.getEntries({title: queryRegex}, 5, 1).then((entries) => {
//     return res.send(entries);
//   })
// }