// src/components/templates/MinimalTemplate.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Times-Roman', fontSize: 10, lineHeight: 1.4 },
  center: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', borderBottom: '1 solid #000', marginTop: 15, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  bold: { fontWeight: 'bold' },
  bulletRow: { flexDirection: 'row', marginBottom: 3, marginLeft: 15 },
  bullet: { width: 12 },
  bulletText: { flex: 1, textAlign: 'justify' }
});

export const MinimalTemplate = ({ data }: { data: any }) => {
  const renderBullets = (text: string) => text?.split('\n').filter(l => l.trim()).map((line, i) => (
    <View key={i} style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{line.trim()}</Text>
    </View>
  ));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.center}>
          <Text style={styles.name}>{data?.fullName}</Text>
          <Text>{data?.email}  |  {data?.phone}  |  {data?.address}</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            {data?.linkedin && <Text style={{ marginRight: 15 }}>LinkedIn: {data.linkedin}</Text>}
            {data?.github && <Text>GitHub: {data.github}</Text>}
          </View>
        </View>

        {data?.careerSummary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ textAlign: 'justify' }}>{data.careerSummary}</Text>
          </View>
        )}

        {data?.experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp: any, i: number) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{exp.company}</Text>
                  <Text>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                </View>
                <Text style={{ fontStyle: 'italic', marginBottom: 3 }}>{exp.title}</Text>
                {renderBullets(exp.description)}
              </View>
            ))}
          </View>
        )}

        {data?.educations?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educations.map((edu: any, i: number) => (
              <View key={i} style={{ marginBottom: 5 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{edu.university}</Text>
                  <Text>{edu.startYear} - {edu.endYear}</Text>
                </View>
                <Text>{edu.degree}</Text>
              </View>
            ))}
          </View>
        )}

        {data?.skills?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text>{data.skills.map((s: any) => s.skillName).join(', ')}</Text>
          </View>
        )}

        {data?.certificates?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {data.certificates.map((c: any, i: number) => (
              <Text key={i} style={{ marginBottom: 2 }}>• {c.certName} ({c.issuedBy})</Text>
            ))}
          </View>
        )}

        {data?.languages?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text>{data.languages.map((l: any) => l.languageName).join(', ')}</Text>
          </View>
        )}

        {data?.references?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>References</Text>
            {data.references.map((r: any, i: number) => (
              <Text key={i} style={{ marginBottom: 2 }}>{r.refName}: {r.refContact}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};