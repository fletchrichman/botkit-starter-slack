module.exports = function(controller) {

    // create special handlers for certain actions in buttons
    // if the button action is 'action', trigger an event
    // if the button action is 'say', act as if user said that thing
    controller.on('interactive_message_callback', function(bot, trigger) {


        if (trigger.actions[0].name.match(/^action$/)) {
            controller.trigger(trigger.actions[0].value, [bot, trigger]);
            return false; // do not bubble event
        }
        if (trigger.actions[0].name.match(/^say$/)) {

            var message = {
                user: trigger.user,
                channel: trigger.channel,
                text: '<@' + bot.identity.id + '> ' + trigger.actions[0].value,
                type: 'message',
            };

            var reply = trigger.original_message;

            for (var a = 0; a < reply.attachments.length; a++) {
                reply.attachments[a].actions = null;
            }

            var person = '<@' + trigger.user.id + '>';
            if (message.channel[0] == 'D') {
                person = 'You';
            }

            reply.attachments.push(
                {
                    text: person + ' said, ' + trigger.actions[0].value,
                }
            );

            bot.replyInteractive(trigger, reply);

            controller.receiveMessage(bot, message);
            return false; // do not bubble event
        }

        if (message.callback_id == 6) {

            bot.startConversation(message,function(err,convo){

                var usefulness;
                async.series([

                    function (inputCallback) {
                        if(message.actions[0].name == "1"){
                            usefulness = 1
                        }

                        if(message.actions[0].name == "2"){
                            usefulness = 2
                        }

                        if(message.actions[0].name == "3"){
                            usefulness = 3
                        }

                        if(message.actions[0].name == "4"){
                            usefulness = 4
                        }

                        if(message.actions[0].name == "5"){
                            usefulness = 5
                        }

                        inputCallback()
                    },
                    function (saveCallback) {

                        // needs to save to local storage
                        var feedback = new Feedback();

                        feedback.channelID = message.channel;
                        feedback.userID = message.user;
                        feedback.usefulness = usefulness;

                        feedback.save(function(err) {
                            if (err) {
                                console.log(err);
                                saveCallback(err)
                            } else {
                                console.log('Feedback mapped and saved to Mongo');
                                saveCallback()
                            }
                        });
                    },
                ], function (err) {
                    //todo err
                    convo.addMessage({
                        attachments: [
                            {
                                fallback: "Required plain-text summary of the attachment.",
                                color: "#36a64f",
                                title: 'How likely are you to refer this to a friend?',
                                callback_id: '7',
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
                    convo.next();
                });
            });
        }

        if (message.callback_id == 7) {

              bot.startConversation(message,function(err,convo){

                  var recommendToFriend ;
                  var openFeedback = "";
                  async.series([

                      function (inputCallback) {
                          if(message.actions[0].name == "1"){
                              recommendToFriend = 1
                          }

                          if(message.actions[0].name == "2"){
                              recommendToFriend = 2
                          }

                          if(message.actions[0].name == "3"){
                              recommendToFriend = 3
                          }

                          if(message.actions[0].name == "4"){
                              recommendToFriend = 4
                          }

                          if(message.actions[0].name == "5"){
                              recommendToFriend = 5
                          }

                          inputCallback()
                      },
                      function (inputCallback) {

                          convo.addQuestion('Do you have any specific feedback or feature suggestions that would help us get better?',function(response,convo) {

                              openFeedback = response.text;
                              inputCallback();
                              convo.next();

                          },{},'default');

                      },
                      function (saveCallback) {

                          Feedback.findOneAndUpdate({userID : message.user, channelID : message.channel},{ recommendToFriend: recommendToFriend, openFeedback: openFeedback}).exec(function(err, feedback){

                              if(err){
                                  console.log(err);
                                  saveCallback(err)
                              } else {

                                  if (!feedback) {
                                      console.log("hmmm. no feedback found??? check this out");
                                      saveCallback()
                                  }
                                  else {
                                      console.log("feedback updated!");
                                      saveCallback()

                                  }
                              }
                          });
                      },
                  ], function (err) {
                          //todo err
                      console.log("feedback workflow ended");
                      bot.reply(message, "Thanks for the feedback!")

                  });
              });
          }

    });


}
