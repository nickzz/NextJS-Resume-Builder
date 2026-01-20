// src/lib/json-resume-mapper.ts

export function mapToJSONResume(resume: any) {
  const profiles = [];
  if (resume.linkedin) profiles.push({ network: "LinkedIn", url: resume.linkedin });
  if (resume.github) profiles.push({ network: "GitHub", url: resume.github });

  return {
    basics: {
      name: resume.fullName,
      label: resume.position,
      email: resume.email,
      phone: resume.phone,
      location: { address: resume.address },
      birth: {
        date: "" // Provide empty string instead of undefined to avoid helper crashes
      },
      profiles: profiles,
      summary: resume.careerSummary,
      image: resume.profileImage
    },
    work: resume.experiences.map((exp: any) => ({
      name: exp.company,
      position: exp.title,
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: exp.description
    })),
    education: resume.educations.map((edu: any) => ({
      institution: edu.university,
      area: edu.degree,
      startDate: edu.startYear,
      endDate: edu.endYear
    })),
    skills: resume.skills.map((s: any) => ({
      name: s.skillName,
      keywords: [s.skillType]
    })),
    certificates: resume.certificates.map((c: any) => ({
      name: c.certName,
      issuer: c.issuedBy,
      date: c.issuedDate
    }))
  };
}