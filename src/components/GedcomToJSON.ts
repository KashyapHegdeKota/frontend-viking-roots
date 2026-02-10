// gedcomParser.ts

// Type-only exports
export type FamilyMember = {
  id: string;
  data: {
    "first name": string;
    "last name": string;
    "birthday": string;
    "gender": "M" | "F";
    "death"?: string;
    "occupation"?: string;
    "birthPlace"?: string;
    "deathPlace"?: string;
    "residence"?: string[];
  };
  rels: {
    spouses?: string[];
    children?: string[];
    parents?: string[];
  };
};

export type GedcomIndividual = {
  id: string;
  name?: {
    given?: string;
    surname?: string;
    suffix?: string;
  };
  sex?: 'M' | 'F';
  birth?: {
    date?: string;
    place?: string;
  };
  death?: {
    date?: string;
    place?: string;
  };
  occupation?: string;
  residence?: Array<{
    date?: string;
    place?: string;
  }>;
  families?: {
    spouse?: string[];
    children?: string[];
  };
  sources?: string[];
};

export type GedcomFamily = {
  id: string;
  husband?: string;
  wife?: string;
  children?: string[];
  marriage?: {
    date?: string;
    place?: string;
  };
  divorce?: {
    date?: string;
    place?: string;
  };
};

// Value exports (classes and functions)
export class AncestryGedcomParser {
  private individuals: Map<string, GedcomIndividual> = new Map();
  private families: Map<string, GedcomFamily> = new Map();
  private currentRecord: 'INDI' | 'FAM' | 'SOUR' | 'OBJE' | 'SUBM' | null = null;
  private currentId: string = '';
  private currentTag: string = '';
  private currentLevel: number = 0;
  private tagStack: Array<{ level: number; tag: string }> = [];
  private tempEvent: any = null;

  parseGedcom(gedcomContent: string): FamilyMember[] {
    this.reset();
    const lines = gedcomContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() === '') return;
      
      const parsedLine = this.parseLine(line);
      if (!parsedLine) return;
      
      const { level, tag, pointer, value } = parsedLine;
      this.processLine(level, tag, pointer, value);
    });
    
    return this.convertToFamilyMemberFormat();
  }

  private parseLine(line: string): {
    level: number;
    tag: string;
    pointer: string | null;
    value: string;
  } | null {
    line = line.trim().replace(/\r$/, '');
    if (!line) return null;
    
    const levelMatch = line.match(/^(\d+)\s+/);
    if (!levelMatch) return null;
    
    const level = parseInt(levelMatch[1], 10);
    const rest = line.substring(levelMatch[0].length).trim();
    
    let pointer = null;
    let tag = '';
    let value = '';
    
    // Check for pointer (e.g., @I123@, @F456@, @S789@)
    const pointerMatch = rest.match(/^@([^@]+)@/);
    if (pointerMatch) {
      pointer = pointerMatch[1];
      const afterPointer = rest.substring(pointerMatch[0].length).trim();
      
      // The tag is the first word after the pointer
      const tagMatch = afterPointer.match(/^(\S+)/);
      if (tagMatch) {
        tag = tagMatch[1];
        value = afterPointer.substring(tagMatch[0].length).trim();
      } else {
        tag = afterPointer;
      }
    } else {
      // Split by first space to get tag and value
      const firstSpace = rest.indexOf(' ');
      if (firstSpace > 0) {
        tag = rest.substring(0, firstSpace);
        value = rest.substring(firstSpace + 1).trim();
      } else {
        tag = rest;
      }
    }
    
    return { level, tag, pointer, value };
  }

  private processLine(level: number, tag: string, pointer: string | null, value: string): void {
    // Update stack for context tracking
    while (this.tagStack.length > 0 && this.tagStack[this.tagStack.length - 1].level >= level) {
      this.tagStack.pop();
    }
    this.tagStack.push({ level, tag });
    
    // Handle new records at level 0 with pointers
    if (level === 0 && pointer) {
      switch (tag) {
        case 'INDI':
          this.currentRecord = 'INDI';
          this.currentId = pointer;
          this.individuals.set(pointer, { id: pointer });
          break;
        case 'FAM':
          this.currentRecord = 'FAM';
          this.currentId = pointer;
          this.families.set(pointer, { id: pointer });
          break;
        case 'SOUR':
        case 'OBJE':
        case 'SUBM':
          // We don't process these record types in detail
          this.currentRecord = tag;
          this.currentId = pointer;
          break;
        default:
          this.currentRecord = null;
      }
      return;
    }
    
    // Process based on current record type
    switch (this.currentRecord) {
      case 'INDI':
        this.processIndividualLine(level, tag, value);
        break;
      case 'FAM':
        this.processFamilyLine(level, tag, value);
        break;
      // We ignore SOUR, OBJE, SUBM records for now
    }
  }

  private processIndividualLine(level: number, tag: string, value: string): void {
    const individual = this.individuals.get(this.currentId);
    if (!individual) return;
    
    // Handle different tags
    switch (tag) {
      case 'NAME':
        this.processName(value, individual);
        break;
      case 'SEX':
        individual.sex = (value === 'M' || value === 'F') ? value : undefined;
        break;
      case 'BIRT':
        this.currentTag = 'BIRT';
        if (!individual.birth) individual.birth = {};
        break;
      case 'DEAT':
        this.currentTag = 'DEAT';
        if (!individual.death) individual.death = {};
        break;
      case 'DATE':
        if (this.currentTag === 'BIRT' && individual.birth) {
          individual.birth.date = this.parseDate(value);
        } else if (this.currentTag === 'DEAT' && individual.death) {
          individual.death.date = this.parseDate(value);
        }
        break;
      case 'PLAC':
        if (this.currentTag === 'BIRT' && individual.birth) {
          individual.birth.place = value;
        } else if (this.currentTag === 'DEAT' && individual.death) {
          individual.death.place = value;
        }
        break;
      case 'OCCU':
      case 'OCC':
        individual.occupation = value;
        break;
      case 'RESI':
        if (!individual.residence) individual.residence = [];
        individual.residence.push({ place: value });
        break;
      case 'FAMS':
        // Spouse family
        if (!individual.families) individual.families = {};
        if (!individual.families.spouse) individual.families.spouse = [];
        const familyId = value.replace(/@/g, '');
        if (!individual.families.spouse.includes(familyId)) {
          individual.families.spouse.push(familyId);
        }
        break;
      case 'FAMC':
        // Child family - child can only have ONE set of parents in family-chart
        if (!individual.families) individual.families = {};
        // Only set if not already set (to prevent multiple parents)
        if (!individual.families.children) {
          individual.families.children = [];
          const childFamilyId = value.replace(/@/g, '');
          individual.families.children.push(childFamilyId);
        }
        break;
      case '_APID':
      case '_PRIM':
      case '_TREE':
      case '_ENV':
      case 'SOUR':
      case 'OBJE':
      case 'NOTE':
        // Ignore these tags
        break;
      case 'CONT':
        // Handle continuation for places
        if (this.currentTag === 'BIRT' && individual.birth?.place) {
          individual.birth.place += ' ' + value;
        } else if (this.currentTag === 'DEAT' && individual.death?.place) {
          individual.death.place += ' ' + value;
        }
        break;
    }
  }

  private processName(nameValue: string, individual: GedcomIndividual): void {
    // Handle name format like "Diana /Bristow/"
    const trimmedName = nameValue.trim();
    const surnameMatch = trimmedName.match(/\/([^/]+)\//);
    let surname = '';
    let given = '';
    let suffix = '';
    
    if (surnameMatch) {
      surname = surnameMatch[1].trim();
      const parts = trimmedName.split('/');
      given = parts[0].trim();
      if (parts[2]) suffix = parts[2].trim();
    } else {
      given = trimmedName;
    }
    
    individual.name = {
      given: given || '',
      surname: surname || '',
      suffix: suffix || ''
    };
  }

  private parseDate(dateStr: string): string {
    if (!dateStr) return '';
    
    // Remove qualifiers
    const cleanDate = dateStr
      .replace(/^(ABT|BEF|AFT|CAL|EST)\s+/i, '')
      .trim();
    
    // Try to parse
    try {
      const date = new Date(cleanDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      // Continue to other parsing
    }
    
    // Try to extract year
    const yearMatch = cleanDate.match(/\b(\d{4})\b/);
    if (yearMatch) return yearMatch[1];
    
    return cleanDate;
  }

  private processFamilyLine(level: number, tag: string, value: string): void {
    const family = this.families.get(this.currentId);
    if (!family) return;
    
    switch (tag) {
      case 'HUSB':
        family.husband = value.replace(/@/g, '');
        break;
      case 'WIFE':
        family.wife = value.replace(/@/g, '');
        break;
      case 'CHIL':
        if (!family.children) family.children = [];
        const childId = value.replace(/@/g, '');
        if (!family.children.includes(childId)) {
          family.children.push(childId);
        }
        break;
      case 'MARR':
        this.currentTag = 'MARR';
        if (!family.marriage) family.marriage = {};
        break;
      case 'DATE':
        if (this.currentTag === 'MARR' && family.marriage) {
          family.marriage.date = this.parseDate(value);
        }
        break;
      case 'PLAC':
        if (this.currentTag === 'MARR' && family.marriage) {
          family.marriage.place = value;
        }
        break;
    }
  }

  private convertToFamilyMemberFormat(): FamilyMember[] {
    const familyMembers: FamilyMember[] = [];
    
    // First, create all individuals with basic data
    this.individuals.forEach((individual, id) => {
      const familyMember: FamilyMember = {
        id,
        data: {
          "first name": individual.name?.given || '',
          "last name": individual.name?.surname || '',
          "birthday": individual.birth?.date || '',
          "gender": individual.sex || 'M',
        },
        rels: {}
      };
      
      // Add optional fields
      if (individual.death?.date) {
        familyMember.data.death = individual.death.date;
      }
      if (individual.occupation) {
        familyMember.data.occupation = individual.occupation;
      }
      if (individual.birth?.place) {
        familyMember.data.birthPlace = individual.birth.place;
      }
      if (individual.death?.place) {
        familyMember.data.deathPlace = individual.death.place;
      }
      
      familyMembers.push(familyMember);
    });
    
    // Now build relationships - CRITICAL: Ensure each child has only ONE set of parents
    const childToParentMap = new Map<string, {father?: string, mother?: string}>();
    
    // First pass: build map of children to their parents
    this.families.forEach(family => {
      if (family.children) {
        family.children.forEach(childId => {
          // Only set parents if this child doesn't already have parents
          // This prevents "child has more than 1 parent" error
          if (!childToParentMap.has(childId)) {
            childToParentMap.set(childId, {
              father: family.husband,
              mother: family.wife
            });
          }
        });
      }
    });
    
    // Second pass: apply relationships based on the map
    familyMembers.forEach(member => {
      const parents = childToParentMap.get(member.id);
      if (parents) {
        member.rels.parents = [];
        if (parents.father) member.rels.parents.push(parents.father);
        if (parents.mother) member.rels.parents.push(parents.mother);
      }
      
      // Build spouse relationships from families where this person is husband/wife
      this.families.forEach(family => {
        if (family.husband === member.id && family.wife) {
          if (!member.rels.spouses) member.rels.spouses = [];
          if (!member.rels.spouses.includes(family.wife)) {
            member.rels.spouses.push(family.wife);
          }
        } else if (family.wife === member.id && family.husband) {
          if (!member.rels.spouses) member.rels.spouses = [];
          if (!member.rels.spouses.includes(family.husband)) {
            member.rels.spouses.push(family.husband);
          }
        }
      });
    });
    
    // Third pass: build children relationships
    familyMembers.forEach(parent => {
      this.families.forEach(family => {
        if ((family.husband === parent.id || family.wife === parent.id) && family.children) {
          if (!parent.rels.children) parent.rels.children = [];
          family.children.forEach(childId => {
            if (!parent.rels.children.includes(childId)) {
              parent.rels.children.push(childId);
            }
          });
        }
      });
    });
    
    return familyMembers;
  }

  private reset(): void {
    this.individuals.clear();
    this.families.clear();
    this.currentRecord = null;
    this.currentId = '';
    this.currentTag = '';
    this.currentLevel = 0;
    this.tagStack = [];
    this.tempEvent = null;
  }
}

export async function parseGedcomFile(file: File): Promise<FamilyMember[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parser = new AncestryGedcomParser();
        const familyMembers = parser.parseGedcom(content);
        
        // Validate data structure
        if (familyMembers.length === 0) {
          throw new Error('No valid family data found in GEDCOM file');
        }
        
        // Log for debugging
        console.log('Parsed', familyMembers.length, 'family members');
        console.log('Sample data:', familyMembers.slice(0, 3));
        
        resolve(familyMembers);
      } catch (error) {
        console.error('Error parsing GEDCOM:', error);
        reject(new Error('Failed to parse GEDCOM file. Please ensure it\'s a valid GEDCOM 5.5 file.'));
      }
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error));
    };
    
    reader.readAsText(file);
  });
}

// Helper function to extract basic info for debugging
export function getGedcomStats(gedcomContent: string): {
  individualCount: number;
  familyCount: number;
  sampleIndividuals: Array<{id: string, name: string}>
} {
  const parser = new AncestryGedcomParser();
  const data = parser.parseGedcom(gedcomContent);
  
  // Count families from internal map (private access)
  const familyCount = (parser as any).families?.size || 0;
  
  const sampleIndividuals = data.slice(0, 5).map(ind => ({
    id: ind.id,
    name: `${ind.data["first name"]} ${ind.data["last name"]}`.trim()
  }));
  
  return {
    individualCount: data.length,
    familyCount,
    sampleIndividuals
  };
}