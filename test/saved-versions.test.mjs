import test from 'node:test';
import assert from 'node:assert/strict';
import {createVersionLibrary,canApplyBirthday} from '../src/saved-versions.js';
import {settings,round,activate} from '../src/model.js';
function fixture(){const data=new Map([['birthday-room-v1','existing-room']]);return {data,storage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}};}
test('existing settings migrate, versions rename/copy/reload and pairing stays untouched',()=>{
 const f=fixture(),old=settings({cash:[11,22,33,44,55,66,77,88]});let lib=createVersionLibrary(f.storage,'versions',old,settings);
 assert.deepEqual(lib.current().config.cash,old.cash);lib.save('original','Everyday',old);
 const copy=lib.save('original','Birthday', {...old,volume:.42},true);assert.equal(lib.list().length,2);
 lib.save(copy.id,'Birthday VIP',{...copy.config,seconds:8});lib=createVersionLibrary(f.storage,'versions',{},settings);
 assert.equal(lib.current().name,'Birthday VIP');assert.equal(lib.current().config.seconds,8);lib.select('original');assert.equal(lib.current().config.volume,old.volume);
 assert.equal(f.data.get('birthday-room-v1'),'existing-room');assert.equal(lib.list().length,2);
});
test('bad names, missing versions, corrupt storage and failed writes preserve saved data',()=>{
 const f=fixture(),lib=createVersionLibrary(f.storage,'versions',settings(),settings);lib.save('original','Original',settings());const before=f.data.get('versions');
 assert.throws(()=>lib.save('original',' ',{}));assert.throws(()=>lib.select('missing'));assert.equal(f.data.get('versions'),before);
 f.storage.setItem=()=>{throw Error('Storage full');};assert.throws(()=>lib.save('original','Not saved',{}),/Storage full/);assert.equal(f.data.get('versions'),before);
 f.data.set('versions','bad');assert.throws(()=>lib.save('original','Overwrite',{}));assert.equal(f.data.get('versions'),'bad');
});
test('settings cannot replace a partial round or an active reveal',()=>{
 const s=round();assert.equal(canApplyBirthday(s),true);assert.equal(canApplyBirthday(s,true),false);
 s.warmups=1;assert.equal(canApplyBirthday(s),false);s.phase='finished';assert.equal(canApplyBirthday(s),true);
 const demo=round();activate(demo,'cake',settings());assert.equal(canApplyBirthday(demo),false);
});
