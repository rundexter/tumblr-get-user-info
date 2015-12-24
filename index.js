var _ = require('lodash'),
    util = require('./util.js');

var request = require('request').defaults({
    baseUrl: 'https://api.tumblr.com/v2/'
});

var pickOutputs = {
        'following': 'response.user.following',
        'default_post_format': 'response.user.default_post_format',
        'name': 'response.user.name',
        'likes': 'response.user.likes',
        'blogs': 'response.user.blogs'
    };

module.exports = {
    /**
     * Return auth params.
     *
     * @param dexter
     * @returns {*}
     */
    authOptions: function (dexter) {
        var oauth = {
            consumer_key: dexter.environment('tumblr_consumer_key'),
            consumer_secret: dexter.environment('tumblr_consumer_secret'),
            token: dexter.environment('tumblr_token'),
            token_secret: dexter.environment('tumblr_token_secret')
        };

        return (
            oauth.consumer_key &&
            oauth.consumer_secret &&
            oauth.token &&
            oauth.token_secret
        )? oauth : false;
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var oauth = this.authOptions(dexter),
            uriLink = 'user/info';

        if (!oauth)
            return this.fail('A [tumblr_consumer_key,tumblr_consumer_secret,tumblr_token,tumblr_token_secret] environment need for this module.');

        //send API request
        request.get({
            url: uriLink,
            oauth: oauth,
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);

            else if (_.parseInt(response.statusCode) !== 200)
                this.fail(body);

            else
                this.complete(util.pickResult(body, pickOutputs));
        }.bind(this));
    }
};
