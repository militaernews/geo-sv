import { e as ensure_array_like, b as attr_style, c as attr, d as bind_props, p as pop, f as push, g as fallback, h as stringify, i as attr_class, j as escape_html, k as spread_attributes, l as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { d as derived, w as writable } from "../../chunks/index.js";
function Legend($$payload, $$props) {
  push();
  let entries = fallback($$props["entries"], () => [], true);
  let onChange = $$props["onChange"];
  const each_array = ensure_array_like(entries);
  $$payload.out.push(`<div class="bg-base-200 absolute right-0 bottom-0 z-10 space-y-3 rounded-tl-lg p-3"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let [color, text] = each_array[$$index];
    $$payload.out.push(`<div class="flex items-center gap-2"><div class="h-5 w-5 rounded-full border-3"${attr_style(`border-color: ${stringify(color)}`)}></div> <input class="text-sm" type="text"${attr("value", text)}/></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  bind_props($$props, { entries, onChange });
  pop();
}
function EditorModal($$payload, $$props) {
  push();
  let circle = $$props["circle"];
  let isNew = $$props["isNew"];
  let onCancel = $$props["onCancel"];
  let onSave = $$props["onSave"];
  let onRemove = $$props["onRemove"];
  let presetColors = $$props["presetColors"];
  let onColorSelect = $$props["onColorSelect"];
  const each_array = ensure_array_like(presetColors);
  $$payload.out.push(`<div class="bg-opacity- fixed inset-0 z-50 flex items-center justify-center bg-black"><div class="bg-base-100 text-base-content w-80 rounded p-6 shadow"><h2 class="mb-4 text-lg font-bold">`);
  if (isNew) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`Create`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`Edit`);
  }
  $$payload.out.push(`<!--]--> Point</h2> <label class="form-control mb-3"><span class="label-text">Headline</span> <input type="text" class="input input-bordered"${attr("value", circle.headline)}/></label> <label class="form-control mb-3"><span class="label-text">Text</span> <input type="text" class="input input-bordered"${attr("value", circle.text)}/></label> <label class="form-control mb-3"><span class="label-text">Color</span> <div class="mt-2 flex gap-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let color = each_array[$$index];
    $$payload.out.push(`<button${attr_class("h-8 w-8 cursor-pointer rounded-full border-2 border-transparent transition-all", void 0, {
      "ring-2": circle?.color === color,
      "ring-offset-2": circle?.color === color,
      "shadow-md": circle?.color === color,
      "animate-bounce-once": circle?.color === color
    })}${attr_style(`background-color: ${stringify(color)};`)}></button>`);
  }
  $$payload.out.push(`<!--]--></div></label> <label class="mb-3 flex items-center gap-2"><input type="checkbox"${attr("checked", circle.rectExpandLeft, true)} class="checkbox"/> <span>Expand label left</span></label> <label class="mb-4 flex items-center gap-2"><input type="checkbox" class="checkbox"${attr("checked", circle.borderStyle === "dotted", true)}/> <span>Dotted border</span></label> <div class="mt-4 flex justify-end space-x-2"><button class="btn btn-outline">Cancel</button> `);
  if (!isNew) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="btn btn-error">Remove</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <button class="btn btn-primary">${escape_html(isNew ? "Add Circle" : "Save")}</button></div></div></div>`);
  bind_props($$props, {
    circle,
    isNew,
    onCancel,
    onSave,
    onRemove,
    presetColors,
    onColorSelect
  });
  pop();
}
function CircleItem($$payload, $$props) {
  push();
  let circle = $$props["circle"];
  let onDragStart = $$props["onDragStart"];
  let onEdit = $$props["onEdit"];
  $$payload.out.push(`<div class="absolute z-10"${attr_style(`top: ${stringify(circle.y)}%; left: ${stringify(circle.x)}%; transform: translate(-50%, -50%);`)}><div class="h-14 w-14 cursor-move rounded-full border-4"${attr_style(`border-color: ${stringify(circle.color)}; border-style: ${stringify(circle.borderStyle || "solid")};`)}></div> <div class="text-md absolute cursor-pointer rounded px-2 py-1 text-white"${attr_style(` top: 50%; ${stringify(circle.rectExpandLeft ? "right: 100%; text-align: right;" : "left: 100%; text-align: left;")} transform: translateY(-50%); background-color: ${stringify(circle.color)}; `)}>`);
  if (circle.headline) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="truncate text-base font-bold whitespace-nowrap">${escape_html(circle.headline)}</div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="truncate whitespace-nowrap">${escape_html(circle.text)}</div></div></div>`);
  bind_props($$props, { circle, onDragStart, onEdit });
  pop();
}
function Floppy_disk($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out.push(`<svg${spread_attributes(
    {
      viewBox: "0 0 32 32",
      mode: "url",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    null,
    void 0,
    void 0,
    3
  )}><g fill="none"><g filter="url(#f547id0)"><path fill="url(#f547id7)" d="M24.259 2.139a3 3 0 0 1 2.121.879L29 5.638a3 3 0 0 1 .879 2.12v18.853a3.25 3.25 0 0 1-3.25 3.25H5.37a3.25 3.25 0 0 1-3.25-3.25V5.39a3.25 3.25 0 0 1 3.25-3.25z"></path></g><g filter="url(#f547id1)"><path fill="#402360" d="M25.003 29.524H6.337v-11.76c0-.788.665-1.427 1.486-1.427h15.694c.821 0 1.486.64 1.486 1.428z"></path></g><g filter="url(#f547id2)"><path fill="url(#f547id8)" d="M25.422 29.861H6.578V17.5a1.5 1.5 0 0 1 1.5-1.5h15.844a1.5 1.5 0 0 1 1.5 1.5z"></path></g><g filter="url(#f547id3)"><path fill="url(#f547id9)" d="M25.422 19.031H6.578V17.5a1.5 1.5 0 0 1 1.5-1.5h15.844a1.5 1.5 0 0 1 1.5 1.5z"></path></g><g filter="url(#f547id4)"><path fill="url(#f547ida)" d="M25.422 2.374v9.189a1.5 1.5 0 0 1-1.5 1.5H8.078a1.5 1.5 0 0 1-1.5-1.5V2.139h17.68a3 3 0 0 1 1.164.235"></path></g><g filter="url(#f547id5)"><path fill="url(#f547idb)" d="M11.469 3.139a1 1 0 0 1 1-1H24v8.736c0 .69-.56 1.25-1.25 1.25H12.469a1 1 0 0 1-1-1z"></path></g><g filter="url(#f547id6)"><rect width="3.813" height="8.047" x="19" y="3.031" fill="url(#f547idc)" rx=".9"></rect></g><defs><filter id="f547id0" width="28.757" height="28.722" x="1.621" y="1.639" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.5" dy=".5"></feOffset><feGaussianBlur stdDeviation=".375"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.447059 0 0 0 0 0.729412 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".5" dy="-.5"></feOffset><feGaussianBlur stdDeviation=".375"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.262745 0 0 0 0 0.227451 0 0 0 0 0.458824 0 0 0 1 0"></feColorMatrix><feBlend in2="effect1_innerShadow_18_19812" result="effect2_innerShadow_18_19812"></feBlend></filter><filter id="f547id1" width="19.666" height="14.186" x="5.837" y="15.838" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_18_19812" stdDeviation=".25"></feGaussianBlur></filter><filter id="f547id2" width="19.494" height="13.861" x="6.328" y="16" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".4"></feOffset><feGaussianBlur stdDeviation=".2"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.654902 0 0 0 0 0.607843 0 0 0 0 0.713726 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.25"></feOffset><feGaussianBlur stdDeviation=".125"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.968627 0 0 0 0 0.937255 0 0 0 0 1 0 0 0 1 0"></feColorMatrix><feBlend in2="effect1_innerShadow_18_19812" result="effect2_innerShadow_18_19812"></feBlend></filter><filter id="f547id3" width="19.444" height="3.031" x="6.378" y="16" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.2"></feOffset><feGaussianBlur stdDeviation=".2"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.866667 0 0 0 0 0.368627 0 0 0 0 0.6 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".4"></feOffset><feGaussianBlur stdDeviation=".2"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.662745 0 0 0 0 0.0784314 0 0 0 0 0.219608 0 0 0 1 0"></feColorMatrix><feBlend in2="effect1_innerShadow_18_19812" result="effect2_innerShadow_18_19812"></feBlend></filter><filter id="f547id4" width="19.994" height="12.074" x="5.828" y="1.739" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.25" dy=".25"></feOffset><feGaussianBlur stdDeviation=".25"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.270588 0 0 0 0 0.247059 0 0 0 0 0.556863 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_18_19812"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_18_19812" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.4"></feOffset><feGaussianBlur stdDeviation=".075"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.215686 0 0 0 0 0.223529 0 0 0 0 0.407843 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect2_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".4" dy="-.4"></feOffset><feGaussianBlur stdDeviation=".2"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.054902 0 0 0 0 0.0823529 0 0 0 0 0.254902 0 0 0 1 0"></feColorMatrix><feBlend in2="effect2_innerShadow_18_19812" result="effect3_innerShadow_18_19812"></feBlend></filter><filter id="f547id5" width="13.281" height="10.736" x="10.969" y="1.889" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.25" dy=".25"></feOffset><feGaussianBlur stdDeviation=".125"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0.0901961 0 0 0 0 0.101961 0 0 0 0 0.282353 0 0 0 1 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_18_19812"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_18_19812" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".25" dy="-.25"></feOffset><feGaussianBlur stdDeviation=".125"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.647059 0 0 0 0 0.596078 0 0 0 0 0.705882 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect2_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.25" dy=".25"></feOffset><feGaussianBlur stdDeviation=".075"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.984314 0 0 0 0 0.956863 0 0 0 0 1 0 0 0 1 0"></feColorMatrix><feBlend in2="effect2_innerShadow_18_19812" result="effect3_innerShadow_18_19812"></feBlend></filter><filter id="f547id6" width="4.112" height="8.347" x="18.85" y="2.881" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx="-.25" dy=".25"></feOffset><feGaussianBlur stdDeviation=".075"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.317647 0 0 0 0 0.196078 0 0 0 0 0.384314 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_19812"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".25" dy="-.25"></feOffset><feGaussianBlur stdDeviation=".075"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.160784 0 0 0 0 0.117647 0 0 0 0 0.294118 0 0 0 1 0"></feColorMatrix><feBlend in2="effect1_innerShadow_18_19812" result="effect2_innerShadow_18_19812"></feBlend></filter><linearGradient id="f547id7" x1="16" x2="16" y1="4.125" y2="29.861" gradientUnits="userSpaceOnUse"><stop stop-color="#5C60AD"></stop><stop offset="1" stop-color="#563675"></stop></linearGradient><linearGradient id="f547id8" x1="16" x2="16" y1="16" y2="29.861" gradientUnits="userSpaceOnUse"><stop stop-color="#DDD1EB"></stop><stop offset="1" stop-color="#D4C4E4"></stop></linearGradient><linearGradient id="f547id9" x1="6.578" x2="25.422" y1="17.875" y2="17.875" gradientUnits="userSpaceOnUse"><stop stop-color="#EA242B"></stop><stop offset="1" stop-color="#C92E7F"></stop></linearGradient><linearGradient id="f547ida" x1="16" x2="16" y1="2.139" y2="13.063" gradientUnits="userSpaceOnUse"><stop stop-color="#3D2456"></stop><stop offset="1" stop-color="#33285A"></stop></linearGradient><linearGradient id="f547idb" x1="17.734" x2="17.734" y1="2.139" y2="12.125" gradientUnits="userSpaceOnUse"><stop stop-color="#E8DFF2"></stop><stop offset="1" stop-color="#D0C6DC"></stop></linearGradient><linearGradient id="f547idc" x1="20.906" x2="20.906" y1="3.031" y2="11.078" gradientUnits="userSpaceOnUse"><stop offset=".109" stop-color="#491C4F"></stop><stop offset="1" stop-color="#222C60"></stop></linearGradient></defs></g></svg>`);
}
function Round_pushpin($$payload, $$props) {
  const { $$slots, $$events, ...p } = $$props;
  $$payload.out.push(`<svg${spread_attributes(
    {
      viewBox: "0 0 32 32",
      mode: "url",
      width: "1.2em",
      height: "1.2em",
      ...p
    },
    null,
    void 0,
    void 0,
    3
  )}><g fill="none"><g filter="url(#f2239id8)"><rect width="1.962" height="15.746" x="15.019" y="14.14" fill="#A69AAD" rx=".981"></rect><rect width="1.962" height="15.746" x="15.019" y="14.14" fill="url(#f2239id5)" rx=".981"></rect><rect width="1.962" height="15.746" x="15.019" y="14.14" fill="url(#f2239id0)" rx=".981"></rect></g><circle cx="16" cy="10.006" r="8.032" fill="url(#f2239id1)"></circle><circle cx="16" cy="10.006" r="8.032" fill="url(#f2239id2)"></circle><circle cx="16" cy="10.006" r="8.032" fill="url(#f2239id3)"></circle><circle cx="16" cy="10.006" r="8.032" fill="url(#f2239id4)"></circle><ellipse cx="18.737" cy="6.945" fill="url(#f2239id6)" rx="2.064" ry="2.575" transform="rotate(-37.647 18.737 6.945)"></ellipse><g filter="url(#f2239id9)"><rect width=".603" height="10.523" x="16" y="18.497" fill="url(#f2239id7)" rx=".302"></rect></g><defs><radialGradient id="f2239id0" cx="0" cy="0" r="1" gradientTransform="matrix(0 7.87299 -3.70264 0 16 22.013)" gradientUnits="userSpaceOnUse"><stop offset=".9" stop-color="#9F7BBF" stop-opacity="0"></stop><stop offset="1" stop-color="#9F7BBF"></stop></radialGradient><radialGradient id="f2239id1" cx="0" cy="0" r="1" gradientTransform="rotate(-156.453 12.888 4.584)scale(12.1178 17.416)" gradientUnits="userSpaceOnUse"><stop stop-color="#FD2C8D"></stop><stop offset="1" stop-color="#FA356F"></stop></radialGradient><radialGradient id="f2239id2" cx="0" cy="0" r="1" gradientTransform="matrix(-11.3873 0 0 -15.6783 19.355 10.006)" gradientUnits="userSpaceOnUse"><stop offset=".434" stop-color="#CD284F" stop-opacity="0"></stop><stop offset=".949" stop-color="#A73C52"></stop></radialGradient><radialGradient id="f2239id3" cx="0" cy="0" r="1" gradientTransform="rotate(90 4.854 11.146)scale(12.0261)" gradientUnits="userSpaceOnUse"><stop offset=".691" stop-color="#CC2272" stop-opacity="0"></stop><stop offset="1" stop-color="#BB438D"></stop></radialGradient><radialGradient id="f2239id4" cx="0" cy="0" r="1" gradientTransform="matrix(-3.05745 3.56706 -3.35506 -2.87574 19.355 7.617)" gradientUnits="userSpaceOnUse"><stop stop-color="#FF5EA3"></stop><stop offset="1" stop-color="#FF5EA3" stop-opacity="0"></stop></radialGradient><linearGradient id="f2239id5" x1="17.775" x2="16.323" y1="27.236" y2="27.236" gradientUnits="userSpaceOnUse"><stop stop-color="#C6BECB"></stop><stop offset="1" stop-color="#C6BECB" stop-opacity="0"></stop></linearGradient><linearGradient id="f2239id6" x1="20.054" x2="18.368" y1="5.238" y2="9.311" gradientUnits="userSpaceOnUse"><stop stop-color="#FFFDFF"></stop><stop offset="1" stop-color="#FFFDFF" stop-opacity="0"></stop></linearGradient><linearGradient id="f2239id7" x1="16.302" x2="16.302" y1="18.497" y2="29.019" gradientUnits="userSpaceOnUse"><stop stop-color="#BDAFC1"></stop><stop offset="1" stop-color="#C3B8CE"></stop></linearGradient><filter id="f2239id8" width="2.212" height="16.496" x="15.019" y="14.14" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset dx=".25" dy="4.25"></feOffset><feGaussianBlur stdDeviation=".375"></feGaussianBlur><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite><feColorMatrix values="0 0 0 0 0.552941 0 0 0 0 0.447059 0 0 0 0 0.584314 0 0 0 1 0"></feColorMatrix><feBlend in2="shape" result="effect1_innerShadow_18_23140"></feBlend></filter><filter id="f2239id9" width="1.603" height="11.523" x="15.5" y="17.997" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_18_23140" stdDeviation=".25"></feGaussianBlur></filter></defs></g></svg>`);
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let isAddingCircle = false;
  let displayLegend = true;
  const mapSources = [
    {
      id: "google-custom",
      name: "Google Maps (Project Owl)",
      url: "https://www.google.com/maps/d/embed?mid=1xPxgT8LtUjuspSOGHJc2VzA5O5jWMTE&ehbc=2E312F"
    },
    {
      id: "google-world",
      name: "Google Maps",
      url: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57879408.81242841!2d-46.32400534374999!3d21.06171584375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1642678945123!5m2!1sen!2sus"
    },
    {
      id: "google-europe",
      name: "Satellites.pro",
      url: "https://satellites.pro/Ukraine_map#48.882780,37.924805,7"
    },
    {
      id: "openstreet",
      name: "OpenStreetMap",
      url: "https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-85%2C180%2C85&layer=mapnik"
    }
  ];
  let selectedMapIndex = 0;
  let currentMapUrl = mapSources[selectedMapIndex].url;
  let isCapturingScreenshot = false;
  const presetColors = ["#ffcc00", "#ff00ff", "#00ffff", "#00ff00"];
  let editingCircle = null;
  let circles = writable([]);
  const legendTexts = writable(/* @__PURE__ */ new Map());
  const usedColors = derived(circles, ($circles) => {
    return new Set($circles.map((c) => c.color));
  });
  const activeLegendEntries = derived([usedColors, legendTexts], ([$usedColors, $legendTexts]) => {
    return Array.from($legendTexts.entries()).filter(([color]) => $usedColors.has(color));
  });
  function selectColor(color) {
    if (editingCircle) {
      editingCircle.color = color;
    }
  }
  function removeCircle(id) {
    circles.update((c) => c.filter((circle) => circle.id !== id));
    editingCircle = null;
  }
  function saveEditor() {
    if (!editingCircle) return;
    circles.update((c) => isAddingCircle ? [...c, editingCircle] : c.map((circle) => circle.id === editingCircle.id ? editingCircle : circle));
    legendTexts.update((map) => {
      if (!map.has(editingCircle.color)) {
        map.set(editingCircle.color, `Edit description...`);
      }
      return new Map(map);
    });
    isAddingCircle = false;
    editingCircle = null;
  }
  function openEditor(circle) {
    editingCircle = { ...circle };
  }
  function cancelEditor() {
    editingCircle = null;
  }
  function onMouseDown(event, id) {
    event.preventDefault();
  }
  const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$circles", circles));
  $$payload.out.push(`<div class="relative h-screen w-screen overflow-hidden">`);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(mapSources);
    $$payload.out.push(`<div class="navbar bg-base-300 z-20"><button class="btn btn-ghost">`);
    Round_pushpin($$payload, { class: "h-5 w-5" });
    $$payload.out.push(`<!----></button> <label class="mb-3 flex items-center gap-2"><input type="checkbox"${attr("checked", displayLegend, true)} class="checkbox"/> <span>Display legend</span></label> <div class="mr-2 flex-none"><button class="btn btn-ghost btn-sm"${attr("disabled", isCapturingScreenshot, true)} title="Download Screenshot">`);
    {
      $$payload.out.push("<!--[!-->");
      Floppy_disk($$payload, { class: "h-5 w-5" });
    }
    $$payload.out.push(`<!--]--></button></div> <div class="flex-none"><div class="dropdown dropdown-end"><label tabindex="0" class="btn btn-ghost">${escape_html(mapSources[selectedMapIndex].name)} <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></label> <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow"><!--[-->`);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let source = each_array[index];
      $$payload.out.push(`<li><button${attr_class(`flex items-center justify-between ${stringify(selectedMapIndex === index ? "active" : "")}`)}><span>${escape_html(source.name)}</span> `);
      if (selectedMapIndex === index) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<svg class="text-primary h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></button></li>`);
    }
    $$payload.out.push(`<!--]--></ul></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> <div class="absolute top-16 left-0 z-0 h-[calc(100%-4rem)] w-full">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-base-100 absolute inset-0 z-10 flex items-center justify-center"><div class="flex flex-col items-center gap-4"><span class="loading loading-spinner loading-lg text-primary"></span> <p class="text-base-content/70">Loading map...</p></div></div>`);
  }
  $$payload.out.push(`<!--]--> <iframe${attr("src", currentMapUrl)} class="h-full w-full" loading="lazy" allowfullscreen title="Interactive Map" onload="this.__e=event"></iframe></div> <!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let circle = each_array_1[$$index_1];
    CircleItem($$payload, { circle, onDragStart: onMouseDown, onEdit: openEditor });
  }
  $$payload.out.push(`<!--]--> `);
  if (editingCircle) {
    $$payload.out.push("<!--[-->");
    EditorModal($$payload, {
      circle: editingCircle,
      isNew: isAddingCircle,
      onCancel: cancelEditor,
      onSave: saveEditor,
      onRemove: () => removeCircle(editingCircle?.id),
      presetColors,
      onColorSelect: selectColor
    });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (store_get($$store_subs ??= {}, "$activeLegendEntries", activeLegendEntries).length > 0) {
    $$payload.out.push("<!--[-->");
    Legend($$payload, {
      entries: store_get($$store_subs ??= {}, "$activeLegendEntries", activeLegendEntries),
      onChange: (color, value) => {
        const map = new Map(store_get($$store_subs ??= {}, "$legendTexts", legendTexts));
        map.set(color, value);
        legendTexts.set(map);
      }
    });
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-base-200 text-1xl pointer-events-none absolute top-0 right-0 z-10 rounded-tr-lg px-3 py-2"><span style="color:#00ff00">Militär</span>News</div> <div class="bg-base-200 text-1xl pointer-events-none absolute bottom-0 left-0 z-10 rounded-tr-lg px-3 py-2"><span style="color:#00ff00">Militär</span>News</div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
