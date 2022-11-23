# Zlak

A scriptable fake chat application

![zlak](https://i.imgur.com/QYoQ2yy.png)

## Description

If you need to look like you are in a chat, this is the application for you.

## How does it work?

1. Write a script file.
2. Upload the script file to Zlak [zlak.tomontheinternet.com](https://zlak.tomontheinternet.com) by clicking on the header.
3. Enjoy

## Script file

A script file is a set of instructions to Zlak. For an example, look at `sample-instructions` in this repo.

The available commands are:

```
USER `username`          // set the name of the user, defaults to Tom if not called
WAIT 2000                // waits for the number of milliseconds, in this case 2000 (2 seconds)
WAIT USER                // waits until the user sends a message
TYPING `username` 2000   // show a typing message, in this case "username is typing..." for 2 seconds
SAY `username` `message` // show a message from a user
NARRATE `message` 5000   // show a narration message, in this case it show "narrate" for 5 seconds
```

## Why did you build this?

I thought it might be fun to have someone to chat to when recording YouTube videos.
