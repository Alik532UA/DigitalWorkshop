import { experienceData } from '$lib/data/experience';
import { educationData } from '$lib/data/education';
import { skillsData } from '$lib/data/skills';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
    return {
        experience: experienceData,
        education: educationData,
        skills: skillsData
    };
};
