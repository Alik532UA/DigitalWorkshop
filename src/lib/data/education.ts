import type { EducationItem } from './types';

/**
 * Освіта — ДАНІ. Тексти живуть у словниках локалей за ключами нижче
 * (`education.institutions[institutionKey]`, `education.descriptions[descKey]`).
 */
export const educationData = [
	{
		id: 'polytech',
		institutionKey: 'polytech_name',
		date: '2012 – 2017',
		descKey: 'polytech_desc'
	},
	{
		id: 'theater_school',
		institutionKey: 'theater_school_name',
		date: '2006 – 2013',
		descKey: 'theater_school_desc'
	}
] as const satisfies readonly EducationItem[];
