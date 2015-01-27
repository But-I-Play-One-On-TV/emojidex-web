/*
 * jQuery emojidex - v0.2.0
 * emojidex plugin for jQuery/Zepto and compatible
 * https://github.com/emojidex/emojidex-web
 *
 * Includes:
 *   emojidex-client, emojidexReplace, emojidexAutocomplete
 *
 * =LICENSE=
 * Licensed under the emojidex Open License
 * https://www.emojidex.com/emojidex/emojidex_open_license
 *
 * Copyright 2013 Genshin Souzou Kabushiki Kaisha
 */
(function(){this.EmojidexClient=function(){function a(a){null==a&&(a={}),this.defaults={locale:"en",api_uri:"https://www.emojidex.com/api/v1/",cdn_uri:"http://cdn.emojidex.com/emoji",size_code:"px32",detailed:!1,limit:32},a=$.extend({},this.defaults,a),this.api_uri=a.api_uri,this.cdn_uri=a.cdn_uri,this.size_code=a.size_code,this.detailed=a.detailed,this.limit=a.limit,this._init_storages(a),this.results=a.results||[],this.cur_page=a.page||1,this.cur_limit=this.limit,this.count=a.count||0,this._auto_login(),this.next=function(){return null}}return a.prototype._init_storages=function(a){return this.storage=$.localStorage,this.storage.isSet("emojidex")||this.storage.set("emojidex",{}),this.storage.isSet("emojidex.emoji")||this.storage.set("emojidex.emoji",a.emoji||[]),this.emoji=this.storage.get("emojidex.emoji"),this.storage.isSet("emojidex.history")||this.storage.set("emojidex.history",a.history||[]),this.history=this.storage.get("emojidex.history"),this.storage.isSet("emojidex.favorites")||this.storage.set("emojidex.favorites",a.favorites||[]),this.favorites=this.storage.get("emojidex.favorites"),this.storage.isSet("emojidex.categories")||this.storage.set("emojidex.categories",a.categories||[]),this.categories=this.storage.get("emojidex.categories"),this._pre_cache(a)},a.prototype._pre_cache=function(a){if(0===this.emoji.length)switch(a.locale){case"en":this.user_emoji("emoji"),this.user_emoji("emojidex");break;case"ja":this.user_emoji("絵文字"),this.user_emoji("絵文字デックス")}return 0===this.categories.length?this.get_categories(null,{locale:a.locale}):void 0},a.prototype._auto_login=function(){return null!=this.storage.get("emojidex.auth_token")?(this.auth_status=this.storage.get("emojidex.auth_status"),this.auth_token=this.storage.get("emojidex.auth_token"),this.user=this.storage.get("emojidex.user"),this.get_user_data()):this.logout()},a.prototype.search=function(a,b,c){var d=this;return null==b&&(b=null),this.next=function(){return this.search(a,b,$.extend(c,{page:c.page+1}))},c=this._combine_opts(c),$.getJSON(this.api_uri+"search/emoji?"+$.param($.extend({},{code_cont:this._escape_term(a)},c))).error(function(){return d.results=[]}).success(function(a){return d._succeed(a,b)})},a.prototype.tag_search=function(a,b,c){var d=this;return null==b&&(b=null),this.next=function(){return this.tag_search(term,b,$.extend(c,{page:c.page+1}))},c=this._combine_opts(c),$.getJSON(this.api_uri+"search/emoji?"+$.param($.extend({},{"tags[]":this._breakout(a)},c))).error(function(){return d.results=[]}).success(function(a){return d._succeed(a,b)})},a.prototype.advanced_search=function(a,b,c,d,e){var f,g=this;return null==b&&(b=[]),null==c&&(c=[]),null==d&&(d=null),this.next=function(){return this.advanced_search(a,b,c,d,$.extend(e,{page:e.page+1}))},e=this._combine_opts(e),f={code_cont:this._escape_term(a)},b.length>0&&(f=$.extend(f,{"tags[]":this._breakout(b)})),c.length>0&&(f=$.extend(f,{"categories[]":this._breakout(c)})),$.getJSON(this.api_uri+"search/emoji?"+$.param($.extend(f,e))).error(function(){return g.results=[]}).success(function(a){return g._succeed(a,d)})},a.prototype.user_emoji=function(a,b,c){var d=this;return null==b&&(b=null),c=this._combine_opts(c),$.getJSON(this.api_uri+"users/"+a+"/emoji?"+$.param(c)).error(function(){return d.results=[]}).success(function(a){return d._succeed(a,b)})},a.prototype.get_categories=function(a,b){var c=this;return null==a&&(a=null),b=this._combine_opts(b),$.getJSON(this.api_uri+"categories?"+$.param(b)).error(function(){return c.categories=[],c.storage.set("emojidex.categories",c.categories)}).success(function(b){return c.categories=b.categories,c.storage.set("emojidex.categories",c.categories),a?a(b.categories):void 0})},a.prototype.login=function(a){switch(a.authtype){case"plain":return this._plain_login(a.username,a.password,a.callback);case"google":return this._google_login(a.callback);default:return this._auto_login()}},a.prototype.logout=function(){return this.auth_status="none",this.storage.set("emojidex.auth_status",this.auth_status),this.user="",this.storage.set("emojidex.user",this.user),this.auth_token=null,this.storage.set("emojidex.auth_token",this.auth_token)},a.prototype._plain_login=function(a,b,c){var d,e=this;return null==c&&(c=null),d=this.api_uri+"users/authenticate?"+$.param({username:a,password:b}),$.getJSON(d).error(function(a){return e.auth_status=a.auth_status,e.auth_token=null,e.user=""}).success(function(a){return e._set_auth_from_response(a),c?c(a.auth_token):void 0})},a.prototype._google_login=function(a){return null==a&&(a=null),!1},a.prototype._set_auth_from_response=function(a){return this.auth_status=a.auth_status,this.storage.set("emojidex.auth_status",this.auth_status),this.auth_token=a.auth_token,this.storage.set("emojidex.auth_token",this.auth_token),this.user=a.auth_user,this.storage.set("emojidex.user",this.user),this.get_user_data()},a.prototype.get_user_data=function(){return this.get_favorites(),this.get_history()},a.prototype.get_history=function(){var a=this;return null!=this.auth_token?$.getJSON(this.api_uri+"users/history?"+$.param({auth_token:this.auth_token})).error(function(){return a.history=[]}).success(function(b){return a.history=b}):void 0},a.prototype.set_history=function(a){return null!=this.auth_token?$.post(this.api_uri+"users/history?"+$.param({auth_token:this.auth_token,emoji_code:a})):void 0},a.prototype.get_favorites=function(){return null!=this.auth_token?$.ajax({url:this.api_uri+"users/favorites",data:{auth_token:this.auth_token},success:function(a){return this.favorites=a},error:function(){return this.favorites=[]}}):void 0},a.prototype.set_favorites=function(a){return null!=this.auth_token?$.ajax({type:"POST",url:this.api_uri+"users/favorites",data:{auth_token:this.auth_token,emoji_code:a},success:function(){}}):void 0},a.prototype.unset_favorites=function(a){return null!=this.auth_token?$.ajax({type:"DELETE",url:this.api_uri+"users/favorites",data:{auth_token:this.auth_token,emoji_code:a},success:function(){}}):void 0},a.prototype.combine_emoji=function(a){return $.extend(this.emoji,a)},a.prototype.simplify=function(a,b){var c,d,e,f;for(null==a&&(a=this.results),null==b&&(b=this.size_code),f=[],d=0,e=a.length;e>d;d++)c=a[d],f.push({code:this._escape_term(c.code),img_url:""+this.cdn_uri+"/"+b+"/"+this._escape_term(c.code)+".png"});return f},a.prototype._combine_opts=function(a){return $.extend({},{page:1,limit:this.limit,detailed:this.detailed},a)},a.prototype._succeed=function(a,b){return this.results=a.emoji,this.cur_page=a.meta.page,this.count=a.meta.count,this.combine_emoji(a.emoji),b?b(a.emoji):void 0},a.prototype._breakout=function(a){return null===a?[]:(a instanceof Array||(a=[a]),a)},a.prototype._escape_term=function(a){return a.split(" ").join("_")},a.prototype._de_escape_term=function(a){return a.split("_").join(" ")},a}()}).call(this);
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function t(t){var r,i,n,o=arguments.length,s=window[t],a=arguments,u=a[1];if(2>o)throw Error("Minimum 2 arguments must be given");if(e.isArray(u)){i={};for(var f in u){r=u[f];try{i[r]=JSON.parse(s.getItem(r))}catch(c){i[r]=s.getItem(r)}}return i}if(2!=o){try{i=JSON.parse(s.getItem(u))}catch(c){throw new ReferenceError(u+" is not defined in this storage")}for(var f=2;o-1>f;f++)if(i=i[a[f]],void 0===i)throw new ReferenceError([].slice.call(a,1,f+1).join(".")+" is not defined in this storage");if(e.isArray(a[f])){n=i,i={};for(var m in a[f])i[a[f][m]]=n[a[f][m]];return i}return i[a[f]]}try{return JSON.parse(s.getItem(u))}catch(c){return s.getItem(u)}}function r(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1],u=s[2],f={};if(2>n||!e.isPlainObject(a)&&3>n)throw Error("Minimum 3 arguments must be given or second parameter must be an object");if(e.isPlainObject(a)){for(var c in a)r=a[c],e.isPlainObject(r)?o.setItem(c,JSON.stringify(r)):o.setItem(c,r);return a}if(3==n)return"object"==typeof u?o.setItem(a,JSON.stringify(u)):o.setItem(a,u),u;try{i=o.getItem(a),null!=i&&(f=JSON.parse(i))}catch(m){}i=f;for(var c=2;n-2>c;c++)r=s[c],i[r]&&e.isPlainObject(i[r])||(i[r]={}),i=i[r];return i[s[c]]=s[c+1],o.setItem(a,JSON.stringify(f)),f}function i(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1];if(2>n)throw Error("Minimum 2 arguments must be given");if(e.isArray(a)){for(var u in a)o.removeItem(a[u]);return!0}if(2==n)return o.removeItem(a),!0;try{r=i=JSON.parse(o.getItem(a))}catch(f){throw new ReferenceError(a+" is not defined in this storage")}for(var u=2;n-1>u;u++)if(i=i[s[u]],void 0===i)throw new ReferenceError([].slice.call(s,1,u).join(".")+" is not defined in this storage");if(e.isArray(s[u]))for(var c in s[u])delete i[s[u][c]];else delete i[s[u]];return o.setItem(a,JSON.stringify(r)),!0}function n(t,r){var n=a(t);for(var o in n)i(t,n[o]);if(r)for(var o in e.namespaceStorages)u(o)}function o(r){var i=arguments.length,n=arguments,s=(window[r],n[1]);if(1==i)return 0==a(r).length;if(e.isArray(s)){for(var u=0;u<s.length;u++)if(!o(r,s[u]))return!1;return!0}try{var f=t.apply(this,arguments);e.isArray(n[i-1])||(f={totest:f});for(var u in f)if(!(e.isPlainObject(f[u])&&e.isEmptyObject(f[u])||e.isArray(f[u])&&!f[u].length)&&f[u])return!1;return!0}catch(c){return!0}}function s(r){var i=arguments.length,n=arguments,o=(window[r],n[1]);if(2>i)throw Error("Minimum 2 arguments must be given");if(e.isArray(o)){for(var a=0;a<o.length;a++)if(!s(r,o[a]))return!1;return!0}try{var u=t.apply(this,arguments);e.isArray(n[i-1])||(u={totest:u});for(var a in u)if(void 0===u[a]||null===u[a])return!1;return!0}catch(f){return!1}}function a(r){var i=arguments.length,n=window[r],o=arguments,s=(o[1],[]),a={};if(a=i>1?t.apply(this,o):n,a._cookie)for(var u in e.cookie())""!=u&&s.push(u.replace(a._prefix,""));else for(var f in a)s.push(f);return s}function u(t){if(!t||"string"!=typeof t)throw Error("First parameter must be a string");g?(window.localStorage.getItem(t)||window.localStorage.setItem(t,"{}"),window.sessionStorage.getItem(t)||window.sessionStorage.setItem(t,"{}")):(window.localCookieStorage.getItem(t)||window.localCookieStorage.setItem(t,"{}"),window.sessionCookieStorage.getItem(t)||window.sessionCookieStorage.setItem(t,"{}"));var r={localStorage:e.extend({},e.localStorage,{_ns:t}),sessionStorage:e.extend({},e.sessionStorage,{_ns:t})};return e.cookie&&(window.cookieStorage.getItem(t)||window.cookieStorage.setItem(t,"{}"),r.cookieStorage=e.extend({},e.cookieStorage,{_ns:t})),e.namespaceStorages[t]=r,r}function f(e){if(!window[e])return!1;var t="jsapi";try{return window[e].setItem(t,t),window[e].removeItem(t),!0}catch(r){return!1}}var c="ls_",m="ss_",g=f("localStorage"),h={_type:"",_ns:"",_callMethod:function(e,t){var r=[this._type],t=Array.prototype.slice.call(t),i=t[0];return this._ns&&r.push(this._ns),"string"==typeof i&&-1!==i.indexOf(".")&&(t.shift(),[].unshift.apply(t,i.split("."))),[].push.apply(r,t),e.apply(this,r)},get:function(){return this._callMethod(t,arguments)},set:function(){var t=arguments.length,i=arguments,n=i[0];if(1>t||!e.isPlainObject(n)&&2>t)throw Error("Minimum 2 arguments must be given or first parameter must be an object");if(e.isPlainObject(n)&&this._ns){for(var o in n)r(this._type,this._ns,o,n[o]);return n}var s=this._callMethod(r,i);return this._ns?s[n.split(".")[0]]:s},remove:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},removeAll:function(e){return this._ns?(r(this._type,this._ns,{}),!0):n(this._type,e)},isEmpty:function(){return this._callMethod(o,arguments)},isSet:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(s,arguments)},keys:function(){return this._callMethod(a,arguments)}};if(e.cookie){window.name||(window.name=Math.floor(1e8*Math.random()));var l={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(t,r){e.cookie(this._prefix+t,r,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(t){return e.cookie(this._prefix+t)},removeItem:function(t){return e.removeCookie(this._prefix+t)},clear:function(){for(var t in e.cookie())""!=t&&(!this._prefix&&-1===t.indexOf(c)&&-1===t.indexOf(m)||this._prefix&&0===t.indexOf(this._prefix))&&e.removeCookie(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};g||(window.localCookieStorage=e.extend({},l,{_prefix:c,_expires:3650}),window.sessionCookieStorage=e.extend({},l,{_prefix:m+window.name+"_"})),window.cookieStorage=e.extend({},l),e.cookieStorage=e.extend({},h,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}e.initNamespaceStorage=function(e){return u(e)},g?(e.localStorage=e.extend({},h,{_type:"localStorage"}),e.sessionStorage=e.extend({},h,{_type:"sessionStorage"})):(e.localStorage=e.extend({},h,{_type:"localCookieStorage"}),e.sessionStorage=e.extend({},h,{_type:"sessionCookieStorage"})),e.namespaceStorages={},e.removeAllStorages=function(t){e.localStorage.removeAll(t),e.sessionStorage.removeAll(t),e.cookieStorage&&e.cookieStorage.removeAll(t),t||(e.namespaceStorages={})}});
(function() {
  var AutoComplete;

  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "emojidexAutocomplete";
    defaults = {
      limit: 10
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.autocomplete = new AutoComplete(this);
        this.autocomplete.setAutoComplete();
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

  AutoComplete = (function() {
    function AutoComplete(plugin) {
      this.plugin = plugin;
    }

    AutoComplete.prototype.setAutoComplete = function() {
      var at_init, ec, getMatchString, getRegexp, searching_num, setAtwho, setSearchedEmojiData,
        _this = this;
      setAtwho = function(at_options) {
        return $(_this.plugin.element).atwho(at_options).on('reposition.atwho', function(e) {
          return $(e.currentTarget).atwho(at_options);
        }).on('hidden.atwho', function(e) {
          return $(e.currentTarget).atwho(at_options);
        });
      };
      setSearchedEmojiData = function(at_obj, match_string) {
        var num, updateAtwho;
        updateAtwho = function(searched_data) {
          var at_options;
          at_options = {
            data: searched_data,
            callbacks: {
              matcher: function(flag, subtext, should_startWithSpace) {
                return getMatchString(subtext, getRegexp(flag, should_startWithSpace));
              }
            }
          };
          return at_obj.$inputor.atwho('destroy').atwho($.extend({}, at_obj.setting, at_options)).atwho('run');
        };
        num = ++searching_num;
        ec.search(match_string, function(response) {
          var searched_data;
          searched_data = ec.simplify();
          if (searching_num === num) {
            if (searched_data.length) {
              return updateAtwho(searched_data);
            }
          }
        });
        return match_string;
      };
      getRegexp = function(flag, should_startWithSpace) {
        var regexp, _a, _y;
        _a = decodeURI("%C3%80");
        _y = decodeURI("%C3%BF");
        flag = flag.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        if (should_startWithSpace) {
          flag = '(?:^|\\s)' + flag;
        }
        return regexp = new RegExp("" + flag + "([A-Za-z" + _a + "-" + _y + "0-9_\+\-]*)$|" + flag + "([^\\x00-\\xff]*)$", 'gi');
      };
      getMatchString = function(subtext, regexp) {
        var match;
        match = regexp.exec(subtext);
        return match = match ? match[2] || match[1] : null;
      };
      searching_num = 0;
      ec = new EmojidexClient;
      at_init = {
        at: ":",
        limit: this.plugin.options.limit,
        search_key: "code",
        tpl: "<li data-value=':${code}:'><img src='${img_url}' height='20' width='20' /> ${code}</li>",
        insert_tpl: "<img src='${img_url}' height='20' width='20' />",
        callbacks: {
          matcher: function(flag, subtext, should_startWithSpace) {
            var match;
            match = getMatchString(subtext, getRegexp(flag, should_startWithSpace));
            if (match) {
              return setSearchedEmojiData(this, match);
            }
          }
        }
      };
      return setAtwho(at_init);
    };

    return AutoComplete;

  })();

}).call(this);

(function() {
  var Replacer, ReplacerService,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "emojidexReplace";
    defaults = {
      userNames: ['emoji', 'emojidex']
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.api_emoji_replacer = new ReplacerService(this.element, this.options);
        this.api_emoji_replacer.replace();
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

  Replacer = (function() {
    function Replacer() {}

    Replacer.prototype.emoji_data = null;

    Replacer.prototype.element = null;

    Replacer.prototype.options = null;

    Replacer.prototype.emoji_regexps = null;

    Replacer.prototype.getCategorizedData = function(emoji_data) {
      var emoji, new_emoji_data, _i, _len;
      new_emoji_data = {};
      for (_i = 0, _len = emoji_data.length; _i < _len; _i++) {
        emoji = emoji_data[_i];
        if (emoji.category === null) {
          if (new_emoji_data.uncategorized == null) {
            new_emoji_data.uncategorized = [emoji];
          } else {
            new_emoji_data.uncategorized.push(emoji);
          }
        } else {
          if (new_emoji_data[emoji.category] == null) {
            new_emoji_data[emoji.category] = [emoji];
          } else {
            new_emoji_data[emoji.category].push(emoji);
          }
        }
      }
      return new_emoji_data;
    };

    Replacer.prototype.setEmojiCSS_getEmojiRegexps = function(emoji_data) {
      var category, emoji, emoji_css, emoji_in_category, regexp_for_code, regexp_for_utf, _i, _len;
      regexp_for_utf = "";
      regexp_for_code = ":(";
      emoji_css = $('<style type="text/css" />');
      for (category in emoji_data) {
        emoji_in_category = emoji_data[category];
        for (_i = 0, _len = emoji_in_category.length; _i < _len; _i++) {
          emoji = emoji_in_category[_i];
          regexp_for_utf += emoji.moji + "|";
          regexp_for_code += emoji.code + "|";
          emoji_css.append("i.emojidex-" + emoji.code + " {background-image: url('" + emoji.img_url + "')}");
        }
      }
      $("head").append(emoji_css);
      return {
        utf: regexp_for_utf.slice(0, -1),
        code: regexp_for_code.slice(0, -1) + "):"
      };
    };

    Replacer.prototype.getEmojiTag = function(emoji_code) {
      return '<i class="emojidex-' + emoji_code + '"></i>';
    };

    Replacer.prototype.replaceForUTF = function(options) {
      var replaced_string;
      return replaced_string = options.s_replace.replace(new RegExp(options.regexp, "g"), function(matched_string) {
        var category, emoji, _i, _len, _ref;
        for (category in options.emoji_data) {
          _ref = options.emoji_data[category];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emoji = _ref[_i];
            if (emoji.moji === matched_string) {
              return Replacer.prototype.getEmojiTag(emoji.code);
            }
          }
        }
      });
    };

    Replacer.prototype.replaceForCode = function(options) {
      var replaced_string;
      return replaced_string = options.s_replace.replace(new RegExp(options.regexp, "g"), function(matched_string) {
        var category, emoji, _i, _len, _ref;
        matched_string = matched_string.replace(/:/g, "");
        for (category in options.emoji_data) {
          _ref = options.emoji_data[category];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            emoji = _ref[_i];
            if (emoji.code === matched_string) {
              return Replacer.prototype.getEmojiTag(emoji.code);
            }
          }
        }
      });
    };

    Replacer.prototype.setEmojiIcon = function(loader) {
      return $(this.element).find(":not(iframe,textarea,script)").andSelf().contents().filter(function() {
        return this.nodeType === Node.TEXT_NODE;
      }).each(function() {
        var replaced_string;
        replaced_string = this.textContent;
        if (loader.emoji_regexps.utf != null) {
          replaced_string = Replacer.prototype.replaceForUTF({
            s_replace: replaced_string,
            regexp: loader.emoji_regexps.utf,
            emoji_data: loader.emoji_data
          });
        }
        if (loader.emoji_regexps.code != null) {
          replaced_string = Replacer.prototype.replaceForCode({
            s_replace: replaced_string,
            regexp: loader.emoji_regexps.code,
            emoji_data: loader.emoji_data
          });
        }
        return $(this).replaceWith(replaced_string);
      });
    };

    return Replacer;

  })();

  ReplacerService = (function(_super) {
    __extends(ReplacerService, _super);

    function ReplacerService(element, options) {
      this.element = element;
      this.options = options;
      ReplacerService.__super__.constructor.apply(this, arguments);
    }

    ReplacerService.prototype.replace = function(callback) {
      var onLoadEmojiData,
        _this = this;
      onLoadEmojiData = function(emoji_data) {
        var emoji, _i, _len;
        for (_i = 0, _len = emoji_data.length; _i < _len; _i++) {
          emoji = emoji_data[_i];
          emoji.code = emoji.code.replace(RegExp(" ", "g"), "_");
          emoji.img_url = "http://cdn.emojidex.com/emoji/px32/" + emoji.code + ".png";
        }
        _this.emoji_data = _this.getCategorizedData(emoji_data);
        _this.emoji_regexps = _this.setEmojiCSS_getEmojiRegexps(_this.emoji_data);
        _this.setEmojiIcon(_this);
        if (callback) {
          return callback(_this);
        }
      };
      this.getEmojiDataFromAPI(onLoadEmojiData);
      return this;
    };

    ReplacerService.prototype.getEmojiDataFromAPI = function(callback) {
      var emoji_data, loaded_num, user_name, user_names, _i, _len, _results;
      loaded_num = 0;
      user_names = this.options.userNames;
      emoji_data = [];
      _results = [];
      for (_i = 0, _len = user_names.length; _i < _len; _i++) {
        user_name = user_names[_i];
        _results.push($.ajax({
          url: "https://www.emojidex.com/api/v1/users/" + user_name + "/emoji",
          dataType: "json",
          type: "get",
          success: function(user_emoji_json, status, xhr) {
            emoji_data = emoji_data.concat(user_emoji_json.emoji);
            if (++loaded_num === user_names.length) {
              return callback(emoji_data);
            }
          },
          error: function(data) {
            console.log("error: load json");
            return console.log(data);
          }
        }));
      }
      return _results;
    };

    return ReplacerService;

  })(Replacer);

}).call(this);
