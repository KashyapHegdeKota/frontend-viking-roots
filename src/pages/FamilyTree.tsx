import React, { useEffect, useRef, useState } from 'react';
import * as f3 from 'family-chart';
import 'family-chart/styles/family-chart.css';
import type { FamilyMember } from '../components/GedcomToJSON';
import { parseGedcomFile, AncestryGedcomParser, getGedcomStats } from '../components/GedcomToJSON';

const FamilyTree = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{individualCount: number, familyCount: number, sampleIndividuals: Array<{id: string, name: string}>} | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const parsedData = await parseGedcomFile(file);
      console.log('Parsed data structure:', parsedData);
      setFamilyData(parsedData);
      
      // Read file again for stats
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const stats = getGedcomStats(content);
        setStats(stats);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error parsing GEDCOM file:', error);
      alert('Error parsing GEDCOM file. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExampleData = () => {
    const exampleGedcom = `0 HEAD
1 SOUR Ancestry.com Family Trees
1 GEDC
2 VERS 5.5.1
1 CHAR UTF-8
0 @I1@ INDI
1 NAME John /Doe/
1 SEX M
1 BIRT
2 DATE 1980
2 PLAC New York, New York, USA
1 FAMS @F1@
0 @I2@ INDI
1 NAME Jane /Smith/
1 SEX F
1 BIRT
2 DATE 1982
2 PLAC Los Angeles, California, USA
1 FAMS @F1@
0 @I3@ INDI
1 NAME Bob /Doe/
1 SEX M
1 BIRT
2 DATE 2005
2 PLAC Chicago, Illinois, USA
1 FAMC @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
1 MARR
2 DATE 10 JUN 2000
2 PLAC Las Vegas, Nevada, USA
0 TRLR`;
    
    const parser = new AncestryGedcomParser();
    const parsedData = parser.parseGedcom(exampleGedcom);
    console.log('Example parsed data:', parsedData);
    setFamilyData(parsedData);
    setStats(getGedcomStats(exampleGedcom));
  };

  useEffect(() => {
    console.log('Family data updated, length:', familyData.length);
    
    if (chartRef.current && familyData.length > 0) {
      // Clear previous chart
      chartRef.current.innerHTML = '';
      
      try {
        console.log('Creating chart with data structure:', familyData);
        
        // Create chart
        const f3Chart = f3.createChart('#FamilyChart', familyData as f3.Data);
        
        // Set display options
        f3Chart.setCardHtml()
          .setCardDisplay([
            ["first name", "last name"],
            ["birthday"],
            ["death"],
            ["occupation"]
          ]);
        
        // Initialize tree
        f3Chart.updateTree({ initial: true });
        
        console.log('Chart created successfully');
      } catch (error) {
        console.error('Error creating chart:', error);
        alert('Error creating family tree. Check console for details.');
      }
    }
  }, [familyData]);

  return (
    <div>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>Upload Ancestry.com GEDCOM File</h3>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Upload a GEDCOM file exported from Ancestry.com to visualize your family tree.
        </p>
        
        <input 
          type="file" 
          accept=".ged,.gedcom" 
          onChange={handleFileUpload}
          disabled={isLoading}
          style={{ marginBottom: '10px' }}
        />
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={loadExampleData}
            style={{ 
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            disabled={isLoading}
          >
            Load Example Data
          </button>
          
          {isLoading && (
            <span style={{ marginLeft: '10px', color: '#2196F3' }}>
              ⏳ Loading and parsing GEDCOM file...
            </span>
          )}
        </div>
        
        {stats && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h4>File Statistics:</h4>
            <p>Individuals: {stats.individualCount}</p>
            <p>Families: {stats.familyCount}</p>
            {stats.sampleIndividuals.length > 0 && (
              <div>
                <p>Sample individuals:</p>
                <ul style={{ marginTop: '5px' }}>
                  {stats.sampleIndividuals.map((ind, index) => (
                    <li key={index}>{ind.name} (ID: {ind.id})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {familyData.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Upload a GEDCOM file or click "Load Example Data" to visualize your family tree</p>
          <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
            Supported formats: GEDCOM 5.5, Ancestry.com exports
          </p>
        </div>
      )}
      
      <div 
        className="f3" 
        id="FamilyChart" 
        ref={chartRef} 
        style={{
          width: '100%', 
          height: '900px', 
          margin: 'auto', 
          backgroundColor: 'rgb(33,33,33)', 
          color: '#fff',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
    </div>
  );
};

export default FamilyTree;