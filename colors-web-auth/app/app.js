var config = {
    LOG_TRANSITIONS: true, // basic logging of successful transitions
    LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
    LOG_STACKTRACE_ON_DEPRECATION : true,
    LOG_BINDINGS : true,
    LOG_VIEW_LOOKUPS : true,
    LOG_ACTIVE_GENERATION : true
};

module.exports = Ember.Application.create(config);