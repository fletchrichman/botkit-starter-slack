module.exports = function(controller) {

    controller.on('slash_command',function(bot,message) {

        bot.replyAcknowledge();

        if (message.command == '/feedback'){

                    bot.reply(message, {
                        attachments: [
                            {
                                fallback: "Required plain-text summary of the attachment.",
                                color: "#36a64f",
                                title: "How would you rate the usefulness of this bot? ** 5 being highest",
                                callback_id: '6',
                                attachment_type: 'default',
                                actions: [
                                    {
                                        "name":"1",
                                        "text": "1",
                                        "value": "1",
                                        "type": "button",
                                    },
                                    {
                                        "name":"2",
                                        "text": "2",
                                        "value": "2",
                                        "type": "button",
                                    },
                                    {
                                        "name":"3",
                                        "text": "3",
                                        "value": "3",
                                        "type": "button",
                                    },
                                    {
                                        "name":"4",
                                        "text": "4",
                                        "value": "4",
                                        "type": "button",
                                    },
                                    {
                                        "name":"5",
                                        "text": "5",
                                        "value": "5",
                                        "type": "button",
                                    },

                                ]
                            }
                        ]
                    });

                }

      }

}
