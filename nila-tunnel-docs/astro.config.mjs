// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://tunnel.nilaqloud.com',
	integrations: [
		starlight({
			title: 'Tunnel',
			description: 'Zero-config HTTPS for local development',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/b-rajesh/nila-releases' },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Quick Start', slug: 'getting-started/quickstart' },
						{ label: 'Installation', slug: 'getting-started/installation' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Configuration', slug: 'guides/configuration' },
						{ label: 'MCP Integration', slug: 'guides/mcp' },
						{ label: 'How-to', slug: 'guides/how-to' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
						{ label: 'Changelog', slug: 'reference/changelog' },
						{ label: 'Releases', slug: 'reference/releases' },
					],
				},
			],
		}),
	],
});
