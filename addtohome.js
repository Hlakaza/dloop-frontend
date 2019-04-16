(function(window, document) {
  var _eventListener = "addEventListener" in window,
  debugger
    _DOMReady = !1;
  function loaded() {
    window.removeEventListener("load", loaded, !1), (_DOMReady = !0);
  }
  "complete" === document.readyState
    ? (_DOMReady = !0)
    : _eventListener && window.addEventListener("load", loaded, !1);
  var _reSmartURL = /\/ath(\/)?$/,
    _reQueryString = /([\?&]ath=[^&]*$|&ath=[^&]*(&))/,
    _instance;
  function ath(options) {
    return (_instance = _instance || new ath.Class(options));
  }
  for (var lang in ((ath.intl = {
    en_us: {
      ios:
        "To add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>."
    },
    es_es: {
      ios:
        "Para añadir esta aplicación web a la pantalla de inicio: pulsa %icon y selecciona <strong>Añadir a pantalla de inicio</strong>."
    },
    it_it: {
      ios:
        "Per aggiungere questa web app alla schermata iniziale: premi %icon e poi <strong>Aggiungi a Home</strong>."
    },
    sv_se: {
      ios:
        "För att lägga till denna webbapplikation på hemskärmen: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>."
    }
  }),
  ath.intl))
    ath.intl[lang.substr(0, 2)] = ath.intl[lang];
  ath.defaults = {
    appID: "addtohome",
    fontSize: 15,
    debug: !1,
    logging: !1,
    modal: !1,
    mandatory: !1,
    autostart: !0,
    skipFirstVisit: !1,
    startDelay: 1,
    lifespan: 15,
    displayPace: 1440,
    maxDisplayCount: 10,
    icon: !0,
    message: "",
    validLocation: [],
    onInit: null,
    onShow: null,
    onRemove: null,
    onAdd: null,
    onPrivate: null,
    privateModeOverride: !1,
    detectHomescreen: !1
  };
  var _ua = window.navigator.userAgent,
    _nav = window.navigator;
  _extend(ath, {
    hasToken:
      "#ath" == document.location.hash ||
      _reSmartURL.test(document.location.href) ||
      _reQueryString.test(document.location.search),
    isRetina: window.devicePixelRatio && window.devicePixelRatio > 1,
    isIDevice: /iphone|ipod|ipad/i.test(_ua),
    isMobileChrome:
      _ua.indexOf("Android") > -1 &&
      /Chrome\/[.0-9]*/.test(_ua) &&
      -1 == _ua.indexOf("Version"),
    isMobileIE: _ua.indexOf("Windows Phone") > -1,
    language:
      void 0 === window.global
        ? _nav.language.toLowerCase().replace("-", "_") || ""
        : window.global.request.culture.toLowerCase().replace("-", "_") || ""
  }),
    (ath.language =
      ath.language && ath.language in ath.intl ? ath.language : "en_us"),
    (ath.isMobileSafari =
      ath.isIDevice && _ua.indexOf("Safari") > -1 && _ua.indexOf("CriOS") < 0),
    (ath.OS = ath.isIDevice
      ? "ios"
      : ath.isMobileChrome
      ? "Android"
      : ath.isMobileIE
      ? "windows"
      : "unsupported"),
    (ath.OSVersion = _ua.match(/(OS|Android) (\d+[_\.]\d+)/)),
    (ath.OSVersion =
      ath.OSVersion && ath.OSVersion[2]
        ? +ath.OSVersion[2].replace("_", ".")
        : 0),
    (ath.isStandalone =
      "standalone" in window.navigator && window.navigator.standalone),
    (ath.isTablet =
      (ath.isMobileSafari && _ua.indexOf("iPad") > -1) ||
      (ath.isMobileChrome && _ua.indexOf("Mobile") < 0)),
    (ath.isCompatible =
      (ath.isMobileSafari && ath.OSVersion >= 6) || ath.isMobileChrome);
  var _defaultSession = {
    lastDisplayTime: 0,
    returningVisitor: !1,
    displayCount: 0,
    optedout: !1,
    added: !1
  };
  function _extend(target, obj) {
    for (var i in obj) target[i] = obj[i];
    return target;
  }
  function _removeToken() {
    "#ath" == document.location.hash &&
      history.replaceState(
        "",
        window.document.title,
        document.location.href.split("#")[0]
      ),
      _reSmartURL.test(document.location.href) &&
        history.replaceState(
          "",
          window.document.title,
          document.location.href.replace(_reSmartURL, "$1")
        ),
      _reQueryString.test(document.location.search) &&
        history.replaceState(
          "",
          window.document.title,
          document.location.href.replace(_reQueryString, "$2")
        );
  }
  (ath.removeSession = function(appID) {
    try {
      if (!localStorage) throw new Error("localStorage is not defined");
      localStorage.removeItem(appID || ath.defaults.appID);
    } catch (e) {}
  }),
    (ath.doLog = function(logStr) {
      this.options.logging && console.log(logStr);
    }),
    (ath.Class = function(options) {
      if (
        ((this.doLog = ath.doLog),
        (this.options = _extend({}, ath.defaults)),
        _extend(this.options, options),
        this.options &&
          this.options.debug &&
          void 0 === this.options.logging &&
          (this.options.logging = !0),
        _eventListener)
      )
        if (
          ((this.options.mandatory =
            this.options.mandatory &&
            ("standalone" in window.navigator || this.options.debug)),
          (this.options.modal = this.options.modal || this.options.mandatory),
          this.options.mandatory && (this.options.startDelay = -0.5),
          (this.options.detectHomescreen =
            !0 === this.options.detectHomescreen
              ? "hash"
              : this.options.detectHomescreen),
          this.options.debug &&
            ((ath.isCompatible = !0),
            (ath.OS =
              "string" == typeof this.options.debug
                ? this.options.debug
                : "unsupported" == ath.OS
                ? "android"
                : ath.OS),
            (ath.OSVersion = "ios" == ath.OS ? "8" : "4")),
          (this.session = this.getItem(this.options.appID)),
          (this.session = this.session ? JSON.parse(this.session) : void 0),
          !ath.hasToken ||
            (ath.isCompatible && this.session) ||
            ((ath.hasToken = !1), _removeToken()),
          ath.isCompatible)
        ) {
          this.session = this.session || _defaultSession;
          try {
            if (!localStorage) throw new Error("localStorage is not defined");
            localStorage.setItem(
              this.options.appID,
              JSON.stringify(this.session)
            ),
              (ath.hasLocalStorage = !0);
          } catch (e) {
            (ath.hasLocalStorage = !1),
              this.options.onPrivate && this.options.onPrivate.call(this);
          }
          for (
            var isValidLocation = !this.options.validLocation.length,
              i = this.options.validLocation.length;
            i--;

          )
            if (this.options.validLocation[i].test(document.location.href)) {
              isValidLocation = !0;
              break;
            }
          if (
            (this.getItem("addToHome") && this.optOut(), this.session.optedout)
          )
            this.doLog(
              "Add to homescreen: not displaying callout because user opted out"
            );
          else if (this.session.added)
            this.doLog(
              "Add to homescreen: not displaying callout because already added to the homescreen"
            );
          else if (isValidLocation) {
            if (ath.isStandalone)
              return (
                this.session.added ||
                  ((this.session.added = !0),
                  this.updateSession(),
                  this.options.onAdd &&
                    ath.hasLocalStorage &&
                    this.options.onAdd.call(this)),
                void this.doLog(
                  "Add to homescreen: not displaying callout because in standalone mode"
                )
              );
            if (this.options.detectHomescreen) {
              if (ath.hasToken)
                return (
                  _removeToken(),
                  this.session.added ||
                    ((this.session.added = !0),
                    this.updateSession(),
                    this.options.onAdd &&
                      ath.hasLocalStorage &&
                      this.options.onAdd.call(this)),
                  void this.doLog(
                    "Add to homescreen: not displaying callout because URL has token, so we are likely coming from homescreen"
                  )
                );
              "hash" == this.options.detectHomescreen
                ? history.replaceState(
                    "",
                    window.document.title,
                    document.location.href + "#ath"
                  )
                : "smartURL" == this.options.detectHomescreen
                ? history.replaceState(
                    "",
                    window.document.title,
                    document.location.href.replace(/(\/)?$/, "/ath$1")
                  )
                : history.replaceState(
                    "",
                    window.document.title,
                    document.location.href +
                      (document.location.search ? "&" : "?") +
                      "ath="
                  );
            }
            this.session.returningVisitor ||
            ((this.session.returningVisitor = !0),
            this.updateSession(),
            !this.options.skipFirstVisit)
              ? this.options.privateModeOverride || ath.hasLocalStorage
                ? ((this.ready = !0),
                  this.options.onInit && this.options.onInit.call(this),
                  this.options.autostart &&
                    (this.doLog(
                      "Add to homescreen: autostart displaying callout"
                    ),
                    this.show()))
                : this.doLog(
                    "Add to homescreen: not displaying callout because browser is in private mode"
                  )
              : this.doLog(
                  "Add to homescreen: not displaying callout because skipping first visit"
                );
          } else
            this.doLog(
              "Add to homescreen: not displaying callout because not a valid location"
            );
        } else
          this.doLog(
            "Add to homescreen: not displaying callout because device not supported"
          );
    }),
    (ath.Class.prototype = {
      events: {
        load: "_delayedShow",
        error: "_delayedShow",
        orientationchange: "resize",
        resize: "resize",
        scroll: "resize",
        click: "remove",
        touchmove: "_preventDefault",
        transitionend: "_removeElements",
        webkitTransitionEnd: "_removeElements",
        MSTransitionEnd: "_removeElements"
      },
      handleEvent: function(e) {
        var type = this.events[e.type];
        type && this[type](e);
      },
      show: function(force) {
        if (!this.options.autostart || _DOMReady)
          if (this.shown)
            this.doLog(
              "Add to homescreen: not displaying callout because already shown on screen"
            );
          else {
            var now = Date.now(),
              lastDisplayTime = this.session.lastDisplayTime;
            if (!0 !== force) {
              if (!this.ready)
                return void this.doLog(
                  "Add to homescreen: not displaying callout because not ready"
                );
              if (now - lastDisplayTime < 6e4 * this.options.displayPace)
                return void this.doLog(
                  "Add to homescreen: not displaying callout because displayed recently"
                );
              if (
                this.options.maxDisplayCount &&
                this.session.displayCount >= this.options.maxDisplayCount
              )
                return void this.doLog(
                  "Add to homescreen: not displaying callout because displayed too many times already"
                );
            }
            (this.shown = !0),
              (this.session.lastDisplayTime = now),
              this.session.displayCount++,
              this.updateSession(),
              this.applicationIcon ||
                ("ios" == ath.OS
                  ? (this.applicationIcon = document.querySelector(
                      'head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]'
                    ))
                  : (this.applicationIcon = document.querySelector(
                      'head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]'
                    )));
            var message = "";
            "object" == typeof this.options.message &&
            ath.language in this.options.message
              ? (message = this.options.message[ath.language][ath.OS])
              : "object" == typeof this.options.message &&
                ath.OS in this.options.message
              ? (message = this.options.message[ath.OS])
              : this.options.message in ath.intl
              ? (message = ath.intl[this.options.message][ath.OS])
              : "" !== this.options.message
              ? (message = this.options.message)
              : ath.OS in ath.intl[ath.language] &&
                (message = ath.intl[ath.language][ath.OS]),
              (message =
                "<p>" +
                message.replace(/%icon(?:\[([^\]]+)\])?/gi, function(
                  matches,
                  group1
                ) {
                  return (
                    '<span class="ath-action-icon">' +
                    (group1 || "icon") +
                    "</span>"
                  );
                }) +
                "</p>"),
              (this.viewport = document.createElement("div")),
              (this.viewport.className = "ath-viewport"),
              this.options.modal && (this.viewport.className += " ath-modal"),
              this.options.mandatory &&
                (this.viewport.className += " ath-mandatory"),
              (this.viewport.style.position = "absolute"),
              (this.element = document.createElement("div")),
              (this.element.className =
                "ath-container ath-" +
                ath.OS +
                " ath-" +
                ath.OS +
                (parseInt(ath.OSVersion) || "") +
                " ath-" +
                (ath.isTablet ? "tablet" : "phone")),
              (this.element.style.cssText =
                "-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0s;-webkit-transition-timing-function:ease-out;transition-property:transform,opacity;transition-duration:0s;transition-timing-function:ease-out;"),
              (this.element.style.webkitTransform =
                "translate3d(0,-" + window.innerHeight + "px,0)"),
              (this.element.style.transform =
                "translate3d(0,-" + window.innerHeight + "px,0)"),
              this.options.icon &&
                this.applicationIcon &&
                ((this.element.className += " ath-icon"),
                (this.img = document.createElement("img")),
                (this.img.className = "ath-application-icon"),
                this.img.addEventListener("load", this, !1),
                this.img.addEventListener("error", this, !1),
                (this.img.src = this.applicationIcon.href),
                this.element.appendChild(this.img)),
              (this.element.innerHTML += message),
              (this.viewport.style.left = "-99999em"),
              this.viewport.appendChild(this.element),
              document.body.appendChild(this.viewport),
              this.img
                ? this.doLog(
                    "Add to homescreen: not displaying callout because waiting for img to load"
                  )
                : this._delayedShow();
          }
        else setTimeout(this.show.bind(this), 50);
      },
      _delayedShow: function(e) {
        setTimeout(this._show.bind(this), 1e3 * this.options.startDelay + 500);
      },
      _show: function() {
        var that = this;
        this.updateViewport(),
          window.addEventListener("resize", this, !1),
          window.addEventListener("scroll", this, !1),
          window.addEventListener("orientationchange", this, !1),
          this.options.modal &&
            document.addEventListener("touchmove", this, !0),
          this.options.mandatory ||
            setTimeout(function() {
              that.element.addEventListener("click", that, !0);
            }, 1e3),
          setTimeout(function() {
            (that.element.style.webkitTransitionDuration = "1.2s"),
              (that.element.style.transitionDuration = "1.2s"),
              (that.element.style.webkitTransform = "translate3d(0,0,0)"),
              (that.element.style.transform = "translate3d(0,0,0)");
          }, 0),
          this.options.lifespan &&
            (this.removeTimer = setTimeout(
              this.remove.bind(this),
              800 * this.options.lifespan
            )),
          this.options.onShow && this.options.onShow.call(this);
      },
      remove: function() {
        clearTimeout(this.removeTimer),
          this.img &&
            (this.img.removeEventListener("load", this, !1),
            this.img.removeEventListener("error", this, !1)),
          window.removeEventListener("resize", this, !1),
          window.removeEventListener("scroll", this, !1),
          window.removeEventListener("orientationchange", this, !1),
          document.removeEventListener("touchmove", this, !0),
          this.element.removeEventListener("click", this, !0),
          this.element.addEventListener("transitionend", this, !1),
          this.element.addEventListener("webkitTransitionEnd", this, !1),
          this.element.addEventListener("MSTransitionEnd", this, !1),
          (this.element.style.webkitTransitionDuration = "0.3s"),
          (this.element.style.opacity = "0");
      },
      _removeElements: function() {
        this.element.removeEventListener("transitionend", this, !1),
          this.element.removeEventListener("webkitTransitionEnd", this, !1),
          this.element.removeEventListener("MSTransitionEnd", this, !1),
          document.body.removeChild(this.viewport),
          (this.shown = !1),
          this.options.onRemove && this.options.onRemove.call(this);
      },
      updateViewport: function() {
        if (this.shown) {
          (this.viewport.style.width = window.innerWidth + "px"),
            (this.viewport.style.height = window.innerHeight + "px"),
            (this.viewport.style.left = window.scrollX + "px"),
            (this.viewport.style.top = window.scrollY + "px");
          var clientWidth = document.documentElement.clientWidth;
          this.orientation =
            clientWidth > document.documentElement.clientHeight
              ? "landscape"
              : "portrait";
          var screenWidth =
            "ios" == ath.OS
              ? "portrait" == this.orientation
                ? screen.width
                : screen.height
              : screen.width;
          (this.scale =
            screen.width > clientWidth ? 1 : screenWidth / window.innerWidth),
            (this.element.style.fontSize =
              this.options.fontSize / this.scale + "px");
        }
      },
      resize: function() {
        clearTimeout(this.resizeTimer),
          (this.resizeTimer = setTimeout(this.updateViewport.bind(this), 100));
      },
      updateSession: function() {
        !1 !== ath.hasLocalStorage &&
          localStorage &&
          localStorage.setItem(
            this.options.appID,
            JSON.stringify(this.session)
          );
      },
      clearSession: function() {
        (this.session = _defaultSession), this.updateSession();
      },
      getItem: function(item) {
        try {
          if (!localStorage) throw new Error("localStorage is not defined");
          return localStorage.getItem(item);
        } catch (e) {
          ath.hasLocalStorage = !1;
        }
      },
      optOut: function() {
        (this.session.optedout = !0), this.updateSession();
      },
      optIn: function() {
        (this.session.optedout = !1), this.updateSession();
      },
      clearDisplayCount: function() {
        (this.session.displayCount = 0), this.updateSession();
      },
      _preventDefault: function(e) {
        e.preventDefault(), e.stopPropagation();
      }
    }),
    (window.addToHomescreen = ath);
})(window, document);

addToHomescreen();