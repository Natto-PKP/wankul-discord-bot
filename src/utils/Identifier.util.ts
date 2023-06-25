const numbers = '0123456789'.split('');
const lowers = 'abcdefghijklmnopqrstuvwxyz'.split('');
const uppers = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

const DEFAULT_LENGTH = 8;
const DEFAULT_CHARACTERS = ['number'];

type BaseOptions = { characters: ('number' | 'lower' | 'upper')[], length: number };

export default class IdentifierService {
  static generate(options?: BaseOptions) {
    const length = options?.length || DEFAULT_LENGTH;
    const characters = (options?.characters.length && options.characters) || DEFAULT_CHARACTERS;

    const arr: string[] = [];
    if (characters.includes('lower')) arr.push(...lowers);
    if (characters.includes('upper')) arr.push(...uppers);
    if (characters.includes('number')) arr.push(...numbers);

    const result = Array.from({ length }, () => arr[Math.floor(Math.random() * arr.length)]);
    return result.join('');
  }

  static isIdentifier(str: string, options?: BaseOptions & { isSearch?: boolean }) {
    const length = options?.length || DEFAULT_LENGTH;
    const characters = (options?.characters.length && options.characters) || DEFAULT_CHARACTERS;
    const isSearch = Boolean(options?.isSearch);
    let dynamic = '';

    if (characters.includes('lower')) dynamic += 'a-z';
    if (characters.includes('upper')) dynamic += 'A-Z';
    if (characters.includes('number')) dynamic += '0-9';

    const regexpStr = `${isSearch ? '^.*' : '^'}[${dynamic}]{${length}}${isSearch ? '.*$' : '$'}`;
    const regexp = new RegExp(regexpStr, 'g');

    return regexp.test(str);
  }
}
