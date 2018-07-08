module.exports = function(type, guild) {
    const emojis = {
      nope: {name: "nope", id: {external: "<:xmark:314349398824058880>", internal: ":no_entry_sign:"} },
      ok: {name: "ok", id: {external: "<:check:314349398811475968>", internal: ":white_check_mark:"} },
      success: {name: "success", id: {external: "<:check:314349398811475968>", internal: ":white_check_mark:"} },
      info: {name: "info", id: {external: "<:info:374192576053379082>", internal: ":information_source:"} },
      warning: {name: "warning", id: {external: "<:warning:401340421478809600>", internal: ":warning:"} },
      empty: {name: "empty", id: {external: "<:empty:314349398723264512>", internal: ":large_orange_diamond:"} },
      incomplete: {name: "incomplete", id: {external: "<:empty:314349398723264512>", internal: ":large_orange_diamond:"} },
      bot: {name: "bot", id: {external: "<:botTag:230105988211015680>", internal: "[BOT]"} },
      online: {name: "online", id: {external: "<:online:313956277808005120>", internal: ":white_small_square:"} },
      offline: {name: "offline", id: {external: "<:offline:313956277237710868>", internal: ":black_small_square:"} },
      idle: {name: "idle", id: {external: "<:away:313956277220802560>", internal: ":small_orange_diamond:"} },
      dnd: {name: "dnd", id: {external: "<:dnd:313956276893646850>", internal: ":small_red_triangle_down:"} },
      challenge: {name: "challenge", id: {external: "<:swordsemoji:373752217628442635>", internal: ":crossed_swords:"} },
      edit: {name: "edit", id: {external: "<:edit:383748366817034241>", internal: ":pencil:"} },
      bin: {name: "bin", id: {external: "<:bin:383899733128773635>", internal: ":wastebasket:"} },
      nitro: {name: "nitro", id: {external: "<:nitro:314068430611415041>", internal: "[NITRO]"} },
      loading: {name: "loading", id: {external: "<a:loading:393852367751086090>", internal: "❖"} },
      typing: {name: "typing", id: {external: "<a:typing:393848431413559296>", internal: ":large_orange_diamond:"} },
      donator: {name: "donator", id: {external: "<:donator:458907386204127244>", internal: ":moneybag:"}}
    }

    const useExternal = (process.argv[2] !== "--beta" ? (guild.me == null ? false : guild.me.hasPermission("USE_EXTERNAL_EMOJIS")) : false);
    return useExternal ? emojis[type].id.external : emojis[type].id.internal;
}
