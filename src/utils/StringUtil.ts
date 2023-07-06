export default class StringUtil {
  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static handleVariables(str: string, obj: any) {
    return str.replace(/{{(.*?)}}/g, (_match, key) => obj[key.trim()]);
  }
}
