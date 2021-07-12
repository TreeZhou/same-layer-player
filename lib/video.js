//写入到全局对象中
window.Video = function (videoSrc, objParams) {
        var i; //视频对象 
        var n; //视频Dom节点
        var s = {
                loop: objParams.loop || !1,
                autoplay: objParams.autoplay || !1,
                objectFit: objParams.objectFit ? objParams.objectFit : "cover"
            },
            r = navigator.userAgent.toLowerCase(),
            o = "micromessenger" == r.match(/MicroMessenger/i),
            a = r.indexOf("android") > -1 || r.indexOf("linux") > -1;
        o && a ? (this.useTs = !0,
                n = document.createElement("canvas"),
                "fill" !== s.objectFit && (n.style.width = "100%",
                    n.style.height = "100%",
                    n.style.objectFit = s.objectFit),

                i = new JSMpeg.Player(videoSrc.replace(".mp4", ".ts"), {
                    canvas: n,
                    loop: s.loop || !1,
                    autoplay: s.autoplay || !1
                })) : (i = document.createElement("video"),
                i.setAttribute("x5-video-player-type", "h5"),
                i.setAttribute("x-webkit-airplay", "true"),
                i.setAttribute("airplay", "allow"),
                i.setAttribute("playsinline", ""),
                i.setAttribute("webkit-playsinline", ""),
                i.controls = !1,
                s.autoplay && i.setAttribute("autoplay", "true"),
                s.loop && i.setAttribute("loop", "true"),
                i.setAttribute("src", videoSrc),
                "fill" !== s.objectFit && (i.style.width = "100%",
                    i.style.height = "100%",
                    i.style.objectFit = s.objectFit),
                i.webkitExitFullScreen(),
                i.addEventListener("webkitbeginfullscreen", function (t) {
                    i.webkitExitFullScreen()
                }),
                n = i),

            this.totalTime = objParams.totalTime,
            this.video = i,
            this.domElement = n,
            this._Event = {},
            this._Temp = {},
            Object.defineProperty(this, "paused", {
                get: this.getPlayStatus
            }),
            Object.defineProperty(this, "currentTime", {
                get: this.getCurrentTime,
                set: this.setCurrentTime
            }),
            Object.defineProperty(this, "muted", {
                get: this.getMuted,
                set: this.setMuted
            })
    },
    Video.prototype = {
        load: function () {
            this.useTs || this.video.load()
        },
        play: function () {
            this.useTs && this._Temp.ended && (this.video.currentTime = 0),
                this.video.play()
        },
        pause: function () {
            this.video.pause()
        },
        stop: function () {
            this.useTs ? this.video.stop() : (this.video.currentTime = 0,
                this.video.pause())
        },
        destroy: function () {
            this.useTs && (this.animationFrame && cancelAnimationFrame(this.animationFrame),
                console.log(this.animationFrame),
                this.video.destroy())
        },
        getMuted: function () {
            return this.useTs ? !this.video.volume : this.video.muted
        },
        setMuted: function (t) {
            this.useTs ? this.video.volume = t ? 0 : 1 : this.video.muted = t
        },
        getCurrentTime: function () {
            return this.video.currentTime
        },
        setCurrentTime: function (t) {
            this.video.currentTime = t
        },
        getPlayStatus: function () {
            return this.useTs ? this.video.isPlaying : !this.video.paused
        },
        _loop: function () {
            this.animationFrame = requestAnimationFrame(this._loop.bind(this));
            var t = this;
            if (this.video.isPlaying) {
                if (this._Temp.pause = !1,
                    this._Temp.ended = !1,
                    this._Event.timeupdate)
                    for (var e in this._Event.timeupdate)
                        t._Event.timeupdate[e]();
                if (this._Event.play && !this._Temp.play) {
                    this._Temp.play = !0;
                    for (var i in this._Event.play)
                        t._Event.play[i]()
                }
            } else if (this.video.currentTime >= this.totalTime) {
                if (0 !== this.video.currentTime && !this._Temp.ended) {
                    if (this._Temp.pause = !0,
                        this._Temp.ended = !0,
                        this._Event.pause)
                        for (var n in this._Event.pause)
                            t._Event.pause[n]();
                    if (this._Event.ended)
                        for (var s in this._Event.ended)
                            t._Event.ended[s]()
                }
            } else if (0 !== this.video.currentTime && !this._Temp.pause && (this._Temp.pause = !0,
                    this._Event.pause))
                for (var n in this._Event.pause)
                    t._Event.pause[n]()
        },
        addEventListener: function (t, e) {
            var i = this;
            this.useTs ? (this._Event[t] || (this._Event[t] = {}),
                this._Event[t][e + ""] = e,
                this.animationFrame = requestAnimationFrame(this._loop.bind(this))) : i.video.addEventListener(t, e)
        },
        removeEventListener: function (t, e) {
            var i = this;
            this.useTs ? (delete i._Event[t][e + ""],
                0 === Object.getOwnPropertyNames(i._Event[t]).length && delete i._Event[t],
                i._Event.play || i._Event.timeupdate || i._Event.pause || i._Event.ended || i.animationFrame && cancelAnimationFrame(i.animationFrame)) : i.video.removeEventListener("type", e)
        }
    }



