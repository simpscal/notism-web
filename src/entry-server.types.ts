export interface SsrRenderResult {
    /** Rendered app markup — injected into the `<!--app-html-->` placeholder. */
    html: string;
    /** Route `<title>` — replaces the default `<title>` in the template. */
    title: string;
    /** Description + OG/Twitter meta tags — injected into `<!--app-head-->`. */
    headExtra: string;
}
