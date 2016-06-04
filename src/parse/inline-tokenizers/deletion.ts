import isWhiteSpace from '../is-white-space'
import nodeTypes from '../node-types'
import Tokenizer from '../tokenizer'

/**
 * Find a possible deletion.
 *
 * @example
 *   locateDeletion('foo ~~bar') // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible deletion.
 */
function locateDeletion (parser, value, fromIndex) {
  return value.indexOf('~~', fromIndex)
}

/**
 * Tokenise a deletion.
 *
 * @example
 *   tokenizeDeletion(eat, '~~foo~~')
 *
 * @property {Function} locator - Deletion locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `delete` node.
 */
const tokenizeDeletion: Tokenizer = function (parser, value, silent) {
  let character = ''
  let previous = ''
  let preceding = ''
  let subvalue = ''

  if (
    !parser.options.gfm ||
    value.charAt(0) !== '~' ||
    value.charAt(1) !== '~' ||
    isWhiteSpace(value.charAt(2))
  ) {
    return
  }

  let index = 1
  const now = parser.eat.now()
  now.column += 2
  now.offset += 2

  while (++index < value.length) {
    character = value.charAt(index)

    if (
      character === '~' &&
      previous === '~' &&
      (!preceding || !isWhiteSpace(preceding))
    ) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      return parser.eat(`~~${subvalue}~~`)(
        parser.renderInline(nodeTypes.DELETE, subvalue, now)
      )
    }

    subvalue += previous
    preceding = previous
    previous = character
  }
}

tokenizeDeletion.locator = locateDeletion

export default tokenizeDeletion
