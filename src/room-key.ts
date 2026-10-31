export function randomKey(): string { return [...crypto.getRandomValues(new Uint8Array(32))].map(n => n.toString(16).padStart(2, '0')).join(''); }
export function validKey(value: unknown): value is string { return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value); }
function keyBytes(key: string): Uint8Array<ArrayBuffer> { return Uint8Array.from(key.match(/../g)!, n => Number.parseInt(n, 16)); }
export async function roomId(key: string): Promise<string> {
    if (!validKey(key)) throw new Error('Invalid room key');
    const digest = await crypto.subtle.digest('SHA-256', keyBytes(key));
    return 'birthday-' + [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
}
export async function proof(key: string, challenge: string): Promise<string> {
    const imported = await crypto.subtle.importKey('raw', keyBytes(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', imported, new TextEncoder().encode(challenge));
    return [...new Uint8Array(signature)].map(n => n.toString(16).padStart(2, '0')).join('');
}
export async function verifyProof(key: string, challenge: string, signature: unknown): Promise<boolean> {
    if (!validKey(signature)) return false;
    const imported = await crypto.subtle.importKey('raw', keyBytes(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    return crypto.subtle.verify('HMAC', imported, keyBytes(signature), new TextEncoder().encode(challenge));
}

export class RecentIds {
    private ids = new Set<string>();
    accept(id: unknown): id is string {
        if (typeof id !== 'string' || !id || id.length > 128 || this.ids.has(id)) return false;
        this.ids.add(id);
        if (this.ids.size > 500) this.ids.delete(this.ids.values().next().value!);
        return true;
    }
}
