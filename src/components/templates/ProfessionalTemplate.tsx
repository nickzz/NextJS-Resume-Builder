// src/components/templates/ProfessionalTemplate.tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: 'Helvetica', fontSize: 9, color: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottom: '1 solid #cbd5e1', paddingBottom: 15 },
  image: { width: 70, height: 70, borderRadius: 35, marginRight: 20, objectFit: 'cover' },
  headerInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  title: { fontSize: 12, color: '#3b82f6', fontWeight: 'bold', marginBottom: 5 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#1e293b', backgroundColor: '#f8fafc', padding: 4, marginBottom: 8, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  bold: { fontWeight: 'bold', color: '#0f172a' },
  bulletRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 5 },
  bullet: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.3 }
});

export const ProfessionalTemplate = ({ data }: { data: any }) => {
  const renderBullets = (text: string) => text?.split('\n').filter(l => l.trim()).map((line, i) => (
    <View key={i} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.bulletText}>{line.trim()}</Text></View>
  ));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {data?.profileImage && <Image src={data.profileImage} style={styles.image} />}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{data?.fullName}</Text>
            <Text style={styles.title}>{data?.position}</Text>
            <Text style={{ fontSize: 9 }}>{data?.email} | {data?.phone}</Text>
            <View style={{ flexDirection: 'row', marginTop: 3, fontSize: 8.5 }}>
              {data?.linkedin && <Text style={{ marginRight: 10 }}>LinkedIn: {data.linkedin}</Text>}
              {data?.github && <Text>GitHub: {data.github}</Text>}
            </View>
          </View>
        </View>

        {data?.careerSummary && (
          <View><Text style={styles.sectionTitle}>Executive Summary</Text><Text style={{ paddingLeft: 5, textAlign: 'justify' }}>{data.careerSummary}</Text></View>
        )}

        {data?.experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 8, paddingLeft: 5 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>{exp.company} | {exp.title}</Text>
                  <Text style={{ fontSize: 8.5 }}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                {renderBullets(exp.description)}
              </View>
            ))}
          </View>
        )}

        {data?.educations?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educations.map((edu: any, i: number) => (
              <View key={i} style={{ paddingLeft: 5, marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.bold}>{edu.university}</Text>
                  <Text>{edu.startYear} - {edu.endYear}</Text>
                </View>
                <Text style={{ fontStyle: 'italic' }}>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {data?.skills?.length > 0 && (
          <View><Text style={styles.sectionTitle}>Technical Skills</Text><Text style={{ paddingLeft: 5 }}>{data.skills.map((s: any) => s.skillName).join(' | ')}</Text></View>
        )}

        {data?.certificates?.length > 0 && (
          <View><Text style={styles.sectionTitle}>Certificates</Text>
            {data.certificates.map((c: any, i: number) => <Text key={i} style={{ paddingLeft: 5, marginBottom: 2 }}>• {c.certName} - {c.issuedBy}</Text>)}
          </View>
        )}

        {data?.languages?.length > 0 && (
          <View><Text style={styles.sectionTitle}>Languages</Text><Text style={{ paddingLeft: 5 }}>{data.languages.map((l: any) => l.languageName).join(', ')}</Text></View>
        )}

        {data?.references?.length > 0 && (
          <View><Text style={styles.sectionTitle}>References</Text>
            {data.references.map((r: any, i: number) => <Text key={i} style={{ paddingLeft: 5 }}>{r.refName}: {r.refContact}</Text>)}
          </View>
        )}
      </Page>
    </Document>
  );
};