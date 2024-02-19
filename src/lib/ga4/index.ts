declare global {
    interface Window {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
      ZJSBridge?: {
        callCustomAction(
          action: string,
          params: Record<string, unknown>,
          callback: (result: { error_code: number; data: string }) => void
        ): void;
      };
    }
  }
  
  class AdaptiveAnalytics {
    private userId = "";
    private sessionId = "";
    private startTime = performance.now();
    private eventQueue: {
      name: string;
      params: Record<string, string | number | undefined>;
    }[] = [];
    private timeout = 0;
    private referer = "";
    private screenResolution = "";
    private viewportSize = "";
  
    constructor(
      private propertyId: string,
      private apiSecretKey: string,
      private options: {
        useMeasurementProtocolWhen: () => boolean;
        gtagConfig?: Record<string, unknown>;
        onPageView?: (pagePath: string) => void;
      } = {
        useMeasurementProtocolWhen: () =>
          ["http:", "https:"].indexOf(window.location.protocol) === -1,
      }
    ) {
      this.getVisitorID().then((visitorId) => (this.userId = visitorId));
      this.sessionId = this.uuidv4();
      window.addEventListener("beforeunload", this.collect);
      this.referer = new URLSearchParams(location.search).get("utm_source") ?? "";
      this.screenResolution = `${screen.width}x${screen.height}`;
      this.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
  
      const handleLocationChange = () => {
        const match = /\/zapps\/\d+\/?(.*)/.exec(location.pathname);
        if (match) {
          const pathname = `/${match[1]}`;
          setTimeout(() => {
            this.trackEvent("page_view", {
              page_path: pathname,
              page_params: location.search,
              page_title: document.title,
            });
            if (this.options.onPageView) {
              this.options.onPageView(pathname);
            }
          }, 0);
        }
      };
      handleLocationChange();
      window.addEventListener("popstate", handleLocationChange);
  
      // Replace history.pushState to dispatch a custom event
      const originalPushState = history.pushState;
      history.pushState = function () {
        originalPushState.apply(
          this,
          arguments as unknown as Parameters<typeof history.pushState>
        );
        window.dispatchEvent(new Event("pushstate"));
      };
      // Replace history.replaceState to dispatch a custom event
      const originalReplaceState = history.replaceState;
      history.replaceState = function () {
        originalReplaceState.apply(
          this,
          arguments as unknown as Parameters<typeof history.replaceState>
        );
        window.dispatchEvent(new Event("replacestate"));
      };
  
      // Add event listeners for pushstate and replacestate events
      window.addEventListener("pushstate", handleLocationChange);
      window.addEventListener("replacestate", handleLocationChange);
    }
  
    async getVisitorID() {
      return new Promise<string>((resolve) => {
        if (
          typeof window.ZJSBridge != "undefined" &&
          typeof window.ZJSBridge.callCustomAction == "function"
        ) {
          window.ZJSBridge.callCustomAction(
            "action.mp.get.visitor.id",
            {},
            (result) => {
              if (result.error_code == 0 && result.data != "{}") {
                return resolve(result.data);
              } else {
                return resolve(this.uuidv4());
              }
            }
          );
        } else {
          return resolve(this.uuidv4());
        }
      });
    }
  
    private isMeasurementProtocolRequired() {
      return this.options.useMeasurementProtocolWhen();
    }
  
    private async loadScript(url: string) {
      return new Promise((resolve) => {
        const script: HTMLScriptElement = document.createElement("script");
        script.id = "script";
        script.src = url;
        script.async = true;
        script.onload = async function () {
          resolve(true);
        };
        document.head.appendChild(script);
      });
    }
  
    private uuidv4() {
      return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c: any) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
      );
    }
  
    private collect = () => {
      if (this.userId) {
        if (this.eventQueue.length) {
          fetch(`https://reportingapi.addy.vn/actions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientId: this.userId,
              events: this.eventQueue,
            }),
          }).catch();
  
          fetch(
            `https://www.google-analytics.com/mp/collect?measurement_id=${this.propertyId}&api_secret=${this.apiSecretKey}`,
            {
              method: "POST",
              body: JSON.stringify({
                client_id: this.userId,
                events: this.eventQueue,
              }),
            }
          ).catch();
          this.eventQueue = [];
        }
      } else {
        setTimeout(this.collect, 1000);
      }
    };
  
    public trackEvent(action: string, params: Record<string, unknown> = {}) {
      const endTime = performance.now();
      const engagement_time_msec = String(Math.round(endTime - this.startTime));
      this.startTime = endTime;
      this.eventQueue.unshift({
        name: action,
        params: {
          session_id: this.sessionId,
          engagement_time_msec,
          protocol: location.protocol,
          user_agent: navigator.userAgent,
          document_referrer: this.referer,
          screen_resolution: this.screenResolution,
          viewport_size: this.viewportSize,
          ...params,
        },
      });
      clearTimeout(this.timeout);
      setTimeout(this.collect, (this.timeout = 3000));
    }
  }
  
  export default AdaptiveAnalytics