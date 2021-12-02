console.log("hey");

const $messages = document.getElementById("messages");

/**
 * sendMessage adds a text message to the dom
 */
function sendMessage(author, text) {
  var $author = document.createElement("div");
  $author.classList.add("author");
  $author.innerHTML = author;

  var $text = document.createElement("div");
  $text.classList.add("text");
  $text.innerHTML = text;

  var $message = document.createElement("div");
  $message.classList.add("message");

  $message.appendChild($author);
  $message.appendChild($text);
  $messages.appendChild($message);
}

sendMessage(
  "Bill",
  "What the fuck? You are everything in the world to me and I hope that's obvious. What the fuck? You are everything in the world to me and I hope that's obvious."
);
sendMessage("Bill", "What the fuck?");
