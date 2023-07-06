export default class ObjectUtil {
  static getKey(obj: any, value: unknown) {
    return Object.keys(obj).find((key) => obj[key] === value);
  }
}
