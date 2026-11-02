export async function sharedVersionLibrary(options){
 const query=new URLSearchParams(location.search);if(query.get('view')==='stream')return options.create(localStorage);
 const requested=new URLSearchParams(location.hash.slice(1)).has('shared')||localStorage.getItem('faith-shared-edit-link-v1');
 if(!requested)return options.create(localStorage);
 const moduleURL=new URL('../birthday-darts/shared-versions.js?v=desk-v1',location.href);
 const {connectVersionLibrary}=await import(moduleURL.href);
 const library=await connectVersionLibrary(options);
 const ui=await import(new URL('../birthday-darts/shared-settings-ui.js?v=desk-v1',location.href).href);
 void ui;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('../birthday-darts/shared-settings.css',location.href).href;document.head.append(css);
 return library;
}
