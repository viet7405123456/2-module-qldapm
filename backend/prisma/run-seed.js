// Node 20 auto-detects ESM syntax in .ts files and routes the entry
// script through the ESM loader (which doesn't understand .ts) before
// ts-node ever gets a chance to register its CommonJS require hook.
// Using a plain .js CommonJS entry that requires the .ts file avoids
// that main-entry detection and lets ts-node/register handle it normally.
require('ts-node/register');
require('./seed.ts');
