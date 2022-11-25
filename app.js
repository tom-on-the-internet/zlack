const $header = document.querySelector("header");
const $messages = document.getElementById("messages");
const $form = document.querySelector("form");
const $input = document.querySelector("#message-input");
const $fileUpload = document.querySelector("#file-upload");

/** userAction knows if the user performed an action since last check */
let userAction = false;

let username = "Tom"; // Default user is Tom

function onSubmit(e) {
  e.preventDefault();

  sendMessage(username, $input.value.trim());

  $form.reset();

  userAction = true;
}

function onClickHeader(e) {
  $fileUpload.click();
}

async function onFileUpload() {
  reset();

  if (!this.files.length) {
    return;
  }

  const file = this.files[0];

  let instructions = [];
  try {
    instructions = await getInstructions(file);
  } catch (error) {
    alert("invalid instructions");
    console.log(error);

    return;
  }

  followInstructions(instructions);
}

function reset() {
  userAction = false;
  $messages.innerHTML = "";
}

async function followInstructions(instructions) {
  console.log("Running instructions.");
  for (const instruction of instructions) {
    const line = await instruction();
    console.log("Line complete:", line);
  }
  console.log("Instructions complete.");
}

/**
 * sendMessage adds a text message to the dom
 */
function sendMessage(author, text) {
  const $author = document.createElement("div");
  $author.classList.add("author");
  $author.innerHTML = author;

  const $text = document.createElement("div");
  $text.classList.add("text");
  $text.innerHTML = text;

  const $message = document.createElement("div");
  $message.classList.add("message");

  $message.appendChild($author);
  $message.appendChild($text);
  $messages.appendChild($message);
}

function narrate(message, waitTime) {
  const $narration = document.createElement("div");
  $narration.classList.add("narration");
  $narration.innerHTML = message;

  $messages.appendChild($narration);
  setTimeout(() => {
    $narration.remove();
  }, waitTime);
}

/**
 * typingIndicator show that someone is typing
 */
function typingIndicator(author, time) {
  const $typingIndicator = document.createElement("div");
  $typingIndicator.classList.add("typing-indicator");
  $typingIndicator.innerHTML = `${author} is typing...`;

  $messages.appendChild($typingIndicator);
  setTimeout(() => {
    $typingIndicator.remove();
  }, time);
}

function getInstructions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const file = e.target.result;
        const instructions = file
          .split(/\r\n|\n/)
          .filter((l) => l)
          .map((l) => l.trim())
          .map((l) => makeInstruction(l));
        resolve(instructions);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsText(file);
  });
}

function makeInstruction(line) {
  if (line.startsWith("#")) {
    return makeCommentInstruction(line);
  }

  if (line.startsWith("USER")) {
    return makeUserInstruction(line);
  }

  if (line.startsWith("WAIT") && !line.includes("USER")) {
    return makeWaitTimeInstruction(line);
  }

  if (line.startsWith("WAIT") && line.includes("USER")) {
    return makeWaitUserInstruction(line);
  }

  if (line.startsWith("SAY")) {
    return makeSayInstruction(line);
  }

  if (line.startsWith("TYPING")) {
    return makeTypingInstruction(line);
  }

  if (line.startsWith("NARRATE")) {
    return makeNarrationInstruction(line);
  }

  alert("invalid instruction");
  console.log("invalid instruction", line);
}

function makeWaitUserInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (userAction) {
          clearInterval(interval);
          userAction = false;
          resolve(line);
        }
      }, 10);
    });
  };
}

function makeWaitTimeInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      const waitTime = line.split(" ")[1].trim();
      setTimeout(() => {
        resolve(line);
      }, waitTime);
    });
  };
}

function makeSayInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      const [author, message] = extractMessage(line);
      sendMessage(author, message);
      resolve(line);
    });
  };
}

function makeCommentInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      resolve(line);
    });
  };
}

function makeUserInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      username = line.match(/(?:`[^`]*`|^[^`]*$)/g)[0].replace(/`/g, "");
      resolve(line);
    });
  };
}

function makeNarrationInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      const [narration, waitTime] = extractTyping(line);
      narrate(narration, waitTime);
      setTimeout(() => {
        resolve(line);
      }, waitTime);
    });
  };
}

function makeTypingInstruction(line) {
  return () => {
    return new Promise((resolve, reject) => {
      const [author, waitTime] = extractTyping(line);
      typingIndicator(author, waitTime);
      setTimeout(() => {
        resolve(line);
      }, waitTime);
    });
  };
}

function extractMessage(line) {
  return line.match(/(?:`[^`]*`|^[^`]*$)/g).map((x) => x.replace(/`/g, ""));
}

function extractTyping(line) {
  const author = line.match(/(?:`[^`]*`|^[^`]*$)/g)[0].replace(/`/g, "");
  const time = line.split(" ").reverse()[0];

  return [author, time];
}

function extractNarration(line) {
  return extractTyping(line);
}

async function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// demo runs a demo on app launch
// the code is rough, but works.
async function demo() {
  typingIndicator("Bot", 2000);
  await wait(2000);
  sendMessage(
    "Bot",
    "Hey! Welcome to Zlack. To find out more, go to https://github.com/tom-on-the-internet/zlak"
  );
}

$form.addEventListener("submit", onSubmit);
$header.addEventListener("click", onClickHeader);

$fileUpload.addEventListener("change", onFileUpload);

demo();
