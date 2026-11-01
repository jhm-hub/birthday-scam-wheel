export function createVersionLibrary(storage, key, initial, normalize=x=>structuredClone(x)) {
 function read(){
  const text=storage.getItem(key);
  if(!text)return {version:1,selected:'original',versions:[{id:'original',name:'My saved settings',config:normalize(initial)}]};
  let data;try{data=JSON.parse(text);}catch{throw Error('Saved versions could not be read. They have not been overwritten.');}
  if(data?.version!==1||!Array.isArray(data.versions)||!data.versions.length||data.versions.length>30||data.versions.some(v=>!v||typeof v.id!=='string'||!v.id||typeof v.name!=='string'||!v.config||typeof v.config!=='object')||new Set(data.versions.map(v=>v.id)).size!==data.versions.length)throw Error('Saved versions could not be read. They have not been overwritten.');
  return data;
 }
 function write(data){storage.setItem(key,JSON.stringify(data));}
 function find(data,id){const v=data.versions.find(v=>v.id===id);if(!v)throw Error('Choose a saved version.');return v;}
 return {
  list:()=>read().versions.map(({id,name})=>({id,name})),
  current(){const d=read();return structuredClone(find(d,d.selected??d.versions[0].id));},
  select(id){const d=read(),v=find(d,id);d.selected=id;write(d);return structuredClone(v);},
  save(id,name,config,copy=false){
   name=String(name).trim();if(!name||name.length>40)throw Error('Give this version a name, up to 40 characters.');
   const d=read();if(copy){if(d.versions.length>=30)throw Error('Save up to 30 versions.');id=crypto.randomUUID();d.versions.push({id,name,config:normalize(config)});}else{const v=find(d,id);v.name=name;v.config=normalize(config);}
   d.selected=id;write(d);return structuredClone(find(d,id));
  }
 };
}
export function canApplyBirthday(state,busy=false){return !busy&&(state.phase==='finished'||state.phase==='ready'&&state.warmups===0&&state.mode===null&&state.turn===0);}
