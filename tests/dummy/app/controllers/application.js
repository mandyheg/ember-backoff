import Em from 'ember';
import retryWithBackoff from 'ember-backoff/retry-with-backoff';

export default Em.Controller.extend({
  init: function() {
    this.set('content', Em.A());
  },
  actions: {
    flakeyPromiseWithBackoff: function() {
      var self = this;
      this.set('isLoading', true);

      retryWithBackoff(function() {
        return self.flakeyPromise();
      }, 20, 10).then(function() {
        self.set('isLoading', false);
      }, function() {
        self.pushObject('[retry failed after 10 tries]');
        self.set('isLoading', false);
      });
    }
  },
  flakeyPromise: function() {
    var self = this;

    return new Em.RSVP.Promise(function(resolve, reject) {
      if(Math.random() <= 0.80) {
        self.get('content').pushObject('[failed]');
        reject(); //will fail 80%
      } else {
        self.get('content').pushObject('[succeeded]');
        resolve(); //will succeed 20%
      }
    });
  },
});
