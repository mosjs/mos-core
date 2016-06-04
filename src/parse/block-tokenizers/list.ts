import {ListNode, Node} from '../../node'
import isNumeric from '../is-numeric'
import trim from 'trim'
import tryBlockTokenize from '../try-block-tokenize'
import Tokenizer from '../tokenizer'

import {TAB_SIZE, RULE_MARKERS} from '../shared-constants'

/*
 * A map of characters which can be used to mark
 * list-items.
 */

const LIST_UNORDERED_MARKERS = {
  '*': true,
  '+': true,
  '-': true,
}

/*
 * A map of characters which can be used to mark
 * list-items after a digit.
 */

const LIST_ORDERED_MARKERS = {
  '.': true,
}

/*
 * A map of characters which can be used to mark
 * list-items after a digit.
 */

const LIST_ORDERED_COMMONMARK_MARKERS = {
  '.': true,
  ')': true,
}

/**
 * Tokenise a list.
 *
 * @example
 *   tokenizeList(eat, '- Foo')
 *
 * @param {function(string)} eat - Eater.
 * @param {string} value - Rest of content.
 * @param {boolean?} [silent] - Whether this is a dry run.
 * @return {Node?|boolean} - `list` node.
 */
const tokenizeList: Tokenizer = function (parser, value, silent) {
  const commonmark = parser.options.commonmark
  const pedantic = parser.options.pedantic
  let index = 0
  let length = value.length
  let start: number = null
  let queue: string
  let ordered: boolean
  let character: string
  let marker: string
  let nextIndex: number
  let startIndex: number
  let prefixed: boolean
  let currentMarker: string
  let empty: boolean
  let allLines: any

  while (index < length) {
    character = value.charAt(index)

    if (character !== ' ' && character !== '\t') {
      break
    }

    index++
  }

  character = value.charAt(index)

  const markers = commonmark
    ? LIST_ORDERED_COMMONMARK_MARKERS
    : LIST_ORDERED_MARKERS

  if (LIST_UNORDERED_MARKERS[character] === true) {
    marker = character
    ordered = false
  } else {
    ordered = true
    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (!isNumeric(character)) {
        break
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (!queue || markers[character] !== true) {
      return
    }

    start = parseInt(queue, 10)
    marker = character
  }

  character = value.charAt(++index)

  if (character !== ' ' && character !== '\t') {
    return
  }

  if (silent) {
    return true
  }

  index = 0
  const items: any = []
  allLines = []
  let emptyLines: string[] = []
  let item: any

  return tokenizeEach(index)
    .then(() => parser.eat(allLines.join('\n'))
      .reset({
        type: 'list',
        ordered,
        start,
        loose: null,
        children: [],
      })
    )
    .then((node: ListNode) => {
      const enterTop = parser.state.exitTop()
      const exitBlockquote = parser.state.enterBlockquote()
      let isLoose = false
      length = items.length
      const parent = node

      return tokenizeEach(items)
        .then(() => {
          enterTop()
          exitBlockquote()

          node.loose = isLoose

          return node
        })

      function tokenizeEach (items: any): any {
        const rawItem = items.shift()
        if (!rawItem) return
        item = rawItem.value.join('\n')
        const now = parser.eat.now()

        return parser.eat(item)(parser.renderListItem(item, now), parent)
          .then(item => {
            if ((item as ListNode).loose) {
              isLoose = true
            }

            let joinedTrail = rawItem.trail.join('\n')

            if (items.length) {
              joinedTrail += '\n'
            }

            parser.eat(joinedTrail)

            return tokenizeEach(items)
          })
      }
    })

  function tokenizeEach (index: number): any {
    if (index >= length) return Promise.resolve()

    nextIndex = value.indexOf('\n', index)
    startIndex = index
    prefixed = false
    let indented = false

    if (nextIndex === -1) {
      nextIndex = length
    }

    let end = index + TAB_SIZE
    let size = 0

    while (index < length) {
      character = value.charAt(index)

      if (character === '\t') {
        size += TAB_SIZE - size % TAB_SIZE
      } else if (character === ' ') {
        size++
      } else {
        break
      }

      index++
    }

    if (size >= TAB_SIZE) {
      indented = true
    }

    if (item && size >= item.indent) {
      indented = true
    }

    character = value.charAt(index)
    currentMarker = null

    if (!indented) {
      if (LIST_UNORDERED_MARKERS[character] === true) {
        currentMarker = character
        index++
        size++
      } else {
        queue = ''

        while (index < length) {
          character = value.charAt(index)

          if (!isNumeric(character)) {
            break
          }

          queue += character
          index++
        }

        character = value.charAt(index)
        index++

        if (queue && markers[character] === true) {
          currentMarker = character
          size += queue.length + 1
        }
      }

      if (currentMarker) {
        character = value.charAt(index)

        if (character === '\t') {
          size += TAB_SIZE - size % TAB_SIZE
          index++
        } else if (character === ' ') {
          end = index + TAB_SIZE

          while (index < end) {
            if (value.charAt(index) !== ' ') {
              break
            }

            index++
            size++
          }

          if (index === end && value.charAt(index) === ' ') {
            index -= TAB_SIZE - 1
            size -= TAB_SIZE - 1
          }
        } else if (
          character !== '\n' &&
          character !== ''
        ) {
          currentMarker = null
        }
      }
    }

    if (currentMarker) {
      if (commonmark && marker !== currentMarker) {
        return Promise.resolve()
      }

      prefixed = true
    } else {
      if (
        !commonmark &&
        !indented &&
        value.charAt(startIndex) === ' '
      ) {
        indented = true
      } else if (
        commonmark &&
        item
      ) {
        indented = size >= item.indent || size > TAB_SIZE
      }

      prefixed = false
      index = startIndex
    }

    let line = value.slice(startIndex, nextIndex)
    let content = startIndex === index ? line : value.slice(index, nextIndex)

    if (currentMarker && RULE_MARKERS[currentMarker] === true) {
      return tryBlockTokenize(parser, 'thematicBreak', line, true)
        .then(found => {
          if (found) {
            return
          }
          return notRuleMarker()
        })
    }

    return notRuleMarker()

    function defaultEnd () {
      index = nextIndex + 1
      return tokenizeEach(index)
    }

    function next () {
      item.value = item.value.concat(emptyLines, line)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []

      return defaultEnd()
    }

    function notCommonmarkNext () {
      if (!commonmark) {
        return tryBlockTokenize(parser, 'definition', line, true)
          .then(found => {
            if (found) return

            return tryBlockTokenize(parser, 'footnoteDefinition', line, true)
              .then(found => {
                if (found) return

                return next()
              })
          })
      }

      return next()
    }

    function notRuleMarker () {
      const prevEmpty = empty
      empty = !trim(content).length

      if (indented && item) {
        item.value = item.value.concat(emptyLines, line)
        allLines = allLines.concat(emptyLines, line)
        emptyLines = []
      } else if (prefixed) {
        if (emptyLines.length) {
          item.value.push('')
          item.trail = emptyLines.concat()
        }

        item = {
          // 'bullet': value.slice(startIndex, index),
          value: [line],
          indent: size,
          trail: [],
        }

        items.push(item)
        allLines = allLines.concat(emptyLines, line)
        emptyLines = []
      } else if (empty) {
        // TODO: disable when in pedantic-mode.
        if (prevEmpty) {
          return Promise.resolve()
        }

        emptyLines.push(line)
      } else {
        if (prevEmpty) {
          return Promise.resolve()
        }

        if (!pedantic) {
          return tryBlockTokenize(parser, 'fences', line, true)
            .then(found => {
              if (found) return

              return tryBlockTokenize(parser, 'thematicBreak', line, true)
                .then(found => {
                  if (found) return

                  return notCommonmarkNext()
                })
            })
        }

        return notCommonmarkNext()
      }

      return defaultEnd()
    }
  }
}

export default tokenizeList
