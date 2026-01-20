// src/components/templates/ModernTemplate.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#334155', lineHeight: 1.5 },
  header: { borderBottom: '2 solid #3b82f6', paddingBottom: 12, marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#3b82f6', fontWeight: 'bold', marginTop: 10 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, columnGap: 12, rowGap: 4, fontSize: 9 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e293b', borderBottom: '1 solid #e2e8f0', paddingBottom: 2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  entry: { marginBottom: 10 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  reference: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 2 },
  bold: { fontWeight: 'bold', color: '#1e293b', maxWidth: '75%' },
  date: { fontSize: 9, color: '#64748b', textAlign: 'right' },
  bulletRow: { flexDirection: 'row', marginBottom: 3, paddingLeft: 4 },
  bullet: { width: 10, fontSize: 10 },
  bulletText: { flex: 1 }
});

export const ModernTemplate = ({ data }: { data: any }) => {
  const renderBullets = (text: string) => {
    if (!text) return null;

    // Split by new lines OR semicolons, then filter out any empty strings
    const bulletPoints = text
      .split(/[;\n]/)
      .map(point => point.trim())
      .filter(point => point.length > 0);

    return bulletPoints.map((point, i) => (
      <View key={i} style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{point}</Text>
      </View>
    ));
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data?.fullName}</Text>
          <Text style={styles.subtitle}>{data?.position}</Text>
          <View style={styles.contactRow}>
            <Text>{data?.email}</Text>
            <Text>| {data?.phone}</Text>
            {data?.linkedin && <Text>| LinkedIn: {data.linkedin}</Text>}
            {data?.github && <Text>| GitHub: {data.github}</Text>}
            <Text>| {data?.address}</Text>
          </View>
        </View>

        {data?.careerSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ textAlign: 'justify' }}>{data.careerSummary}</Text>
          </View>
        )}

        {data?.experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp: any, i: number) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>{exp.company} — {exp.title}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                {renderBullets(exp.description)}
              </View>
            ))}
          </View>
        )}

        {data?.educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educations.map((edu: any, i: number) => (
              <View key={i} style={styles.entryHeader}>
                <Text style={styles.bold}>• {edu.degree}, {edu.university}</Text>
                <Text style={styles.date}>{edu.startYear} - {edu.endYear}</Text>
              </View>
            ))}
          </View>
        )}

        {data?.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(
              data.skills.reduce((acc: any, skill: any) => {
                const type = skill.skillType || "Skills";
                if (!acc[type]) acc[type] = [];

                const individualSkills = skill.skillName
                  .split(';')
                  .map((s: string) => s.trim())
                  .filter((s: string) => s !== "");

                acc[type].push(...individualSkills);
                return acc;
              }, {})
            ).map(([type, names]: any, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 3, flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>{type} : </Text>
                <Text style={{ color: '#334155' }}>
                  {/* Join all unique skills with a comma followed by a space */}
                  {[...new Set(names)].join(', ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data?.certificates?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {data.certificates.map((c: any, i: number) => (
              <View key={i} style={styles.entryHeader}>
                <Text style={styles.bold}>• {c.certName} ({c.issuedBy})</Text>
                <Text style={styles.date}>{c.issuedDate} - {c.expiryDate}</Text>
              </View>
            ))}
          </View>
        )}

        {data?.languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((r: any, i: number) => (
              <Text key={i} style={{ marginBottom: 2 }}>• {r.language}: {r.proficiency}</Text>
            ))}
          </View>
        )}

        {data?.references?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            {data.references.map((r: any, i: number) => (
              <View key={i} style={styles.reference}>
                <Text style={styles.bold}>{r.refName}</Text>
                <Text>{r.position}</Text>
                <Text>{r.company}</Text>
                <Text>{r.email} | {r.phoneNo}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};