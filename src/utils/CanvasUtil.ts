import { registerFont } from 'canvas';

// # fonts
registerFont('./resources/fonts/GemunuLibre-Regular.ttf', { family: 'Gemunu Libre' }); // Content
registerFont('./resources/fonts/GemunuLibre-Bold.ttf', { family: 'Gemunu Libre bold' }); // Content

registerFont('./resources/fonts/NotoSans-Regular.ttf', { family: 'Noto Sans' });
registerFont('./resources/fonts/NotoSansArabic-Regular.ttf', { family: 'Noto Sans Arabic' });
registerFont('./resources/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' });
registerFont('./resources/fonts/NotoSansKR-Regular.otf', { family: 'Noto Sans KR' });
registerFont('./resources/fonts/NotoSansMayanNumerals-Regular.ttf', { family: 'Noto Sans Mayan' });
registerFont('./resources/fonts/NotoSansSC-Regular.otf', { family: 'Noto Sans SC' });
registerFont('./resources/fonts/NotoSansSymbols-Regular.ttf', { family: 'Noto Sans Symbols' });

export default class CanvasUtil {
  static CONTENT_FONT = 'Gemunu Libre';

  static CONTENT_FONT_BOLD = 'Gemunu Libre bold';

  static TEXT_FONT = 'Noto Sans, Noto Sans Arabic, Noto Sans JP, Noto Sans KR, Noto Sans Mayan, Noto Sans SC, Noto Sans Symbols';

  static rect(ctx: any, x: number, y: number, width: number, height: number, rayon?: number) {
    const r = rayon || 0;
    ctx.beginPath();

    ctx.moveTo(x, y + r);
    ctx.lineTo(x, y + height - r);
    ctx.quadraticCurveTo(x, y + height, x + r, y + height);
    ctx.lineTo(x + width - r, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - r);
    ctx.lineTo(x + width, y + r);
    ctx.quadraticCurveTo(x + width, y, x + width - r, y);
    ctx.lineTo(x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.closePath();
  }

  static circle(ctx: any, x: number, y: number, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
  }

  static losange(ctx: any, x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.closePath();
  }

  static triangle(ctx: any, x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
  }
}
