const { redirect } = require('express/lib/response');
const request = require('request-promise');
const game = require('../models/game');
let Game = require('../models/game');
let Tag = require('../models/tag');
const user = require('../models/user');
let User = require('../models/user');
const clientId = process.env.ATLAS_CLIENT_ID;
const bggURL = 'https://boardgamegeek.com/xmlapi2/';
const oracleURL =
  'https://www.boardgameoracle.com/api/boardgame?region=ca&page=1&limit=24&sort=relevance&q=';
const oracleURLStart =
  'https://www.boardgameoracle.com/api/trpc/boardgame.suggestion?batch=1&input=%7B%220%22%3A%7B%22q%22%3A%22';
//   const body = await request(
// `${rootURL}search?query=${game.title}&type=boardgame&exact=1`

const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const util = require('util');

module.exports = {
  index,
  new: newGame,
  create,
  show,
  addTag,
  tagSort,
  gameSort,
  edit,
  update,
  delete: deleteOne,
};

async function index(req, res) {
  try {
    let games = await Game.find({}).populate('tag');
    let tags = await Tag.find({});
    let user;
    if (req.user) {
      user = await User.findById(req.user.id).populate({
        path: 'collections',
        populate: {
          path: 'games',
        },
      });
    } else {
      user = {};
    }

    tags = tagSort(tags);
    games = gameSort(games);
    res.render('games/index', {
      user,
      games,
      title: 'All games',
      tags,
    });
  } catch (error) {
    res.send(error);
  }
}

async function newGame(req, res) {
  if (!req.user) return res.redirect('/games');
  let tags = await Tag.find({});
  tags = tagSort(tags);
  res.render('games/new', { title: 'Add new game', tags });
}

async function create(req, res) {
  if (!req.user) return res.redirect('/games');
  let gameBody = {
    title: req.body.title,
    description: req.body.description,
    gameAuthor: req.user.id,
    gameAuthorName: req.user.name,
    tag: req.body.tag,
  };
  const game = new Game(gameBody);
  await game.save();
  res.redirect(`games/${game._id}`);
}

async function show(req, res) {
  let collectionsWithoutGame = [];
  let collectionsWithGame = [];
  let game = await Game.findById(req.params.id).populate('tag');
  let tags = await Tag.find({});
  let user;
  if (req.user) {
    user = await User.findById(req.user.id).populate({
      path: 'collections',
      populate: {
        path: 'games',
      },
    });
    user.collections.forEach((collection) => {
      if (
        !collection.games.some((game) => game.equals(req.params.id))
      )
        collectionsWithoutGame.push(collection);
    });
    user.collections.forEach((collection) => {
      if (collection.games.some((game) => game.equals(req.params.id)))
        collectionsWithGame.push(collection);
    });
  } else {
    user = {};
  }

  let reviews = game.reviews;
  if (!game.picture) {
    try {
      const oracle = await request(
        `${oracleURLStart}${game.title}%22%2C%22limit%22%3A1%7D%7D`
      );
      const oracleResult = JSON.parse(oracle);
      console.log(
        'Oracle Search Results: ',
        util.inspect(oracleResult[0], false, null, true)
      );

      const oracleTitle = oracleResult[0].result.data.items[0].title;

      game.title = oracleTitle;
      const body = await request(
        `${bggURL}search?query=${oracleTitle}&type=boardgame&exact=1`
      );
      const result = await parseXmlString(body);

      console.log(
        'BGG Search result: ',
        util.inspect(result, false, null, true)
      );
      const bggId = result.items.item[0].$.id;

      const gameDetailsXml = await request(
        `${bggURL}thing?id=${bggId}`
      );
      const detailsResult = await parseXmlString(gameDetailsXml);
      console.log(
        'Details Result: ',
        util.inspect(detailsResult, false, null, true)
      );
      game.picture = detailsResult['items']['item'][0]['image'][0];

      if (!game.description) {
        description =
          detailsResult['items']['item'][0]['description'][0] +
          ' Description from Board Game Geek.';
        const decodedDescription = description
          .replace(/&#10;/g, '\n')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
        game.description = decodedDescription;
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
  console.log('Game: ', game);
  await game.save();
  res.render('games/show', {
    game,
    title: game.title,
    tags,
    reviews,
    user,
    collectionsWithoutGame,
    collectionsWithGame,
  });
}

async function edit(req, res) {
  // If there's no user logged in, redirect to the games index page
  if (!req.user) return res.redirect('/games');
  // Find specific game in database and populate the tags rather than just IDs
  let game = await Game.findById(req.params.id).populate('tag');
  let user = await User.findById(req.user.id);
  // If the user isn't the creator, redirect to the game's show page

  if (req.user.id != game.gameAuthor && !user.admin) {
    return res.redirect(`/games/${game._id}`);
  }
  // Otherwise get the tags from the database, sort them, and render the
  // edit page with the game's title, it's data and the sorted tags
  let tags = await Tag.find({});
  tags = tagSort(tags);
  res.render('games/edit', { title: game.title, game, tags });
}

async function update(req, res) {
  //If there's no user logged in, redirect to the games index page
  if (!req.user) return res.redirect('/games');
  // Find specific game in database
  let game = await Game.findById(req.params.id);
  // Associate title, description and tag from form with specific game, and save
  game.title = req.body.title;
  game.description = req.body.description;
  game.tag = req.body.tag;
  await game.save();
  // Redirect to the game's show page
  res.redirect(`/games/${game._id}`);
}

async function deleteOne(req, res) {
  if (!req.user) return res.redirect('/games');
  let game = await Game.findById(req.params.id);
  let user = await User.findById(req.user.id);
  if (req.user.id != game.gameAuthor && !user.admin) {
    return res.redirect(`/games/${game._id}`);
  }
  await game.remove();

  res.redirect('/games/');
}

// This is actually a toggle tag function - consider renaming
async function addTag(req, res) {
  // If there's no user logged in, redirect to the games index page
  if (!req.user) return res.redirect('/games');
  // Get the appropriate game and tag from the database
  let game = await Game.findById(req.params.gameId);
  let newTag = await Tag.findById(req.params.tagId);
  // Find out if newTag's id is already associated with that game
  // Will return true or false
  let isInArray = game.tag.some(function (tag) {
    return tag.equals(newTag._id);
  });
  // If it is, unassociate it with that game and redirect back to the game's show page
  if (isInArray) {
    let index = game.tag.indexOf(newTag._id);
    game.tag.splice(index, 1);
    await game.save();
    return res.redirect(`/games/${req.params.gameId}`);
  }
  // Otherwise, associate the game with the tag's ID.
  game.tag.push(newTag._id);
  await game.save();
  // And redirect back to the game's show page
  res.redirect(`/games/${req.params.gameId}`);
}

// Used to alphabeticise tags
function tagSort(tags) {
  return (tags = tags.sort(function (a, b) {
    let x = a.content.toLowerCase();
    let y = b.content.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }));
}
// Used to alphabeticise game titles
function gameSort(games) {
  return (games = games.sort(function (a, b) {
    let x = a.title.toLowerCase();
    let y = b.title.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }));
}

function parseXmlString(xmlString) {
  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// ** Below code saved for future problem solving **

// async function getImages(games) {
//   let images =[]
//   games.forEach(async function(game, idx) {
//   let text = await request(`${rootURL}search?name=${game.title}&client_id=${clientId}`)
//     images.push(text)
//     console.log(images)
//   })
//   return images
// //  }

// let images =[]
// games.forEach( function(game, idx) {
//   let body =  request(
//     `${rootURL}search?name=${game.title}&client_id=${clientId}`
//     ).then(function(err){
//       body = await JSON.parse(body);
//       let image = body.games[0].thumb_url
//       console.log(image)
//       console.log(images, idx)})
//       images.push(image)
//     })

// console.log(images)

// async function index(req, res) {
//   try {

//   if (!req.user) return res.redirect("/");

//   console.log("Games controller index function");

//   let games = await Game.find({}).populate("tag");

//   let tags = await Tag.find({});
//   games = gameSort(games);
//   tags = tagSort(tags);

//   let images = getImages(games)

//   res.render("games/index", {
//     games,
//     title: "All games",
//     tags,
//     images
//   });
//   } catch (error) {
//     res.send(error)
//   }
// }
