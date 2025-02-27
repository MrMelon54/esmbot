import { play } from "../../utils/soundplayer.js";
import MusicCommand from "../../classes/musicCommand.js";
const prefixes = ["ytsearch:", "ytmsearch:", "scsearch:", "spsearch:", "amsearch:"];

class PlayCommand extends MusicCommand {
  async run() {
    const input = this.options.query ?? this.args.join(" ");
    if (!input && ((!this.message || this.message?.attachments.length <= 0))) {
      this.success = false;
      return "You need to provide what you want to play!";
    }
    let query = input ? input.trim() : "";
    const attachment = this.type === "classic" ? this.message.attachments[0] : null;
    if (query.startsWith("||") && query.endsWith("||")) {
      query = query.substring(2, query.length - 2);
    }
    if (query.startsWith("<") && query.endsWith(">")) {
      query = query.substring(1, query.length - 1);
    }
    try {
      const url = new URL(query);
      return await play(this.client, url, { channel: this.channel, member: this.member, type: this.type, interaction: this.interaction }, true);
    } catch {
      const search = prefixes.some(v => query.startsWith(v)) ? query : !query && attachment ? attachment.url : `ytsearch:${query}`;
      return await play(this.client, search, { channel: this.channel, member: this.member, type: this.type, interaction: this.interaction }, true);
    }
  }

  static flags = [{
    name: "query",
    type: 3,
    description: "An audio search query or URL",
    required: true
  }];
  static description = "Plays a song or adds it to the queue";
  static aliases = ["p"];
  static arguments = ["[url]"];
}

export default PlayCommand;
