const discord = require("discord.js");
const client = new discord.Client();
const jsonthing = require("./token.json");
const fetch = require("node-fetch");
let a = [];
let k = 0;
let subreddit;
let author;
let link;
let final;
let interaions = 0;
setInterval(() => {
  fetch("https://www.reddit.com/r/memes/new/.json?count=1")
    .then((resp) => resp.json()) // transform the data into json
    .then(function (data) {
      subreddit = data.data.children[0].data.subreddit;
      author = data.data.children[0].data.author;
      link = data.data.children[0].data.url_overridden_by_dest;
      final = `new post from r/${subreddit} by u/${author} and the link is ${link}`; // idek why i have this
      /**
       * all of this is just some complex logic to make sure it will not post the same thing twice
       */
      k++;
      interaions++;
      a[k] = final;
      if (interaions % 2 === 0) {
        // console.log(k, interaions % 2);
        // console.log(a[k], a[k - 1]);
        if (a[k] === a[k - 1]) {
          // if this iamge = the last image that was fetched
          a = []; // this is to save some ram by not having an array that has a length of1000+
          k = 0; // this is not required but i prefer to have it anyway
          // console.log("same");
        } else {
          // console.log("different post");
          // console.log(link);
          if (!data.data.children[0].data.over_18) {
            client.channels.cache.get(jsonthing.redditChannelID).send(
              // this will send a message in the channel that you pasted in the token.json
              new discord.MessageEmbed()
                .setImage(link)
                .setFooter(`post made by u/${author}`)
                .setDescription(`this is from r/${subreddit}`)
                .setColor("RANDOM")
            );
          }
        }
      }
    });
}, 2000);
process.on("uncaughtException", () => {}); // some errors can happen
client.on("ready", () => {
  client.channels.cache.get(jsonthing.redditChannelID).send("ready"); // this will send ready in the channel that you pasted into the token.json
});

client.login(jsonthing.token);
