class ReplacerService extends Replacer
  constructor: (@element, @options) ->
    super
    @element = $(@element)

  replace: (callback) ->
    if @options.loadingIcon
      @setLoadingIcon()
    else
      @getEmojiDataFromAPI @onLoadEmojiData
    @

  onLoadEmojiData: (emoji_data) =>
    # fix data for At.js --------
    for emoji in emoji_data
      emoji.code = emoji.code.replace RegExp(" ", "g"), "_"
      emoji.img_url = "http://cdn.emojidex.com/emoji/px32/#{emoji.code}.png"

    @emoji_data = emoji_data
    @emoji_regexps = @setEmojiCSS_getEmojiRegexps emoji_data
    @setEmojiIcon @
    callback? @

  setLoadingIcon: ->
    searchEmoji = (element) =>
      setEmojiIcon = (loading_element, term) =>
        ec.Search.search term, (emoji_data) =>
          for emoji in emoji_data
            if emoji.code.replace(/\s/g, "_") is term
              console.log emoji
              loading_element.replaceWith @getEmojiTag term, "background-image: url(http://cdn.emojidex.com/emoji/px32/#{term}.png)"

      ec = new EmojidexClient
      loading_elements = element.find ".emojidex-loading-icon"
      for loading_element in loading_elements
        if loading_element.dataset.type is 'code'
          setEmojiIcon $(loading_element), loading_element.dataset.emoji.replace /:/g, ''

    setLoadingTag = (text) ->
      getImgTagWithEmojiData = (emoji_data, type) ->
        "<img class='emojidex-loading-icon' data-emoji='#{emoji_data}' data-type='#{type}'></img>"

      # need update when new utf emoji added --------
      regexp_utf = '✅|🎭|🎵|🎶|💘|💡|💢|💤|💥|💧|💨|💩|💪|💫|💯|💲|💹|📈|📧|📩|🔀|🔁|🔄|🔇|🔉|🔖|🔗|🔙|🔚|🔛|🔜|🔝|🔡|🔢|🔣|🔤|🔥|🔲|🔳|🔵|🔶|🔷|🔸|🔹|🔺|🔻|🔽|🗤|🗥|🗧|🗨|🗩|🗪|🗫|🗬|🗭|🗯|🗯|🗱|🗵|🗶|🗷|🗸|🗹|↔|↖|↗|↘|↙|↪|⏬|▪|▫|◻|◼|☑|✔|✖|✳|✴|❌|➖|➗|⤴|⤵|⬛|⬜|⭐|⭕|💒|💓|💔|💕|💖|💗|💙|💚|💛|💜|💝|💞|💟|💦|💬|💭|💮|💱|📉|📊|📤|📥|📶|🔂|🔃|🔅|🔆|🔊|🔕|🔘|🔞|🔠|🔴|🔼|🔾|🔿|🗠|🗦|🗰|🗲|🗴|🚫|‼|⁉|↕|⏩|⏪|⏫|▶|◀|⚪|⚫|⛔|✨|❇|❎|❓|❔|❕|❗|❤|➕|➡|➰|⬅|⬆|⬇|〰|↩|◽|◾|☙|⛋|〽️|㊙|🅿|🆒|🆓|🆔|🆕|🆖|🆗|🆘|🆙|🆚|🇴|🇵|🇶|🇷|🇸|🇹|🇺|🇻|🇼|🇽|🇾|🇿|🇨🇳|🇩🇪|🇪🇸|🇫🇷|🇬🇧|🇮🇹|🇯🇵|🇰🇷|🇷🇺|🇺🇸|🈁|🈂|🈚|🈯|🈲|🈳|🈴|🈵|🈶|🈷|🈸|🈹|🈺|🉐|🉑|📲|🕅|🗕|🗖|🗗|🗙|🗚|🗛|🗜|🗝|🗞|🗟|🗳|🗺|🚩|🚬|🚮|🚱|🚹|🚺|🚻|🚾|#️⃣|️1️⃣|️2️⃣|️3️⃣|️4️⃣|️5️⃣|️6️⃣|️7️⃣|️8️⃣|️9️⃣|️0️⃣|™|Ⓜ️|♈|♉|♊|♋|♌|♍|♎|♓|♠|♣|♥|⚠|➿|🅰|🅱|🅾|🆎|🆑|🇦|🇧|🇨|🇩|🇪|🇫|🇬|🇭|🇮|🇯|🇰|🇱|🇲|🇳|📳|📴|📵|🔟|🕉|🕲|🗘|🚭|🚯|🚰|🚳|🚷|🚸|🚼|🛂|🛃|🛄|🛅|©|®|ℹ|♏|♐|♑|♒|♦|♻|♿|⛎|✡|㊗|🕀|🕁|🕂|🕃|🕄|☊|☋|☌|☍|☠|☡|☢|☣|☤|☥|☦|☧|☨|☩|☪|☫|☬|☭|☮|☯|☰|☱|☲|☳|☴|☵|☶|☷|☸|☿|♀|♁|♂|♃|♄|♅|♆|♇|♔|♕|♖|♗|♘|♙|♚|♛|♜|♝|♞|♟|♩|♬|♭|♮|♯|♰|♱|♳|♴|♵|♶|♷|♸|♹|♺|♼|♽|⚆|⚇|⚈|⚉|⚊|⚋|⚌|⚍|⚎|⚏|⚒|⚔|⚕|⚖|⚗|⚘|⚙|⚛|⚜|⚝|⚞|⚟|⚢|⚣|⚤|⚥|⚦|⚧|⚨|⚩|⚭|⚮|⚯|⚱|⚲|⚳|⚴|⚵|⚶|⚷|⚸|⚹|⚺|⚻|⚼|⛇|⛌|⛍|⛏|⛐|⛑|⛒|⛓|⛕|⛖|⛗|⛘|⛙|⛚|⛛|⛜|⛝|⛞|⛟|⛠|⛡|⛣|⛤|⛧|⛭|⛮|⛯|⛶|⛼|⛿|🌬|🎅|🏂|🏃|🏄|🏇|🏊|🏋|🏌|🏍|🏎|👀|👁|👂|👃|🗢|👅|👣|👦|👧|👨|👩|👪|👫|👬|👭|👮|👯|👱|👲|👴|👵|👶|👸|👻|👼|👽|👾|👿|💀|💁|💂|💃|💆|💇|💏|🗣|🚴|🚶|👤|👥|👰|👳|👷|👹|👺|💑|🕴|🕵|🚵|⛸|⛹|😂🏾|😋🏾|😙🏾|😚🏾|😛🏾|😠🏾|😢🏾|😥🏾|😩🏾|😪🏾|😭🏾|😯🏾|😱🏾|😳🏾|😷🏾|😂🏿|😃🏿|😉🏿|😉🏾|😊🏿|😋🏿|😓🏿|😔🏿|😗🏿|😙🏿|😚🏿|😛🏿|😟🏿|😠🏿|😢🏿|😤🏿|😥🏿|😨🏿|😩🏿|😪🏿|😬🏿|😭🏿|😯🏿|😱🏿|😳🏿|😴🏿|😷🏿|😒🏾|😒🏿|☺🏾|☺🏿|😌🏾|😌🏿|😁🏾|😁🏿|😏🏾|😏🏿|😄🏾|😄🏿|😆🏾|😆🏿|😃🏾|😇🏾|😊🏾|😎🏾|😐🏾|😑🏾|😓🏾|😔🏾|😕🏾|😖🏾|😗🏾|😞🏾|😟🏾|😣🏾|😤🏾|😦🏾|😧🏾|😨🏾|😫🏾|😬🏾|😮🏾|😰🏾|😲🏾|😴🏾|😵🏾|😶🏾|😇🏿|😎🏿|😐🏿|😑🏿|😕🏿|😖🏿|😞🏿|😣🏿|😦🏿|😧🏿|😫🏿|😮🏿|😰🏿|😲🏿|😵🏿|😶🏿|😅🏾|😅🏿|😘🏾|😘🏿|😝🏾|😝🏿|😜🏾|😜🏿|😍🏾|😍🏿|😁🏽|😀|😁|😂|😃|😄|😅|😆|😇|😈|😉|😊|😋|😌|😍|😎|😏|😑|😒|😓|😔|😕|😖|😗|😜|😝|😞|😟|😠|😡|😢|😣|😤|😦|😧|😨|😩|😪|😫|😬|😭|😯|😰|😱|😲|😳|😴|😵|😶|😷|😹|😼|☺|😐|😘|😙|😚|😛|😥|😮|😸|😺|😻|😽|😾|😿|🙀|☹|☻|🌀|🌁|🌂|🌃|🌄|🌅|🌆|🌇|🌈|🌉|🌊|🌋|🌍|🌎|🌏|🌐|☽|☾|🌡|🌢|🌣|🌤|🌥|🌦|🌧|🌨|🌩|🌪|🌫|🌰|🌱|🌲|🌳|🌴|🌵|🌶|🌷|🌸|🌹|🌺|🌻|🌼|🌾|🌿|🍀|🍁|🍂|🍃|🏔|🐀|🐁|🐂|🐃|🐄|🐅|🐆|🐇|🐈|🐉|🐊|🐋|🐌|🐍|🐎|🐏|🐐|🐑|🐒|🐓|🐔|🐕|🐖|🐗|🐘|🐙|🐚|🐛|🐜|🐝|🐞|🐟|🐠|🐡|🐢|🐣|🐤|🐥|🐦|🐧|🐨|🐩|🐪|🐫|🐬|🐭|🐮|🐯|🐰|🐱|🐲|🐳|🐴|🐵|🐶|🐷|🐸|🐹|🐺|🐻|🐼|🐽|🐾|🐿|🕷|🗻|🗾|☀|☁|⚡|⛄|🕊|🕸|☔|⛅|❄|☄|★|☈|☼|⛳|⛺|✉|🃏|🎀|🎁|🎃|🎄|🎆|🎇|🎈|🎉|🎊|🎋|🎌|🎍|🎎|🎏|🎐|🎑|🎒|🎓|🎔|🎕|🎖|🎗|🎘|🎙|🎚|🎛|🎜|🎝|🎞|🎟|🎠|🎡|🎢|🎣|🎤|🎥|🎦|🎧|🎨|🎩|🎪|🎫|🎬|🎮|🎯|🎰|🎱|🎲|🎳|🎴|🎷|🎸|🎹|🎺|🎻|🎼|🎽|🎾|🎿|🏀|🏁|🏅|🏆|🏈|🏉|🏕|🏖|🏗|🏘|🏙|🏚|🏛|🏱|🏲|🏳|🏴|🏵|🏶|🏷|👑|👒|👓|👔|👕|👖|👗|👘|👙|👚|👛|👜|👝|👞|👟|👠|👡|👢|💄|💅|💈|💉|💊|💋|💍|💎|💐|💰|💳|💴|💵|💶|💷|💺|💻|💼|💽|💾|💿|📀|📁|📅|📆|📇|📋|📌|📎|📒|📓|📔|📖|📘|📙|📚|📛|📜|📝|📟|📠|📡|📢|📣|📦|📫|📭|📮|📯|📰|📱|📷|📹|📺|📻|📼|🔈|🔋|🔌|🔍|🔎|🔐|🔑|🔒|🔓|🔔|🔰|🔱|🕐|🕑|🕒|🕓|🕔|🕕|🕖|🕗|🕘|🕙|🕚|🕛|🕜|🕝|🕞|🕟|🕠|🕡|🕢|🕣|🕤|🕫|🕬|🕯|🕱|🕳|🕹|🕻|🕼|🕽|🕾|🕿|🖀|🖁|🖄|🖆|🖊|🖋|🖧|🖨|🖪|🖫|🖬|🖲|🖴|🖵|🖶|🖷|🖺|🖿|🗀|🗀|🗃|🗄|🗅|🗈|🗉|🗊|🗌|🗍|🗎|🗏|🗐|🗑|🗼|🗿|🚧|🚪|🚽|🚿|🛀|🛁|⌚️|⌛|⏳|☎|☕|⚽|⚾|✂|✏|✒|🀄|💌|💸|📂|📃|📄|📍|📏|📐|📑|📕|📗|📞|📨|📪|📬|📸|📽|📾|🔏|🔮|🔯|🕄|🕆|🕇|🕈|🕥|🕦|🕧|🕨|🕩|🕪|🕭|🕰|🕶|🖂|🖃|🖅|🖇|🖈|🖉|🖌|🖍|🖥|🖦|🖩|🖭|🖮|🖯|🖰|🖱|🖳|🖸|🖹|🖻|🖼|🖽|🖾|🗂|🗆|🗇|🗋|🗒|🗓|🗔|🗽|🚥|🚦|🚨|⏰|☖|☗|⚀|⚁|⚂|⚃|⚄|⚅|⚰|⛀|⛁|⛂|⛃|⛉|⛊|💣|🔦|🔧|🔨|🔪|🔫|🔭|🔩|🔬|🗡|✌|👆|👇|👈|👉|👊|👋|👌|👍|👎|👏|🖎|🖏|🖒|🖔|🙊|👐|🖐|🖑|🖓|🖗|🖘|🖙|🖚|🖛|🖜|🖝|🖞|🖟|🖠|🖡|🖢|🖣|🙅|🙆|🙇|🙈|🙉|🙋|🙌|🙍|🙎|🙏|☝|✊|✋|🖖|☚|☛|🚂|🚄|🚅|🚔|🚕|🚘|🚛|🚞|🚟|🚠|🚡|🚀|🚁|🚃|🚆|🚇|🚈|🚉|🚊|🚋|🚌|🚍|🚎|🚏|🚐|🚑|🚒|🚓|🚖|🚗|🚙|🚚|🚜|🚝|🚢|🚣|🚤|🚲|⚓|⛵|✈|🌽|🍄|🍅|🍆|🍇|🍈|🍉|🍊|🍋|🍌|🍍|🍎|🍏|🍐|🍑|🍒|🍓|🍔|🍕|🍖|🍗|🍘|🍙|🍚|🍛|🍜|🍝|🍞|🍟|🍠|🍡|🍢|🍣|🍤|🍥|🍦|🍧|🍨|🍩|🍪|🍫|🍬|🍭|🍮|🍯|🍰|🍱|🍲|🍳|🍴|🍵|🍶|🍷|🍸|🍹|🍺|🍻|🍼|🍽|🎂|⛲|⛽|🏜|🏝|🏞|🏟|🏠|🏡|🏢|🏣|🏤|🏥|🏦|🏧|🏨|🏩|🏪|🏫|🏬|🏭|🏮|🏯|🏰|⛪|♨|⛩|⛬|⛱|🌌|🌒|🌔|🌖|🌘|🌙|🌚|🌛|🌜|🌝|🌞|🌟|🌠|🌕|🌑'

      text = text.replace new RegExp(regexp_utf, "g"), (matched_string) ->
        getImgTagWithEmojiData matched_string, "utf"
      text = text.replace /:([^:]+):/g, (matched_string, pattern1) ->
        getImgTagWithEmojiData matched_string, "code"

    # start setLoadingIcon --------
    @element_clone = @element.clone()

    text_nodes = @element.find(":not(iframe,textarea,script)").andSelf().contents().filter ->
      @nodeType is Node.TEXT_NODE
    for text_node in text_nodes
      text = text_node.textContent
      text = setLoadingTag text
      $(text_node).replaceWith text

    searchEmoji $ @element
    # @getEmojiDataFromAPI @onLoadEmojiData

  getEmojiDataFromAPI: (callback) ->
    loaded_num = 0
    user_names = @options.userNames
    emoji_data = []

    for user_name in user_names
      $.ajax
        url: "https://www.emojidex.com/api/v1/users/" + user_name + "/emoji"
        dataType: "json"
        type: "get"

        success: (user_emoji_json, status, xhr) ->
          emoji_data = emoji_data.concat user_emoji_json.emoji
          if ++loaded_num is user_names.length
            callback emoji_data

        error: (data) ->
          console.log "error: load json"
          console.log data
