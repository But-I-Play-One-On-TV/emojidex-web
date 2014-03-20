class EmojisLoaderPOE extends EmojisLoader
  constructor: (@element, @options) ->
    super

  load: (callback) ->
    onLoadEmojisData = (emojis_data) =>
      for emoji in emojis_data
        emoji.img_url = @options.path_img + emoji.code + ".svg"

      @emojis_data = @getCategorizedData emojis_data
      @emoji_regexps = @setEmojiCSS_getEmojiRegexps @emojis_data
      @setEmojiIcon @emojis_data
      callback @
      
    # start main --------
    $.getJSON @options.path_json, onLoadEmojisData
    @