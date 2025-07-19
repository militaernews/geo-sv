import "clsx";
function _layout($$payload, $$props) {
  let { children } = $$props;
  $$payload.out.push(`<div class="container mx-auto h-screen w-full" style="font-family:'HP Simplified'">`);
  children($$payload);
  $$payload.out.push(`<!----></div>`);
}
export {
  _layout as default
};
