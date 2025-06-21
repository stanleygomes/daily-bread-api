import MarkdownIt from "markdown-it";

export class MarkdownUtil {
  private static md = new MarkdownIt();

  static toHtml(markdown: string): string {
    return this.md.render(markdown);
  }
}
