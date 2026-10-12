/**
 * Санітизація SVG та HTML для DigitalWorkshop (SECURITY-v10 § 5.2).
 */
export function sanitizeSvg(svg: string): string {
	if (!svg) return '';
	return svg
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

export function sanitizeHtml(dirty: string): string {
	if (!dirty) return '';
	return sanitizeSvg(dirty);
}
