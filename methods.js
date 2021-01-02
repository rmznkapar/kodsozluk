const Entry = require('./models/Entry');
const Account = require('./models/Account');

const countEntry = async (cond = {}) => {
  return await Entry.count(cond).exec();
}

const findUser = (cond) => {
  return new Promise((resolve) => { 
    Account.findOne(cond).lean().then((user) => {
      resolve(user);
    }).catch(() => {
      resolve(false);
    })
  });
}

const findEntry = (cond) => {
  return new Promise((resolve) => { 
    Entry.findOne(cond).lean().then((entry) => {
      resolve(entry);
    }).catch(() => {
      resolve(false);
    })
  });
}

const setVoteRate = (entryId, rate) => {
  return new Promise((resolve) => {    
    Entry.findByIdAndUpdate(entryId, {$inc: {voteRate: rate}}, {new: true}, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        resolve(docs.voteRate);
      }
    });
  });
}

/**
 * @param {object} cond 
 * @param {int} limit the maximum number of documents the query will return default=10
 * @param {int} page the number of documents to skip default = 1 last = (page-1)*limit
 * @param {boolean} getUser default = true
 */
const getEntries = async (cond = {}, limit = 10, page = 1, getUser = true) => {
  if (page < 1) {
    return [];
  }
  let entries = await Entry.find(cond).sort('-date').limit(limit).skip((page-1)*limit).lean().exec();
  entries = await Promise.all(entries.map(async (entry) => {
    if (getUser) { 
      const user = await findUser({ _id: entry.user});
      entry.user = user;
    }
    return entry;
  }));
  return entries;
}

const saveEntry = (title, body, user) => {
  const entry = new Entry({
    title: title,
    body: body,
    user: user
  });
  entry.save((err) => {
    if (err) {
      console.error(err);
    }
  });
}

const vote = async (entryId, rate, userId) => {
  rate = parseInt(rate);
  if (rate !== 1 && rate !== -1) {
    return;
  }
  let existVote = false;
  const entry = await findEntry({_id: entryId});
  for (let i = 0; i < entry.votes.length; i++) {
    const vote = entry.votes[i];
    if (vote.userId == userId) {
      existVote = vote;
      break;
    } 
  }
  if (existVote) {
    if (rate !== existVote.rate) {
      //user change vote
      await Entry.findOneAndUpdate(
        {_id: entryId, "votes.userId": userId}, 
        {$set: {"votes.$.rate": rate}});
      return await setVoteRate(entryId, rate * 2)
    } else {
      //user same vote 
      await Entry.findByIdAndUpdate(entryId, {$pull: {votes: {userId: userId}}});
      return await setVoteRate(entryId, rate * -1)
    }
  } else {
    await Entry.findByIdAndUpdate(entryId, {$push: {votes: {userId: userId, rate: rate}}});
    return await setVoteRate(entryId, rate);
  }
}

module.exports = {findUser, findEntry, getEntries, saveEntry, countEntry, vote}