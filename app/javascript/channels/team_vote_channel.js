import consumer from "./consumer"
import * as rxjs from "rxjs"

export default class TeamVoteChannel {
  constructor(id, receivedCallback, connectedCallback) {
    this.subscription = consumer.subscriptions.create({
      channel: "TeamVoteChannel",
      team_id: id
    }, {
      connected() {
        // Called when the subscription is ready for use on the server
        connectedCallback()
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        receivedCallback(data)
      }
    });
  }

  vote = (value) => {
    return this.subscription.perform('vote', {value: value});
  }

  finalize = () => {
    return this.subscription.perform('finalize');
  }

  new = () => {
    return this.subscription.perform('new');
  }

  hello = () => {
    return this.subscription.perform('hello');
  }

  unsubscribe = () => {
    return this.subscription.unsubscribe();
  }
}

// consumer.subscriptions.create("TeamVoteChannel", {
//   connected() {
//     // Called when the subscription is ready for use on the server
//   },
//
//   disconnected() {
//     // Called when the subscription has been terminated by the server
//   },
//
//   received(data) {
//     // Called when there's incoming data on the websocket for this channel
//   },
//
//   vote: function() {
//     return this.perform('vote');
//   },
//
//   finalize: function() {
//     return this.perform('finalize');
//   },
//
//   new: function() {
//     return this.perform('new');
//   }
// });
