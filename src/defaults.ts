import {CompilerOptions} from './stringify/compiler';

export const parse = {
  position: true,
  gfm: true,
  yaml: true,
  commonmark: false,
  footnotes: false,
  pedantic: false,
  breaks: false,
}

export const stringify: CompilerOptions = {
  gfm: true,
  commonmark: false,
  pedantic: false,
  entities: 'false',
  setext: false,
  closeAtx: false,
  looseTable: false,
  spacedTable: true,
  incrementListMarker: true,
  fences: false,
  fence: '`',
  bullet: '-',
  listItemIndent: 'tab',
  rule: '*',
  ruleSpaces: true,
  ruleRepetition: 3,
  strong: '*',
  emphasis: '_',
}
