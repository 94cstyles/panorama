module.exports = {
  root: true,
  env: {
    'es6': true,
    'browser': true,
    'node': true
  },
  extends: 'standard',
  globals: {
    'THREE': false,
    'THREEx': false,
    'TWEEN': false
  },
  'rules': {
    'arrow-parens': 0,
    'prefer-const': [
      'error', {
        'destructuring': 'any',
        'ignoreReadBeforeAssign': false
      }]
  }
}
