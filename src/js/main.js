(function () {
  class ImageLoader {
    constructor() {
      this.srcs = document.getElementsByClassName("load-src");
      this.imageArray = [];
      for (let i = 0; i < this.srcs.length; i++) {
        this.imageArray.push(this.srcs[i].src);
      }
    }

    async loadImages() {
      return new Promise((resolve) => {
        let loaded = 0;

        for (let i = 0; i < this.imageArray.length; i++) {
          const image = new Image();

          image.addEventListener("load", () => {
            loaded++;
            if (loaded == this.imageArray.length) resolve();
          });
          image.src = `${this.imageArray[i]}`;
        }
      });
    }
  }

  class Main {
    constructor() {
      document.documentElement.scrollTop = 0;

      this.imageLoader = new ImageLoader();

      this.appinner = document.getElementById("app-inner");
      this.app = document.getElementById("app");
      this.background = document.getElementById("background");
      this.slogan = document.getElementById("slogan");
      this.logo = document.getElementById("logo");
      this.logoMask = document.getElementById("logo-mask");
      this.contentDate = document.getElementById("content-date");
      this.bgscroll = document.getElementById("bg-scroll");
      this.contact = document.getElementById("contact");

      this.lineTop = document.getElementById("line-top");
      this.lineBottom = document.getElementById("line-bottom");
      this.contentDateTop = this.contentDate.offsetTop;
      this.sloganScale = 0;
      this.slogan.style.transform = `scale(${this.sloganScale}, ${this.sloganScale})`;
      this.logoTop = 50;
      this.logoStartHeight = this.logo.clientHeight;
      this.logoEndHeight = 50;
      this.logoHeight = this.logoStartHeight;
      this.scrollText = document.getElementById("line-text");

      this.positionScrollText();

      document.addEventListener("scroll", (event) => {
        this.positionScrollText();

        const introPercent =
          window.scrollY > window.innerHeight / 1.5
            ? 1
            : window.scrollY / (window.innerHeight / 1.5);

        this.sloganScale = introPercent;
        this.logoTop = 52 - introPercent * 50;

        const inverse = 1 - introPercent;

        this.logoHeight =
          this.logoStartHeight * inverse < this.logoEndHeight
            ? this.logoEndHeight
            : inverse * this.logoStartHeight;

        this.slogan.style.transform = `scale(${this.sloganScale}, ${this.sloganScale})`;

        this.logo.style.transform = `translate3d(-50%, -${this.logoTop}%, 0)`;
        this.logo.style.top = `${this.logoTop}%`;
        this.logo.style.height = `${this.logoHeight}px`;
        const bgscale =
          1 + window.scrollY / (this.app.clientHeight + window.innerHeight) < 1
            ? 1
            : 1 + window.scrollY / (this.app.clientHeight + window.innerHeight);

        this.background.style.transform = `scale(${bgscale}, ${bgscale})`;

        this.setAlpha(this.contentDate);
        this.setAlpha(this.contact);
      });

      setTimeout(() => {
        this.imageLoader.loadImages().then(() => {
          this.background.style.opacity = 1;
          setTimeout(() => {
            this.logoMask.style.width = "100%";
            this.logoMask.classList.add("active");
            this.app.classList.add("can-scroll");
          }, 1000);
          setTimeout(() => {
            this.bgscroll.style.transform = "translateY(0)";
          }, 2000);
        });
      }, 500);
    }

    positionScrollText() {
      const scrollPercent =
        window.scrollY / (this.appinner.clientHeight - window.innerHeight);

      const scrollTextSize = 64 / window.innerHeight;
      this.lineTop.style.height = this.lineTop.style.setProperty(
        "height",
        `calc(${100 - scrollPercent * 100}% - 40px`
      );

      this.lineBottom.style.setProperty(
        "height",
        `calc(${scrollPercent * 100}% - 40px`
      );

      this.scrollText.style.bottom = `${scrollPercent * 100}%`;
    }

    setAlpha(_div) {
      const alphaStartY = _div.offsetTop - window.innerHeight;

      let alpha =
        window.scrollY > alphaStartY ? (window.scrollY - alphaStartY) / 430 : 0;

      if (alpha > 1) alpha = 1;
      _div.style.opacity = alpha;
    }
  }

  const main = new Main();
})();
