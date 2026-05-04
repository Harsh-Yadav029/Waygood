/**
 * Valid transitions for the application lifecycle.
 *Terminal states have empty arrays.
 */
const VALID_TRANSITIONS = {
  'applied':       ['under_review'],
  'under_review':  ['accepted', 'rejected'],
  'accepted':      [],   // terminal state
  'rejected':      []    // terminal state
};

module.exports = {
  VALID_TRANSITIONS,
};
