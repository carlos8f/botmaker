# botmaker

## what should it do?

- follow people back who follow it (grow network)
- retweet stuff from people in the network
- if someone tweets @bot , follow them, and markov chain them back a message
- or if you do "@bot what is ...", search wikipedia
- or if you do "@bot youtube ...", search youtube and return the url
- or if you do "@bot sleepycat", reply with a sleepy cat image
- any time a mutual follow is made, send it a hello DM that i am a bot
- if someone replies to the DM, parse it and reply
- follow suggested users
- allow users to create lists inside bot (@bot makelist alpha beta testers)

## events

- @bot was followed
  - follow back
  - DM thanks for following, i am a bot
- @bot was mentioned (replied to?)
  - parse for command
  - tweet back markov chain if no command
- @bot was added to list
- @bot picked up a tweet from keyword
- home timeline tweet
  - parse for handles
      - follow users?
  - wait a while,
      - favorite or retweet popular ones
