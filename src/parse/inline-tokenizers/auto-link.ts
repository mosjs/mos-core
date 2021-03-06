import decode from 'parse-entities'
import Tokenizer from '../tokenizer'
import renderLink from './renderers/link'
const MAILTO_PROTOCOL = 'mailto:'

/**
 * Tokenise a URL in carets.
 *
 * @example
 *   tokenizeAutoLink(eat, '<http://foo.bar>')
 *
 * @property {boolean} notInLink
 * @property {Function} locator - Auto-link locator.
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `link` node.
 */
const tokenizeAutoLink: Tokenizer = function (parser, value, silent) {
  if (value.charAt(0) !== '<') {
    return
  }

  let subvalue = ''
  const length = value.length
  let index = 0
  let queue = ''
  let hasAtCharacter = false
  let link = ''

  index++
  subvalue = '<'

  while (index < length) {
    var character = value.charAt(index)

    if (
      character === ' ' ||
      character === '>' ||
      character === '@' ||
      (character === ':' && value.charAt(index + 1) === '/')
    ) {
      break
    }

    queue += character
    index++
  }

  if (!queue) {
    return
  }

  link += queue
  queue = ''

  character = value.charAt(index)
  link += character
  index++

  if (character === '@') {
    hasAtCharacter = true
  } else {
    if (
      character !== ':' ||
      value.charAt(index + 1) !== '/'
    ) {
      return
    }

    link += '/'
    index++
  }

  while (index < length) {
    character = value.charAt(index)

    if (character === ' ' || character === '>') {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)

  if (!queue || character !== '>') {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  link += queue
  let content = link
  subvalue += link + character
  const now = parser.eat.now()
  now.column++
  now.offset++

  if (hasAtCharacter) {
    if (
      link.substr(0, MAILTO_PROTOCOL.length).toLowerCase() !==
      MAILTO_PROTOCOL
    ) {
      link = MAILTO_PROTOCOL + link
    } else {
      content = content.substr(MAILTO_PROTOCOL.length)
      now.column += MAILTO_PROTOCOL.length
      now.offset += MAILTO_PROTOCOL.length
    }
  }

  const exitAutoLink = parser.state.enterAutoLink()
  const eater = parser.eat(subvalue)
  return renderLink(parser, decode(link), content, null, now)
    .then(node => {
      exitAutoLink()
      const addedNode = eater(node)
      return addedNode
    })
}

tokenizeAutoLink.notInLink = true

/**
 * Find a possible auto-link.
 *
 * @example
 *   locateAutoLink('foo <bar') // 4
 *
 * @param {string} value - Value to search.
 * @param {number} fromIndex - Index to start searching at.
 * @return {number} - Location of possible auto-link.
 */
tokenizeAutoLink.locator = function (parser, value, fromIndex) {
  return value.indexOf('<', fromIndex)
}

export default tokenizeAutoLink
