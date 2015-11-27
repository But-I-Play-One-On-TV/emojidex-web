/*
* emojidexPallet
*
* require: emojidex-client
*
* =LICENSE=
* Licensed under the emojidex Open License
* https://www.emojidex.com/emojidex/emojidex_open_license
*
* Copyright 2013 Genshin Souzou Kabushiki Kaisha
*/


(function() {
  var Pallet;

  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "emojidexPallet";
    defaults = {
      switch_element: $("#pallet-btn")
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.pallet = new Pallet(this);
      }

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

  Pallet = (function() {
    function Pallet(plugin) {
      this.plugin = plugin;
      this.ec = new EmojidexClient;
      this.clipboard = new Clipboard('.emoji-btn');
      this.prev_tab_content = $('<div class="tab-pane" id="prev"></div>');
      this.next_tab_content = $('<div class="tab-pane" id="next"></div>');
      this.setPallet(this.plugin.element);
    }

    Pallet.prototype.setPallet = function(element) {
      var body,
        _this = this;
      body = '';
      return $(element).click(function(e) {
        var tab_content, tab_list;
        tab_list = $('<ul class="nav nav-pills"></ul>');
        tab_content = $('<div class="tab-content"></div>');
        return _this.ec.Search.search("face", function(result_emoji) {
          var emoji, emoji_list, _i, _len;
          emoji_list = $('<div class="emoji_list"></div>');
          for (_i = 0, _len = result_emoji.length; _i < _len; _i++) {
            emoji = result_emoji[_i];
            emoji_list.append("<button class='btn btn-default col-xs-1 emoji-btn' data-clipboard-text=':" + (emoji.code.replace(/\s/g, '_')) + ":'><img src='" + _this.ec.cdn_url + "px32/" + (emoji.code.replace(/\s/g, '_')) + ".png'></img></button>");
          }
          return _this.ec.Categories.sync(function(categories) {
            var category, _j, _len1;
            for (_j = 0, _len1 = categories.length; _j < _len1; _j++) {
              category = categories[_j];
              tab_list.append("<li class='" + (tab_list[0].children.length === 0 ? " active" : "") + "'><a href='#" + category.name + "' data-toggle='pill'>" + category.name + "</a></li>");
              tab_content.append("<div class='tab-pane " + (tab_content[0].children.length === 0 ? " active" : "") + "' id='" + category.name + "'>" + (emoji_list.html()) + "</div>");
            }
            tab_list.append($("<li class=''><a href='#prev' data-toggle='pill'>prev</a></li>").click(function(e) {
              $('.prev-search-emoji').remove();
              return _this.prev_tab_content.append("<div class='prev-search-emoji'>" + (new Date().getSeconds()) + "</div>");
            }));
            tab_list.append($("<li class=''><a href='#next' data-toggle='pill'>next</a></li>").click(function(e) {
              $('.next-search-emoji').remove();
              return _this.next_tab_content.append("<div class='next-search-emoji'>" + (new Date().getSeconds()) + "</div>");
            }));
            tab_content.append(_this.prev_tab_content);
            tab_content.append(_this.next_tab_content);
            return _this.setWindow(tab_list.add(tab_content));
          });
        });
      });
    };

    Pallet.prototype.setWindow = function(body) {
      var ep, template;
      template = $("      <div id='templage'>        <div class='window emoji-pallet'>          <div class='window-header'>            <button type='button' class='close' data-dismiss='window' aria-hidden='true'>              x            </button>            <h4 class='window-title text-primary'>            </h4>          </div>          <div class='window-body'>          </div>        </div>      </div>    ").html();
      return ep = new Window({
        template: template,
        title: 'emoji pallet',
        bodyContent: body
      });
    };

    return Pallet;

  })();

}).call(this);
