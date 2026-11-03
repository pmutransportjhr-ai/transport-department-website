#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (message) => { console.error('FAIL:', message); process.exitCode = 1; };
const pass = (message) => console.log('PASS:', message);

const index = read('index.html');
const engine = read('js/renderEngine.js');
const jquery = read('js/jquery.min.js');
const bootstrapJs = read('js/bootstrap.bundle.min.js');
const bootstrapCss = read('css/bootstrap.min.css');
const headers = read('security/nginx-response-headers.conf');
const protect = read('security/nginx-protect-public-files.conf');
const sbom = JSON.parse(read('security/third-party-components.cdx.json'));

if (!/jQuery v4\.0\.0/.test(jquery)) fail('jQuery asset is not 4.0.0'); else pass('jQuery 4.0.0 asset identified');
if (!/Bootstrap v5\.3\.8/.test(bootstrapJs)) fail('Bootstrap JS asset is not 5.3.8'); else pass('Bootstrap JS 5.3.8 identified');
if (!/Bootstrap v5\.3\.8/.test(bootstrapCss)) fail('Bootstrap CSS asset is not 5.3.8'); else pass('Bootstrap CSS 5.3.8 identified');

if (/^\s*this\.renderSocialMediaHub\(\);/m.test(engine)) fail('Social Media Hub is still invoked by homepage initialization');
else if (!/\/\/\s*this\.renderSocialMediaHub\(\);/.test(engine)) fail('Expected commented Social Media renderer call was not found');
else pass('Social Media Hub renderer is disabled');

if (!/TEMPORARILY DISABLED AT USER REQUEST/.test(index)) fail('Social Media section is not clearly commented out in index.html');
else pass('Social Media section is marked disabled in homepage HTML');

const schemeMatch = engine.match(/const schemes = \[([\s\S]*?)\n\s*\];/);
if (!schemeMatch) fail('Road-safety schemes array not found');
else {
  const activeSchemeSource = schemeMatch[1].replace(/\/\*[\s\S]*?\*\//g, '');
  const activeCount = (activeSchemeSource.match(/title:\s*"/g) || []).length;
  if (activeCount !== 3) fail('Expected exactly 3 active homepage scheme cards; found ' + activeCount);
  else pass('Exactly 3 active homepage scheme cards');
  if (!schemeMatch[1].includes('IRC Road Safety Signs') || !schemeMatch[1].includes('Temporarily disabled at user request'))
    fail('Fourth scheme card is not retained as a commented-out entry');
  else pass('Fourth scheme card is commented out');
}

if (/Access-Control-Allow-Origin/.test(headers)) fail('Shared response headers must not set global CORS');
else pass('Shared response headers do not set global CORS');
if (/sets CORS to the one official portal origin/i.test(headers)) fail('Stale global-CORS comment remains');
else pass('Shared response-header comments accurately describe CORS scope');

if (!protect.includes('location ^~ /security/')) fail('Nginx protection snippet does not block /security/');
if (!protect.includes('location ~ /\\.(?!well-known')) fail('Nginx protection snippet does not deny dotfiles with an ACME exception');
if (protect.includes('well-known')) pass('ACME .well-known path is intentionally excepted');
if (protect.includes('location ^~ /security/') && protect.includes('location ~ /\\.(?!well-known'))
  pass('Nginx public-path protection rules are present');

const versions = new Map((sbom.components || []).map(c => [c.name, c.version]));
if (versions.get('jquery') !== '4.0.0' || versions.get('bootstrap') !== '5.3.8')
  fail('CycloneDX SBOM does not match jQuery 4.0.0 / Bootstrap 5.3.8');
else pass('CycloneDX inventory matches bundled jQuery and Bootstrap versions');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name === '.git' || entry.name === 'node_modules') return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : (entry.isFile() && entry.name.endsWith('.js') ? [full] : []);
});
let syntaxFailed = false;
for (const file of walk(path.join(root, 'js'))) {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (check.status !== 0) {
    syntaxFailed = true;
    fail('JavaScript syntax error in ' + path.relative(root, file) + ': ' + (check.stderr || check.stdout));
  }
}
if (!syntaxFailed) pass('All JavaScript files pass node --check');

const tmpArchive = path.join(os.tmpdir(), 'transport-portal-webroot-qa-' + process.pid + '.tar.gz');
const packageBuild = spawnSync('bash', [path.join(root, 'scripts/build-deployment-package.sh'), tmpArchive], { encoding: 'utf8' });
if (packageBuild.status !== 0) fail('Safe deployment package build failed: ' + (packageBuild.stderr || packageBuild.stdout));
else {
  const listing = spawnSync('tar', ['-tzf', tmpArchive], { encoding: 'utf8' });
  const unsafe = listing.stdout.split(/\r?\n/).filter((entry) =>
    /(^|\/)(\.git|security|\.github|scripts|tests|node_modules|backup)(\/|$)|(^|\/)\.htaccess$/.test(entry)
  );
  if (listing.status !== 0 || unsafe.length) fail('Deployment archive includes prohibited paths: ' + unsafe.join(', '));
  else pass('Deployment archive excludes repository/server-only/test/backup files');
  fs.rmSync(tmpArchive, { force: true });
}
if (process.exitCode) process.exit(process.exitCode);
