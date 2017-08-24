exports.run = (client, message, args) => {
doNotDelete = true;
    var ball = "";
    var argsArray = message.content.split(" ").slice(1);
    var arrayLength = argsArray.length;

    if (arrayLength > 0) {
        for (let i = 0; i < arrayLength; i++) {
            ball = (ball + argsArray[i] + " ");
        }
        ball = ball.trim();
    } else {
        message.channel.send(":no_entry_sign: **ERROR:** You need to specify a question/message.");
        message.delete();
        return;
    }

    message.channel.send(":grey_question: **" + ball + "**  -  *Asked by " + message.author + ".*")

    switch (Math.floor(Math.random() * 1000) % 3) {
        case 0:
            switch (Math.floor(Math.random() * 1000) % 10) {
                case 0:
                    message.channel.send(":8ball: It is certain.");
                    break;
                case 1:
                    message.channel.send(":8ball: It is decidedly so.");
                    break;
                case 2:
                    message.channel.send(":8ball: Without a doubt.");
                    break;
                case 3:
                    message.channel.send(":8ball: Yes, definitely.");
                    break;
                case 4:
                    message.channel.send(":8ball: You may rely on it.");
                    break;
                case 5:
                    message.channel.send(":8ball: As I see it, yes.");
                    break;
                case 6:
                    message.channel.send(":8ball: Most likely.");
                    break;
                case 7:
                    message.channel.send(":8ball: Outlook is good.");
                    break;
                case 8:
                    message.channel.send(":8ball: Yes.");
                    break;
                case 9:
                    message.channel.send(":8ball: Signs point to yes.");
                    break;
            }
            message.delete();
            break;
        case 1:
            switch (Math.floor(Math.random() * 1000) % 5) {
                case 0:
                    message.channel.send(":8ball: Reply hazy, try again later.");
                    break;
                case 1:
                    message.channel.send(":8ball: Ask again later.");
                    break;
                case 2:
                    message.channel.send(":8ball: Better not tell you now.");
                    break;
                case 3:
                    message.channel.send(":8ball: Cannot predict now.");
                    break;
                case 4:
                    message.channel.send(":8ball: Concentrate and ask again.");
                    break;
            }
            message.delete();
            break;
        case 2:
            switch (Math.floor(Math.random() * 1000) % 5) {
                case 0:
                    message.channel.send(":8ball: Don't count on it.");
                    break;
                case 1:
                    message.channel.send(":8ball: My reply is no.");
                    break;
                case 2:
                    message.channel.send(":8ball: My sources say no.");
                    break;
                case 3:
                    message.channel.send(":8ball: Outlook is not so good.");
                    break;
                case 4:
                    message.channel.send(":8ball: Very doubtful.");
                    break;
            }
            break;
            message.delete();
            break;

    }
}

let command = '8ball'
, description = 'Ask the 8-ball a question and get a random response.'
, usage = '+8ball **[question]**'
, throttle = {usages: 3, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
